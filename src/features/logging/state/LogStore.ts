"use client";

import { create } from "zustand";

export type LogLevelName = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export type LogEntry = {
    id: number;
    time: string;     // ISO string
    level: LogLevelName;
    scope?: string;   // from pino child, e.g. "ws"
    msg: string;
    data?: unknown;   // extra fields
};

type LogStore = {
    entries: LogEntry[];
    nextId: number;
    maxEntries: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addFromPino: (logObj: any) => void;
    clearScope: (scope: string) => void;
    clearAll: () => void;
};

const levelMap: Record<number, LogLevelName> = {
    10: "trace",
    20: "debug",
    30: "info",
    40: "warn",
    50: "error",
    60: "fatal",
};

export const useLogStore = create<LogStore>((set) => ({
    entries: [],
    nextId: 1,
    maxEntries: 500, // keep it bounded

    addFromPino: (logObj) =>
        set((state) => {
            const id = state.nextId;
            const levelNum = logObj.level as number;
            const level = levelMap[levelNum] ?? "info";
            const time =
                typeof logObj.time === "string"
                    ? logObj.time
                    : new Date(logObj.time ?? Date.now()).toISOString();

            const { msg, scope, ...rest } = logObj;

            const entry: LogEntry = {
                id,
                time,
                level,
                scope,
                msg,
                data: Object.keys(rest).length ? rest : undefined,
            };

            const entries = [...state.entries, entry];
            const trimmed =
                entries.length > state.maxEntries
                    ? entries.slice(entries.length - state.maxEntries)
                    : entries;

            return {
                entries: trimmed,
                nextId: id + 1,
            };
        }),

    clearScope: (scope) =>
        set((state) => ({
            entries: state.entries.filter((e) => e.scope !== scope),
        })),

    clearAll: () => set({ entries: [] }),
}));
