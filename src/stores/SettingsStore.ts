import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import SettingsStore from '@/types/SettingsStore';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      pekkoWss: false,
      pekkoAutoReconnect: false,
      pekkoIp: '127.0.0.1',
      pekkoPort: '8080',
      setWssState: (value: boolean) => set({ pekkoWss: value }),
      setAutoReconnect: (value: boolean) => set({ pekkoAutoReconnect: value }),
      setServerIp: (value: string) => set({ pekkoIp: value }),
      setServerPort: (value: string) => set({ pekkoPort: value }),
    }),
    {
      name: 'botrace-settings', // key in storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
