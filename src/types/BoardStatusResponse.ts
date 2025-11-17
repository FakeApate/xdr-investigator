import { PhaseModel } from "./BoardPhaseModel";
import { BotModel } from "./BotModel";


export type BoardStatusResponse = {
    tick: number;
    phase: PhaseModel;
    bots: BotModel[],
    matrix: boolean[][],
    sleepTime: number,
    startPosition: { x: number; y: number },
    targetPosition: { x: number; y: number }
};