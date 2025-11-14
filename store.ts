import { create } from 'zustand'

const useUI = create((set) => ({
  pages: {
    play: {
      currentTab: 'board',
    }
  },
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
