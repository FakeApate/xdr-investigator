"use client";

import pino from "pino";
import { useLogStore } from "@/stores/LogStore";

export const browserLogger = pino({
    level: "debug",
    browser: {
        asObject: true,
        write: (logObj) => {
            // 1) still log to the browser console
            const scope = logObj.scope ? `[${logObj.scope}] ` : "";
            // logObj.msg is the formatted message
            // you can inspect logObj.level or others if you want
            console.log(scope + logObj.msg, logObj);

            // 2) push into Zustand for UI
            useLogStore.getState().addFromPino(logObj);
        },
    },
    base: null, // don't include pid/hostname in browser logs
});
