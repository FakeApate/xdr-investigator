import { BoardCommand } from "@/features/commands/types/BoardCommand";

export async function sendCommand(url: string, command: BoardCommand): Promise<unknown> {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
    });
    if (!res.ok) {
        throw new Error(`Failed to post message: ${res.status}`);
    }
    return res.json();
}