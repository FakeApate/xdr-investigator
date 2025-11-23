import { BoardStatusResponse } from "./BoardStatusResponse";

export type BoardStatusListener = (status: BoardStatusResponse) => void;