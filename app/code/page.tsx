"use client";

import { useEffect, useState } from "react";
import RandomJSCode from "@/app/components/RandomCode";
import data from "@/app/data.json";
import { useAppStore } from "@/store/useAppStore";

interface Challenge {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  code: string;
}

export default function LearnCodeComponent() {
  const difficulty = useAppStore((state) => state.difficulty);

  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const [resetKey, setResetKey] = useState(0);

  // Filter challenges based on difficulty
  const filteredData = data.filter((item) => {
    if (difficulty === "easy") {
      return item.difficulty === "Beginner";
    }

    if (difficulty === "medium") {
      return item.difficulty === "Intermediate";
    }

    return item.difficulty === "Advanced";
  });

  // Pick a random challenge
  const nextChallenge = () => {
    if (filteredData.length === 0) {
      setChallenge(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredData.length);

    setChallenge(filteredData[randomIndex] as Challenge);

    setResetKey((prev) => prev + 1);
  };

  const restartChallenge = () => {
    if (!challenge) return;
    setChallenge({ ...challenge });
    setResetKey((prev) => prev + 1);
  };

  // Load a challenge whenever the difficulty changes
  useEffect(() => {
    nextChallenge();
  }, [difficulty]);

  if (!challenge) {
    return <div>No challenge found.</div>;
  }

  return (
    <article className="w-full space-y-6 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="max-w-full wrap-break-word text-xl font-bold sm:text-2xl md:text-3xl">
          {challenge.title}
        </h2>

        <div className="space-x-3 space-y-3">
          <button
            onClick={nextChallenge}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:cursor-pointer sm:w-auto sm:text-base"
          >
            Next
          </button>

          <button
            onClick={restartChallenge}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:cursor-pointer sm:w-auto sm:text-base"
          >
            Restart
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto flex flex-col md:flex-row space-x-3 space-y-3">
        <RandomJSCode code={challenge.code} resetKey={resetKey} />
      </div>
    </article>
  );
}
