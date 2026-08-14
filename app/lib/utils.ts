import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Difficulty = "easy" | "medium" | "hard";

export function generateRandomSentence(
  sentences: Record<Difficulty, string[]>,
  difficulty: Difficulty
) {
  const levelSentences = sentences[difficulty];

  return levelSentences[
    Math.floor(Math.random() * levelSentences.length)
  ];
}