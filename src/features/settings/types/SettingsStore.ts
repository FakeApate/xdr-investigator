export default interface SettingsStore {
    pekkoWss: boolean;
    pekkoAutoReconnect: boolean;
    pekkoIp: string;
    pekkoPort: string;
    setWssState: (value: boolean) => void;
    setAutoReconnect: (value: boolean) => void;
    setServerIp: (value: string) => void;
    setServerPort: (value: string) => void;
}