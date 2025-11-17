"use client";

import { useEffect } from "react";
import { useIntrospectionStore } from "@/stores/IntrospectionStore";

export function useIntrospection() {
    const load = useIntrospectionStore((s) => s.load);
    const commands = useIntrospectionStore((s) => s.commands);
    const loading = useIntrospectionStore((s) => s.loading);
    const error = useIntrospectionStore((s) => s.error);
    const sendCommandUrl = useIntrospectionStore((s) => s.sendCommandUrl);

    useEffect(() => {
        if (commands.length === 0) {
            load();
        }
    }, [commands.length, load]);

    return { commands, loading, error, sendCommandUrl };
}