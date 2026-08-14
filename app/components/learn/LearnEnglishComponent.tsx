"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateRandomSentence } from "@/app/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import Keyboard from "@/app/components/keyboard/preeti/PreetiKeyboard";
import useKeyboard from "@/app/hooks/useKeyboard";
import Modal from "@/app/components/Modal";

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
export default function LearnComponent() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [placeholderText, setPlaceholderText] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const [result, setResult] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

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

    const trimmedValue =
      graphemes.length > targetLetters.length
        ? graphemes
            .slice(0, targetLetters.length)
            .map((g) => g.segment)
            .join("")
        : value;

    const trimmedGraphemes = [...segmenter.segment(trimmedValue)];

    if (trimmedGraphemes.length < typedLetters.length) {
      setInputText(trimmedValue);
      return;
    }

    if (trimmedGraphemes.length > typedLetters.length) {
      const newCharIndex = trimmedGraphemes.length - 1;
      const newlyTypedChar = trimmedGraphemes[newCharIndex]?.segment;
      const expectedChar = targetLetters[newCharIndex];

      if (newlyTypedChar !== expectedChar) {
        return;
      }
    }

    setInputText(trimmedValue);
  };

  useEffect(() => {
    const isAllCorrect = typedLetters.every(
      (letter, index) => letter === targetLetters[index],
    );

    if (
      typedLetters.length === targetLetters.length &&
      targetLetters.length > 0 &&
      isAllCorrect &&
      !isCompleted
    ) {
      setResult("🎉 Great job! You've completed the task.");
      setIsCompleted(true);
    }
  }, [typedLetters, targetLetters, isCompleted]);

  useEffect(() => {
    setPlaceholderText(generateRandomSentence(englishSentences, difficulty));
    setInputText("");
    setResult("");
    setIsCompleted(false);
  }, [difficulty]);

  const handleRestart = () => {
    setPlaceholderText(generateRandomSentence(englishSentences, difficulty));

    setInputText("");
    setResult("");
    setIsCompleted(false);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    })
  };

  const activeKey = useKeyboard();
  const nextKey = targetLetters[typedLetters.length] ?? "";

  return (
    <article className="flex flex-col gap-8 text-center px-5 py-3 relative">
      {/* Target sentence */}
      <LearningTargetSentence targetLetters={targetLetters} typedLetters={typedLetters}/>
      

      {/* Typing textarea */}
      <textarea
      ref={textareaRef}
        key={inputKey}
        value={inputText}
        onChange={handleTyping}
        spellCheck={false}
        autoFocus={true}
        placeholder="Type here..."
        rows={2}
        className="w-full border-2 border-slate-600 rounded text-3xl px-5 py-3 leading-relaxed tracking-wide outline-none h-fit text-center -z-50"
      />

      <section className="w-full overflow-x-auto">
        <Keyboard activeKey={activeKey} nextPhysicalKey={nextKey} />
      </section>

      {/* Result Modal Overlay */}
      {isCompleted && (
        <Modal handleRestart={handleRestart} result={result}/>
      )}
    </article>
  );
}

interface LearningTargetSentenceProps {
  targetLetters: string[],
  typedLetters: string[],
  
}


export const LearningTargetSentence = ({targetLetters, typedLetters}: LearningTargetSentenceProps) => {
  return (
    <div className="relative text-3xl leading-relaxed tracking-wide wrap-break-word -z-50">
        {targetLetters.map((letter, index) => {
          // Color text green if typed, otherwise leave as gray
          const className =
            index < typedLetters.length ? "text-green-600" : "text-gray-400";

          return (
            <span key={index} className={className}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          );
        })}
      </div>
  )
}
