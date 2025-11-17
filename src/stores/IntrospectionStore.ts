"use client";

import { create } from "zustand";
import { useSettingsStore } from "./SettingsStore";
import { BoardCommand } from "@/types/BoardCommand";

export type IntrospectionCommand = {
    type: string;
    _types?: Record<string, string>;
};

type IntrospectionState = {
    commands: BoardCommand[];
    loading: boolean;
    error?: string;
    load: () => Promise<void>;
    sendCommandUrl?: string;
};

export const useIntrospectionStore = create<IntrospectionState>((set) => ({
    commands: [],
    loading: false,
    error: undefined,

    load: async () => {
        set({ loading: true, error: undefined });

        try {
            const settings = useSettingsStore.getState();
            const baseUrl = `${settings.pekkoWss ? "https" : "http"}://${settings.pekkoIp}:${settings.pekkoPort}`;
            const url = `${baseUrl}/api/introspection`;
            const res = await fetch(url, {
                method: "GET",
                cache: "no-store", // ensure fresh values
            });

            if (!res.ok) throw new Error("Failed to fetch introspection");

            const data = (await res.json()) as BoardCommand[];
            set({ commands: data, loading: false, sendCommandUrl: `${baseUrl}/api/message` });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            set({ loading: false, error: e?.message });
        }
    },
}));
