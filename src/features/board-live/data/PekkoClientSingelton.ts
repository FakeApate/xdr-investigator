"use client";
import PekkoClient from "./PekkoClient";

let instance: PekkoClient | null = null;

export function getPekkoClient(): PekkoClient | null {
    if (typeof window === "undefined") return null;
    if (!instance) {
        instance = new PekkoClient();
    }
    return instance;
}