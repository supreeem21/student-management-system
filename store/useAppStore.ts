import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

import { ThemeSlice, createThemeSlice } from "./slices/themeSlice";
import { LanguageSlice, createLanguageSlice } from "./slices/languageSlice";
import {
  DifficultySlice,
  createDifficultySlice,
} from "./slices/difficultySlice";

import {
  NepaliLanguageSlice,
  createNepaliLanguageSlice,
} from "./slices/nepaliLanguageSlice";

type HydrationState = {
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export type AppStore = ThemeSlice &
  LanguageSlice &
  DifficultySlice &
  NepaliLanguageSlice &
  HydrationState;


export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
      ...createLanguageSlice(...a),
      ...createDifficultySlice(...a),
      ...createNepaliLanguageSlice(...a),
      hasHydrated: false,
      setHasHydrated: (state) => a[0]({ hasHydrated: state }),
    }),
    {
      name: "app-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);