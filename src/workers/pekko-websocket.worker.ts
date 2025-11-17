/// <reference lib="webworker" />

import type { BoardCommand } from "@/types/BoardCommand";
import { BoardStatusResponse } from "@/types/BoardStatusResponse";

export type PekkoWorkerIn =
    | { type: "INIT"; settings: { wsUrl: string } }
    | { type: "CLOSE" };

export type PekkoWorkerOut =
    | { type: "OPEN" }
    | { type: "DEBUG"; message: string }
    | { type: "MESSAGE"; data: BoardStatusResponse }
    | { type: "ERROR"; error: string }
    | { type: "CLOSED"; code: number; reason: string; willReconnect: boolean }
    | { type: "RECONNECTING"; attempt: number; delayMs: number };

let socket: WebSocket | null = null;
let wsUrl: string | null = null;
let shouldReconnect = true;
let reconnectAttempt = 0;
let reconnectTimer: number | null = null;

// backoff config
const BASE_DELAY_MS = 500;          // first delay
const MAX_DELAY_MS = 15000;         // cap
const JITTER_MS = 250;              // +/- random

// simple queue for commands while disconnected
const pendingCommands: BoardCommand[] = [];

const ctx: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<PekkoWorkerIn>) => {
    const msg = event.data;

    switch (msg.type) {
        case "INIT": {
            wsUrl = msg.settings.wsUrl;
            shouldReconnect = true;
            reconnectAttempt = 0;
            clearReconnectTimer();
            connect();
            break;
        }

        case "CLOSE": {
            shouldReconnect = false;
            clearReconnectTimer();
            if (socket) {
                socket.close(1000, "Client closed");
                socket = null;
            }
            break;
        }
    }
};

function connect() {
    if (!wsUrl) return;

    // in case we call connect() while a socket still exists
    if (socket && socket.readyState === WebSocket.OPEN) {
        return;
    }

    try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            reconnectAttempt = 0;
            clearReconnectTimer();
            ctx.postMessage({ type: "OPEN" } satisfies PekkoWorkerOut);
            // flush queued commands
            while (pendingCommands.length > 0 && socket?.readyState === WebSocket.OPEN) {
                const cmd = pendingCommands.shift()!;
                socket.send(JSON.stringify(cmd));
            }
        };

        socket.onmessage = (ev) => {
            ctx.postMessage({
                type: "MESSAGE",
                data: safeParseJson(ev.data),
            } satisfies PekkoWorkerOut);
        };

        socket.onerror = () => {
            ctx.postMessage({
                type: "ERROR",
                error: "WebSocket error",
            } satisfies PekkoWorkerOut);
            // onerror is usually followed by onclose, but we’re defensive
        };

        socket.onclose = (ev) => {
            socket = null;

            if (shouldReconnect) {
                scheduleReconnect();
            }

            ctx.postMessage({
                type: "CLOSED",
                code: ev.code,
                reason: ev.reason,
                willReconnect: shouldReconnect,
            } satisfies PekkoWorkerOut);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        ctx.postMessage({
            type: "ERROR",
            error: e?.message ?? "Failed to create WebSocket",
        } satisfies PekkoWorkerOut);

        if (shouldReconnect) {
            scheduleReconnect();
        }
    }
}

function scheduleReconnect() {
    if (!shouldReconnect || !wsUrl) return;

    reconnectAttempt += 1;

    const baseDelay = BASE_DELAY_MS * Math.pow(2, reconnectAttempt - 1);
    const delayWithoutJitter = Math.min(baseDelay, MAX_DELAY_MS);
    const jitter = (Math.random() * 2 - 1) * JITTER_MS;
    const delayMs = Math.max(0, delayWithoutJitter + jitter);

    ctx.postMessage({
        type: "RECONNECTING",
        attempt: reconnectAttempt,
        delayMs,
    } satisfies PekkoWorkerOut);

    clearReconnectTimer();
    reconnectTimer = setTimeout(connect, delayMs) as unknown as number;
}

function clearReconnectTimer() {
    if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
}

function safeParseJson(data: unknown): BoardStatusResponse {
    if (typeof data !== "string") throw new Error("Data is not a string");
    return JSON.parse(data);
}
