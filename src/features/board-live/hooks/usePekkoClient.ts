import { useEffect, useState } from "react";
import { getPekkoClient } from "../data/PekkoClientSingelton";
import { BoardStatusResponse } from "@/features/board-live/types/BoardStatusResponse";

export function usePekkoClient() {
    const [status, setStatus] = useState<BoardStatusResponse | null>(null);

    useEffect(() => {
        const client = getPekkoClient();
        if (!client) return;

        const unsub = client.onStatus(setStatus);
        return () => { unsub() };
    }, []);

    return { status };
}
