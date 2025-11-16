export type BoardCommand =
  | { type: "GetBots" }
  | { type: "GetMatrix" }
  | { type: "GetTargetPosition" }
  | { type: "PauseRace" }
  | { type: "ResumeRace" }
  | { type: "StartRace" }
  | { type: "StartRegister" }
  | { type: "TerminateRace" }
  | { type: "DeregisterBot"; botName: string }
  | { type: "Ping"; botName: string };