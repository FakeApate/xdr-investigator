"use client";

import { create } from "zustand";
import { BoardLevelStore } from "@/features/boards-display/types/BoardLevelStore";
import { sendCommand } from "@/shared/lib/sendCommand";
import { BoardLevelsResponse } from "@/features/commands/types/BoardLevelsResponse";
import { useIntrospectionStore } from "@/features/commands/state/IntrospectionStore";
import { BoardLevel } from "../types/Level";
import { BoardLevelsInfoResponse } from "@/features/commands/types/BoardLevelsInfoResponse";

let autoRefreshIntervalId: number | undefined;

const AUTO_REFRESH_MS = 60_000; // 1 minute
useIntrospectionStore.getState().load();
export const useBoardLevelStore = create<BoardLevelStore>()(
    (set, get) => ({
        levels: [],
        loading: false,
        error: undefined,
        lastInfo: undefined,
        load: async () => {
            set({ loading: true, error: undefined });
            try {
                const { sendCommandUrl } = useIntrospectionStore.getState();
                if (!sendCommandUrl) {
                    throw new Error("Send command URL is not available");
                }

                const data = await sendCommand(sendCommandUrl, { type: "GetBoardLevels" }) as BoardLevelsResponse;
                const levels: BoardLevel[] = Object.entries(data).map(([levelId, levelData]) => ({
                    name: levelId.split(".")[0] || levelId,
                    data: levelData,
                }));
                set({ levels, loading: false });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                set({ loading: false, error: e?.message });
            }
        },

        // lightweight info check using GetBoardLevelsInfo
        checkForUpdates: async () => {
            try {
                const { sendCommandUrl } = useIntrospectionStore.getState();
                if (!sendCommandUrl) {
                    throw new Error("Send command URL is not available");
                }

                const info = (await sendCommand(sendCommandUrl, {
                    type: "GetBoardLevelsInfo",
                })) as BoardLevelsInfoResponse;

                const prevInfo = get().lastInfo;

                // if first time, store info and do a full load
                if (!prevInfo) {
                    set({ lastInfo: info });
                    await get().load();
                    return;
                }

                // hash changed → reload levels and update info
                if (info.currentHash !== prevInfo.currentHash) {
                    set({ lastInfo: info });
                    await get().load();
                } else {
                    // nothing changed, just update lastInfo (e.g. lastModified)
                    set({ lastInfo: info });
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                // don't flip loading here, this is a light check
                set({ error: e?.message });
            }
        },

        startAutoRefresh: () => {
            if (typeof window === "undefined") return; // SSR safety
            if (autoRefreshIntervalId !== undefined) return; // already running

            // initial check immediately
            void get().checkForUpdates();

            autoRefreshIntervalId = window.setInterval(() => {
                void get().checkForUpdates();
            }, AUTO_REFRESH_MS);
        },

        stopAutoRefresh: () => {
            if (autoRefreshIntervalId !== undefined) {
                clearInterval(autoRefreshIntervalId);
                autoRefreshIntervalId = undefined;
            }
        },
    }));