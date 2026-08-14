import { StateCreator } from "zustand";

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultySlice {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const createDifficultySlice: StateCreator<DifficultySlice> = (set) => ({
  difficulty: "medium",
  setDifficulty: (difficulty) => set({ difficulty }),
});