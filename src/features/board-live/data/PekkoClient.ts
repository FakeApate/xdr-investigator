// src/workers/PekkoWebSocketClient.ts
import { useSettingsStore } from "@/features/settings/state/SettingsStore";
import SettingsStore from "@/features/settings/types/SettingsStore";

import type {
  PekkoWorkerIn,
  PekkoWorkerOut,
} from "./pekko-websocket.worker";
import { wsLogger } from "@/features/logging/lib/loggers";
import { BoardStatusResponse } from "@/features/board-live/types/BoardStatusResponse";
import { BoardStatusListener } from "@/features/board-live/types/BoardStatusListener";

export interface PekkoEvent {
  data: BoardStatusResponse;
  receivedAt: number;
};


export default class PekkoClient {
  private worker?: Worker;
  private settings?: SettingsStore;
  private listeners = new Set<BoardStatusListener>();
  private unsubscribeSettings?: () => void;

  constructor() {
    if (typeof window !== "undefined") {
      this.settings = this.tryLoadSettings();
      this.startWorker();
      this.subscribeToSettings();
    }
  }

  private tryLoadSettings(): SettingsStore | undefined {
    const settingsStore = useSettingsStore.getState();
    return settingsStore || undefined;
  }

  private subscribeToSettings() {
    // keep the worker in sync with settings (IP/port/protocol/reconnect)
    this.unsubscribeSettings = useSettingsStore.subscribe((state, prevState) => {
      if (
        state.pekkoIp !== prevState.pekkoIp ||
        state.pekkoPort !== prevState.pekkoPort ||
        state.pekkoWss !== prevState.pekkoWss ||
        state.pekkoAutoReconnect !== prevState.pekkoAutoReconnect
      ) {
        this.refreshConnection(state);
      }
    });
  }

  private startWorker() {
    this.worker = new Worker(
      new URL("./pekko-websocket.worker.ts", import.meta.url),
      { type: "module" }
    );
    this.worker.onmessage = this.handleWorkerMessage;
    this.initWorker();
  }

  private initWorker() {
    if (!this.worker || !this.settings) return;
    const wsUrl = `${this.settings.pekkoWss ? "wss" : "ws"}://${this.settings.pekkoIp}:${this.settings.pekkoPort}/ws`;
    const msg: PekkoWorkerIn = {
      type: "INIT",
      settings: {
        wsUrl,
        autoReconnect: this.settings.pekkoAutoReconnect ?? false,
      },
    };

    this.worker.postMessage(msg);
  }

  private refreshConnection(nextSettings: SettingsStore) {
    this.settings = nextSettings;
    if (this.worker) {
      this.worker.postMessage({ type: "CLOSE" } as PekkoWorkerIn);
      this.worker.terminate();
    }
    this.startWorker();
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
    if (this.unsubscribeSettings) {
      this.unsubscribeSettings();
      this.unsubscribeSettings = undefined;
    }
  }

  public onStatus(callback: BoardStatusListener) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private emit(event: PekkoEvent) {
    for (const l of this.listeners) l(event.data);
  }
}
