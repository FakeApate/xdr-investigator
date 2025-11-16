import type { IntrospectionResponse } from "@/types/Introspection";
import SettingsStore from "@/types/SettingsStore";

export async function fetchIntrospection(settings: SettingsStore): Promise<IntrospectionResponse> {
    const url = `${settings.pekkoWss ? "https" : "http"}://${settings.pekkoIp}:${settings.pekkoPort}/api/introspection`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch introspection: ${res.status}`);
    }
    return res.json();
}