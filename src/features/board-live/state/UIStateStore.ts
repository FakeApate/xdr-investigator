import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import UISateStore from '@/features/board-live/types/UIStateStore';

export const useUIStateStore = create<UISateStore>()(
    persist(
        (set) => ({
            bottomBarCollapsed: true,
            bottomBarHeight: 200,
            setBottomBarCollapsed: (value: boolean) => set({ bottomBarCollapsed: value }),
            setBottomBarHeight: (value: number) => set({ bottomBarHeight: value }),
        }),
        {
            name: 'ui-state', // key in storage
            storage: createJSONStorage(() => localStorage),
        }
    )
);
