import { useRef, useEffect } from "react";
import PekkoClient from "./PekkoClient";
import { BoardCommand } from "@/types/BoardCommand";
import { getPekkoClient } from "./PekkoClientSingelton";

export function usePekkoClient() {
    const workerRef = useRef<PekkoClient | null>(null);

    useEffect(() => {
        const worker = getPekkoClient();
        workerRef.current = worker;
        return () => worker?.close();
    }, []);

    return {
        send: (payload: BoardCommand) => workerRef.current?.sendCommand(payload),
    };
}