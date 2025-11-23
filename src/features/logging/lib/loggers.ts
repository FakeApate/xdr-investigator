"use client";

import { browserLogger } from "./browserLogger";

export const wsLogger = browserLogger.child({ scope: "ws" });
// add more:
// export const pekkoLogger = browserLogger.child({ scope: "pekko" });
// export const uiLogger = browserLogger.child({ scope: "ui" });
