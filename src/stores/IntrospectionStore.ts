"use client";

import { create } from "zustand";
import { useSettingsStore } from "./SettingsStore";

export type IntrospectionCommand = {
    type: string;
    _types?: Record<string, string>;
};

type IntrospectionState = {
    commands: IntrospectionCommand[];
    loading: boolean;
    error?: string;
    load: () => Promise<void>;
};

export const useIntrospectionStore = create<IntrospectionState>((set) => ({
    commands: [],
    loading: false,
    error: undefined,

    load: async () => {
        set({ loading: true, error: undefined });

        try {
            const settings = useSettingsStore.getState();
            const url = `${settings.pekkoWss ? "https" : "http"}://${settings.pekkoIp}:${settings.pekkoPort}/api/introspection`;
            const res = await fetch(url, {
                method: "GET",
                cache: "no-store", // ensure fresh values
            });

            if (!res.ok) throw new Error("Failed to fetch introspection");

            const data = (await res.json()) as IntrospectionCommand[];
            set({ commands: data, loading: false });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            set({ loading: false, error: e?.message });
        }
    },
}));
