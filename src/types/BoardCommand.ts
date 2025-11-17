export type BoardCommand =
  | { type: "PauseRace" }
  | { type: "ResumeRace" }
  | { type: "StartRace" }
  | { type: "StartRegister" }
  | { type: "TerminateRace" }
  | { type: "DeregisterBot"; botName: string }