import { StateCreator } from "zustand";

export type NepaliLanguageType = "unicode" | "preeti" ;

export interface NepaliLanguageSlice {
  nepaliLanguageType: NepaliLanguageType;
  setNepaliLanguageType: (nepaliLanguage: NepaliLanguageType) => void;
}

export const createNepaliLanguageSlice: StateCreator<NepaliLanguageSlice> = (
  set,
) => ({
  nepaliLanguageType: "unicode",
  setNepaliLanguageType: (nepaliLanguageType) => set({ nepaliLanguageType }),
});
