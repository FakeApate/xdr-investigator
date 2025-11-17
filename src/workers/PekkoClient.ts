// src/workers/PekkoWebSocketClient.ts
import { useSettingsStore } from "@/stores/SettingsStore";
import SettingsStore from "@/types/SettingsStore";

import type {
  PekkoWorkerIn,
  PekkoWorkerOut,
} from "./pekko-websocket.worker";
import { wsLogger } from "@/logging/loggers";
import { BoardStatusResponse } from "@/types/BoardStatusResponse";
import { BoardStatusListener } from "@/types/BoardStatusListener";

export interface PekkoEvent {
  data: BoardStatusResponse;
  receivedAt: number;
};


export default class PekkoClient {
  private worker?: Worker;
  private settings?: SettingsStore;
  private listeners = new Set<BoardStatusListener>();

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
    wsLogger.debug(msg, `WebSocket event: ${msg.type}`);
    switch (msg.type) {

      case "MESSAGE":
        const event: PekkoEvent = {
          data: msg.data,
          receivedAt: Date.now(),
        }

        this.emit(event);
        wsLogger.debug(event, "WebSocket MESSAGE");
        break;

      case "ERROR":
        wsLogger.error({ error: msg.error }, "WebSocket ERROR");
        break;
    }
  };

  // --- public API ---

  public close() {
    if (!this.worker) return;
    this.worker.postMessage({ type: "CLOSE" } as PekkoWorkerIn);
    this.worker.terminate();
    this.worker = undefined;
  }

  public onStatus(callback: BoardStatusListener) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private emit(event: PekkoEvent) {
    for (const l of this.listeners) l(event.data);
  }
}
