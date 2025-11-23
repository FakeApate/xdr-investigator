import { PhaseModel } from "./BoardPhaseModel";
import { BoardPosition } from "./BoardPosition";
import { BotModel } from "./BotModel";


export type BoardStatusResponse = {
    tick: number;
    phase: PhaseModel;
    bots: BotModel[],
    matrix: boolean[][],
    sleepTime: number,
    startPosition: BoardPosition,
    targetPosition: BoardPosition
};