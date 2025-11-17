import { useEffect, useState } from "react";
import { getPekkoClient } from "./PekkoClientSingelton";
import { BoardStatusResponse } from "@/types/BoardStatusResponse";

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