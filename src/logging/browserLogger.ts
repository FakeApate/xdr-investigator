"use client";

import pino from "pino";
import { useLogStore } from "@/stores/LogStore";

export const browserLogger = pino({
    level: "info",
    browser: {
        asObject: true,
        write: (logObj) => {
            if ("scope" in logObj && "msg" in logObj) {
                const scope = logObj.scope ? `[${logObj.scope}] ` : "";
                console.log(scope + logObj.msg, logObj);
                useLogStore.getState().addFromPino(logObj);
            }
        },
    },
    base: null,
});
