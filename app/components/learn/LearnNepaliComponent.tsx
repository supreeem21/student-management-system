"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { generateRandomSentence } from "@/app/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import PreetiKeyboard from "@/app/components/keyboard/preeti/PreetiKeyboard";
import UnicodeKeyboard from "@/app/components/keyboard/unicode/UnicodeKeyboard";
import Modal from "@/app/components/Modal";
import { useNepaliTyping } from "@/app/hooks/useNepaliTyping";

// ============================================================
// SENTENCES
// ============================================================

const nepaliSentences = {
  easy: [
    "मेरो नाम राम हो।",
    "आज मौसम राम्रो छ।",
    "म विद्यालय जान्छु।",
    "मलाई किताब पढ्न मन पर्छ।",
    "हामी सँगै खेल्छौं।",
  ],

  medium: [
    "हरेक दिन अभ्यास गर्दा टाइपिङ गति बढ्छ।",
    "समयको सही उपयोग गर्नु आवश्यक हुन्छ।",
    "सफलता निरन्तर मेहनतको परिणाम हो।",
  ],

  hard: [
    "आधुनिक प्रविधिले मानिसहरूको जीवनशैली र काम गर्ने तरिकामा ठूलो परिवर्तन ल्याएको छ।",
    "निरन्तर अभ्यास, धैर्य र आत्मविश्वासले कुनै पनि कठिन लक्ष्य हासिल गर्न सकिन्छ।",
  ],
};

// ============================================================
// COMPONENT
// ============================================================

export default function LearnComponent() {
  // ----------------------------------------------------------
  // SENTENCE / RESULT STATE
  // ----------------------------------------------------------

  const [placeholderText, setPlaceholderText] = useState("");
  const [result, setResult] = useState("");

  // ----------------------------------------------------------
  // STORE
  // ----------------------------------------------------------

  const difficulty = useAppStore((state) => state.difficulty);

  const nepaliLanguageType = useAppStore((state) => state.nepaliLanguageType);

  // ----------------------------------------------------------
  // SENTENCE SEGMENTER
  //
  // Used ONLY for visual grapheme highlighting.
  //
  // The typing engine itself works with Preeti keyboard
  // tokens and physical key combinations.
  // ----------------------------------------------------------

  const segmenter = useMemo(
    () =>
      new Intl.Segmenter("ne", {
        granularity: "grapheme",
      }),
    [],
  );

  // ----------------------------------------------------------
  // TARGET GRAPHEMES
  // ----------------------------------------------------------

  const targetLetters = useMemo(
    () =>
      [...segmenter.segment(placeholderText)].map((segment) => segment.segment),
    [placeholderText, segmenter],
  );

  // ----------------------------------------------------------
  // NEPALI TYPING ENGINE
  //
  // The engine is the source of truth for:
  //
  // - typed Unicode
  // - completion
  // - active physical key
  // - incorrect physical key
  // - next physical key
  // - Shift requirement
  // ----------------------------------------------------------

  const {
    typedUnicode,
    isComplete,
    activeKey,
    errorKey,
    nextPhysicalKey,
    nextShift,
  } = useNepaliTyping(placeholderText, { strict: true });

  // ----------------------------------------------------------
  // TYPED GRAPHEMES
  //
  // Used only for visual comparison with targetLetters.
  // ----------------------------------------------------------

  const typedLetters = useMemo(
    () =>
      [...segmenter.segment(typedUnicode)].map((segment) => segment.segment),
    [typedUnicode, segmenter],
  );

  const nextCharacter = targetLetters[typedLetters.length] ?? "";

  // ----------------------------------------------------------
  // RESET / NEW SENTENCE
  //
  // IMPORTANT:
  //
  // We do NOT call a reset function from the typing engine here.
  //
  // Changing placeholderText causes useNepaliTyping() to
  // reset itself because targetSentence changed.
  // ----------------------------------------------------------

  const resetState = useCallback(() => {
    const nextSentence = generateRandomSentence(nepaliSentences, difficulty);

    setPlaceholderText(nextSentence);
    setResult("");
  }, [difficulty]);

  // ----------------------------------------------------------
  // INITIAL SENTENCE / DIFFICULTY CHANGE
  // ----------------------------------------------------------

  useEffect(() => {
    resetState();
  }, [resetState]);

  // ----------------------------------------------------------
  // COMPLETION
  // ----------------------------------------------------------

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    setResult("🎉 तपाईंले कार्य पूरा गर्नुभयो।");
  }, [isComplete]);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <article className="relative flex flex-col gap-8 px-5 py-3 text-center">
      {/* ======================================================
          TARGET SENTENCE
          ====================================================== */}

      <LearningTargetSentence
        targetLetters={targetLetters}
        typedLetters={typedLetters}
      />

      {/* ======================================================
          TYPED TEXT
          ====================================================== */}

      <div
        aria-live="polite"
        aria-label="Typed text"
        className="
    min-h-20
    w-full
    overflow-hidden
    rounded-md
    border
    border-[var(--border-strong)]
    p-3
    text-3xl
    text-[var(--text-muted)]
    leading-relaxed
    outline-none
  "
      >
        {typedUnicode ? (
          typedUnicode
        ) : (
          <span className="text-[var(--text-muted)] text-lg sm:text-2xl">
            यहाँ टाइप गर्नुहोस्
          </span>
        )}
      </div>

      {/* ======================================================
    NEXT CHARACTER
    ====================================================== */}

      {!isComplete && nextCharacter && (
        <div className="flex items-center gap-10 mx-auto">

          <div
            className="
        flex
        items-center
        justify-center
        rounded
        border
        border-[var(--border-strong)]
        bg-[var(--background-secondary)]
        text-lg
        font-semibold
        text-[var(--text-primary)]
        py-1 px-2
        shadow-sm
      "

          >
            {nextCharacter}
          </div>

          {nextPhysicalKey && (
            <span className="text-lg text-[var(--text-muted)]">
              <span>Press: {" "}</span>
              <kbd className="rounded border px-2 py-1 font-mono">
                {nextShift ? `Shift + ${nextPhysicalKey}` : nextPhysicalKey}
              </kbd>
            </span>
          )}
        </div>
      )}

      {/* ======================================================
          KEYBOARD
          ====================================================== */}

      {/* Keyboard */}

      <section className="w-full overflow-x-auto">
        {nepaliLanguageType === "preeti" ? (
          <PreetiKeyboard
            activeKey={activeKey}
            nextPhysicalKey={nextPhysicalKey}
            nextShift={nextShift}
            errorKey={errorKey}
          />
        ) : (
          <UnicodeKeyboard
            activeKey={activeKey}
            nextPhysicalKey={nextPhysicalKey}
            nextShift={nextShift}
            errorKey={errorKey}
          />
        )}
      </section>

      {/* ======================================================
          RESULT MODAL
          ====================================================== */}

      {isComplete && <Modal handleRestart={resetState} result={result} />}
    </article>
  );
}

// ============================================================
// TARGET SENTENCE
// ============================================================

interface LearningTargetSentenceProps {
  targetLetters: string[];
  typedLetters: string[];
}

export const LearningTargetSentence = ({
  targetLetters,
  typedLetters,
}: LearningTargetSentenceProps) => {
  return (
    <div
      className="
        relative
        w-full
        wrap-break-word
        text-3xl
        leading-relaxed
        tracking-wide
      "
      aria-label="Target sentence"
    >
      {targetLetters.map((letter, index) => {
        const typedLetter = typedLetters[index];

        const isCorrect = typedLetter === letter;

        return (
          <span
            key={`${letter}-${index}`}
            className={
              isCorrect ? "text-[var(--success)]" : "text-[var(--text-muted)]"
            }
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        );
      })}
    </div>
  );
};
