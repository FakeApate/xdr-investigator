import { BoardLevelsInfoResponse } from "@/features/commands/types/BoardLevelsInfoResponse";
import { BoardLevel } from "./Level";

export type BoardLevelStore = {
    levels: BoardLevel[];
    loading: boolean;
    error?: string;
    lastInfo?: BoardLevelsInfoResponse;
    load: () => Promise<void>;
    startAutoRefresh: () => void;
    stopAutoRefresh: () => void;
    checkForUpdates: () => Promise<void>;
}