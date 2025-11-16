// src/workers/PekkoWebSocketClient.ts
import { useSettingsStore } from "@/stores/SettingsStore";
import SettingsStore from "@/types/SettingsStore";
import type { BoardCommand } from "@/types/BoardCommand";
import type {
  PekkoWorkerIn,
  PekkoWorkerOut,
} from "./pekko-websocket.worker";
import { wsLogger } from "@/logging/loggers";

export type PekkoEvent =
  | {
    kind: "message";
    raw: unknown;
    receivedAt: number;
  }
  | {
    kind: "status";
    status: "open" | "closed" | "reconnecting";
    attempt?: number;
    delayMs?: number;
    code?: number;
    reason?: string;
  };


export default class PekkoClient {
  private worker?: Worker;
  private settings?: SettingsStore;
  private listeners = new Set<(event: PekkoEvent) => void>();

  constructor() {
    this.settings = this.tryLoadSettings();

    if (typeof window !== "undefined") {
      this.worker = new Worker(
        new URL("./pekko-websocket.worker.ts", import.meta.url),
        { type: "module" }
      );
      this.worker.onmessage = this.handleWorkerMessage;
      this.initWorker();
    }
  }

  private tryLoadSettings(): SettingsStore | undefined {
    const settingsStore = useSettingsStore.getState();
    return settingsStore || undefined;
  }

  private initWorker() {
    if (!this.worker || !this.settings) return;
    const wsUrl = `${this.settings.pekkoWss ? "wss" : "ws"}://${this.settings.pekkoIp}:${this.settings.pekkoPort}/ws`;
    const msg: PekkoWorkerIn = {
      type: "INIT",
      settings: {
        wsUrl,
      },
    };

    this.worker.postMessage(msg);
  }

  private handleWorkerMessage = (event: MessageEvent<PekkoWorkerOut>) => {
    const msg = event.data;

    if (msg.type === "DEBUG") {
      wsLogger.debug(msg.message);
      return;
    }
    switch (msg.type) {
      case "OPEN":
        wsLogger.info("WebSocket OPEN");
        this.emit({
          kind: "status",
          status: "open",
        });
        break;

      case "RECONNECTING":
        this.emit({
          kind: "status",
          status: "reconnecting",
          attempt: msg.attempt,
          delayMs: msg.delayMs,
        });
        wsLogger.warn(
          {
            attempt: msg.attempt,
            delayMs: msg.delayMs,
          },
          "WebSocket RECONNECTING"
        );
        break;

      case "CLOSED":
        this.emit({
          kind: "status",
          status: "closed",
          code: msg.code,
          reason: msg.reason,
        });
        wsLogger.warn({
          code: msg.code,
          reason: msg.reason,
          willReconnect: msg.willReconnect,
        }, "WebSocket CLOSED");
        break;

      case "MESSAGE":
        this.emit({
          kind: "message",
          raw: msg.data,
          receivedAt: Date.now(),
        });
        wsLogger.debug({ data: msg.data }, "WebSocket MESSAGE");
        break;

      case "ERROR":
        wsLogger.error({ error: msg.error }, "WebSocket ERROR");
        break;
    }
  };

  // --- public API ---

  public sendCommand(command: BoardCommand) {
    if (!this.worker) return;
    const msg: PekkoWorkerIn = { type: "SEND_COMMAND", command };
    this.worker.postMessage(msg);
  }

  public close() {
    if (!this.worker) return;
    this.worker.postMessage({ type: "CLOSE" } as PekkoWorkerIn);
    this.worker.terminate();
    this.worker = undefined;
  }

  public subscribe(listener: (event: PekkoEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: PekkoEvent) {
    for (const l of this.listeners) l(event);
  }
}
