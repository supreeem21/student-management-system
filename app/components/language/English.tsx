"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import ShowResult from "../ShowResult";
import TargetSentence from "../TargetSentence";
import { generateRandomSentence } from "@/app/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import useKeyboard from "@/app/hooks/useKeyboard";
import Keyboard from "../keyboard/preeti/PreetiKeyboard";

// ... keep your englishSentences object exactly the same
const englishSentences = {
  easy: [
    "I like to read books.",
    "The cat is on the table.",
    "Today is a beautiful day.",
    "My name is John.",
    "She drinks a cup of tea.",
    "We are going to school.",
    "The sun shines brightly.",
    "Please close the window.",
    "He plays football every weekend.",
    "The dog is sleeping.",
    "I enjoy listening to music.",
    "Open the door slowly.",
    "This is my favorite pen.",
    "They live in a small house.",
    "Water is good for health.",
    "The birds are singing.",
    "I have a new notebook.",
    "She likes fresh flowers.",
    "The baby is smiling.",
    "Practice typing every day.",
  ],
  medium: [
    "Practice every day to improve your typing speed.",
    "Learning new skills requires patience and consistency.",
    "The quick brown fox jumps over the lazy dog.",
    "Small daily improvements lead to great success over time.",
    "Technology has transformed the way people communicate.",
    "Always believe in yourself and keep moving forward.",
    "Reading books regularly expands your knowledge and vocabulary.",
    "Good communication builds trust in every relationship.",
    "Hard work usually produces better results than shortcuts.",
    "Teamwork allows people to solve difficult problems together.",
    "A healthy lifestyle includes proper sleep and exercise.",
    "Success often comes after many failed attempts.",
    "Time management helps you achieve more every day.",
    "Curiosity encourages people to discover new ideas.",
    "Every challenge is an opportunity to become stronger.",
    "Writing clean code makes software easier to maintain.",
    "The internet has changed education around the world.",
    "Confidence grows when you practice consistently.",
    "Never stop learning because knowledge has no limit.",
    "Creativity helps people solve problems in unique ways.",
  ],
  hard: [
    "Artificial intelligence is transforming industries by automating complex decision-making processes.",
    "Consistency and perseverance are often more valuable than natural talent alone.",
    "Software engineering requires analytical thinking, creativity, and continuous learning.",
    "The rapid advancement of technology creates exciting opportunities and significant challenges.",
    "Successful developers write maintainable code that remains understandable for future teams.",
    "Critical thinking enables individuals to evaluate information objectively before making decisions.",
    "Cybersecurity plays a vital role in protecting sensitive information from malicious attacks.",
    "The ability to adapt quickly is becoming one of the most valuable professional skills.",
    "Modern web applications rely heavily on scalable architectures and efficient data management.",
    "Productivity increases when distractions are minimized and priorities are clearly defined.",
    "Open-source communities encourage collaboration and innovation across the global developer ecosystem.",
    "Exceptional user experiences are created through thoughtful design and careful implementation.",
    "Continuous integration and automated testing significantly improve software reliability.",
    "Effective communication is just as important as technical expertise in professional environments.",
    "Developers should prioritize accessibility to ensure applications are usable by everyone.",
    "Machine learning algorithms identify meaningful patterns within massive collections of data.",
    "Building high-quality software requires attention to detail and disciplined engineering practices.",
    "Performance optimization enhances application responsiveness and improves overall user satisfaction.",
    "Understanding system architecture helps developers design scalable and maintainable applications.",
    "Long-term success is achieved through discipline, curiosity, and a commitment to lifelong learning.",
  ],
};

// English component
export default function EnglishComponent() {
  const [placeholderText, setPlaceholderText] = useState("");
  const [inputText, setInputText] = useState("");

  const [result, setResult] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const difficulty = useAppStore((state) => state.difficulty);

  const language: string = "en";

  const segmenter = useMemo(
    () => new Intl.Segmenter(language, { granularity: "grapheme" }),
    [],
  );

  const targetLetters = [...segmenter.segment(placeholderText)].map(
    (s) => s.segment,
  );

  const typedLetters = [...segmenter.segment(inputText)].map((s) => s.segment);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isCompleted) return;

    const value = e.target.value;

    const graphemes = [...segmenter.segment(value)];

    if (startTime === null && graphemes.length > 0) {
      setStartTime(Date.now());
    }

    if (graphemes.length > targetLetters.length) {
      return;
    }

    setInputText(value);
  };

  useEffect(() => {
    if (
      typedLetters.length === targetLetters.length &&
      targetLetters.length > 0 &&
      !isCompleted
    ) {
      const finishedAt = Date.now();

      setEndTime(finishedAt);
      setResult("🎉 Great job! You've completed the task.");
      setIsCompleted(true);
      setShowResult(true);
    }
  }, [typedLetters, targetLetters, isCompleted]);

  useEffect(() => {
    setPlaceholderText(generateRandomSentence(englishSentences, difficulty));

    setInputText("");
    setResult("");
    setStartTime(null);
    setEndTime(null);
    setIsCompleted(false);
  }, [difficulty]);

  const handleNextChallenge = () => {
    setPlaceholderText(generateRandomSentence(englishSentences, difficulty));

    setInputText("");
    setResult("");
    setIsCompleted(false);

    setStartTime(null);
    setEndTime(null);

    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  };

  const handleClose = () => {
    setShowResult(false);
  };

  const handleRestart = () => {
    setInputText("");
    setResult("");
    setIsCompleted(false);

    setStartTime(null);
    setEndTime(null);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const elapsedTime =
    startTime && endTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  const correctChars = typedLetters.reduce((count, letter, index) => {
    return count + (letter === targetLetters[index] ? 1 : 0);
  }, 0);

  const accuracy =
    typedLetters.length > 0
      ? Math.round((correctChars / typedLetters.length) * 100)
      : 100;

  const wpm =
    startTime && endTime
      ? Math.round(correctChars / 5 / ((endTime - startTime) / 60000))
      : 0;

  const activeKey = useKeyboard();
  const nextKey = targetLetters[typedLetters.length] ?? "";

  return (
    <article
      className="
      flex 
      flex-col 
      gap-6 
      sm:gap-8 
      text-center 
      px-3 
      sm:px-5 
      py-3
      w-full
      overflow-hidden
    "
    >
      {/* Target sentence */}
      <div
        className="
        w-full
        text-base
        sm:text-lg
        md:text-xl
        lg:text-2xl
        wrap-break-word
      "
      >
        <TargetSentence
          targetLetters={targetLetters}
          typedLetters={typedLetters}
        />
      </div>

      {/* Typing textarea */}
      <textarea
        ref={textareaRef}
        value={inputText}
        onChange={handleTyping}
        spellCheck={false}
        autoFocus
        key={difficulty}
        placeholder="Type here..."
        rows={2}
        className="
          w-full
          border-2
          border-slate-600
          rounded
          text-xl
          sm:text-2xl
          md:text-3xl
          px-3
          sm:px-5
          py-2
          sm:py-3
          leading-relaxed
          tracking-wide
          outline-none
          h-fit
          text-center
          resize-none
        "
      />

      <section className="w-full overflow-x-auto">
        <Keyboard activeKey={activeKey} nextPhysicalKey={nextKey} />
      </section>

      {showResult && (
        <ShowResult
          elapsedTime={elapsedTime}
          isCompleted={isCompleted}
          wpm={wpm}
          typedLetters={typedLetters}
          accuracy={accuracy}
          result={result}
          handleNextChallenge={handleNextChallenge}
          language={language}
          handleClose={handleClose}
          handleRestart={handleRestart}
        />
      )}
    </article>
  );
}
