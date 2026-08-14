import { StateCreator } from "zustand";

export type Language = "english" | "nepali" | "code";

export interface LanguageSlice {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const createLanguageSlice: StateCreator<LanguageSlice> = (set) => ({
  language: "english",
  setLanguage: (language) => set({ language }),
});