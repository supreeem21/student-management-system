import { StateCreator } from "zustand";

export type Theme = "light" | "dark" ;

export interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set, get) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),
});