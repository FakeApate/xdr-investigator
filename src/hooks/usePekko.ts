"use client";

import { useEffect } from "react";
import { usePekkoStore } from "@/stores/PekkoStore";

export function usePekko() {
    const init = usePekkoStore((s) => s.init);
    const status = usePekkoStore((s) => s.status);
    const attempt = usePekkoStore((s) => s.reconnectAttempt);
    const delayMs = usePekkoStore((s) => s.reconnectDelayMs);
    const lastMessage = usePekkoStore((s) => s.lastMessage);
    const sendCommand = usePekkoStore((s) => s.sendCommand);

    useEffect(() => {
        init();
    }, [init]);

    return { status, attempt, delayMs, lastMessage, sendCommand };
}

