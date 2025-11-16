"use client";

import { create } from "zustand";
import type { BoardCommand } from "@/types/BoardCommand";
import type { PekkoEvent } from "@/workers/PekkoClient";
import { getPekkoClient } from "@/workers/PekkoClientSingelton";

type PekkoStore = {
    _initialized: boolean;
    status: "idle" | "online" | "reconnecting" | "closed";
    reconnectAttempt?: number;
    reconnectDelayMs?: number;
    lastMessage?: PekkoEvent;  // only kind === "message"
    init: () => void;
    sendCommand: (cmd: BoardCommand) => void;
};


export const usePekkoStore = create<PekkoStore>((set, get) => ({
    connected: false,
    lastEvent: undefined,
    events: [],
    _initialized: false,
    status: "idle",
    sendCommand: (cmd: BoardCommand) => {
        const client = getPekkoClient();
        client?.sendCommand(cmd);
    },
    init: () => {
        if (get()._initialized) return;

        const client = getPekkoClient();
        if (!client) return;

        client.subscribe((event) => {
            if (event.kind === "status") {
                if (event.status === "open") {
                    set({
                        status: "online",
                        reconnectAttempt: undefined,
                        reconnectDelayMs: undefined,
                    });
                } else if (event.status === "reconnecting") {
                    set({
                        status: "reconnecting",
                        reconnectAttempt: event.attempt,
                        reconnectDelayMs: event.delayMs,
                    });
                } else if (event.status === "closed") {
                    set({ status: "closed" });
                }
            } else if (event.kind === "message") {
                set({ lastMessage: event });
            }
        });

        set({ _initialized: true, status: "reconnecting" }); // initial "connecting"
    },
}));
