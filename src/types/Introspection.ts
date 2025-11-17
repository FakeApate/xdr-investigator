import { BoardCommand } from "./BoardCommand";

export type IntrospectionCommand = {
  type: string;
  _types?: Record<string, string>;
};

export type IntrospectionResponse = BoardCommand[];
