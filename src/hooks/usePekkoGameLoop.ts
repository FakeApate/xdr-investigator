import { useCallback, useEffect, useRef } from "react";
import { getPekkoClient } from "@/workers/PekkoClientSingelton";
import type { BoardStatusResponse } from "@/types/BoardStatusResponse";

export function usePekkoGameLoop() {
    const statusRef = useRef<BoardStatusResponse | null>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const client = getPekkoClient();
        if (!client) return;
        const unsub = client.onStatus((s) => {
            statusRef.current = s;
        });
        return () => { unsub() };
    }, []);


    const start = useCallback((draw: (s: BoardStatusResponse | null) => void) => {
        function loop() {
            draw(statusRef.current);
            frameRef.current = requestAnimationFrame(loop);
        }
        frameRef.current = requestAnimationFrame(loop);
    }, []);

    const stop = useCallback(() => {
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
        }
    }, []);

    return { statusRef, start, stop };
}
