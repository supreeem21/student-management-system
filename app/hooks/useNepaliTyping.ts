"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAppStore } from "@/store/useAppStore";
import { convertCodeToLabel } from "@/app/hooks/useKeyboard";

import * as preetiEngine from "@/app/lib/preeti/preetiTypingEngine";
import * as unicodeEngine from "@/app/lib/unicode/unicodeTypingEngine";

import { lookupByPhysicalKey as lookupPreetiChar } from "@/app/lib/preeti/preetiKeymap";
import { lookupByPhysicalKey as lookupUnicodeChar } from "@/app/lib/unicode/unicodeKeymap";

const KEY_LOOKUPS = {
  preeti: lookupPreetiChar,
  unicode: lookupUnicodeChar,
} as const;

import type {
  TypingSequence,
  TypingStroke,
} from "@/app/lib/preeti/preetiTypingEngine";

const ENGINES = {
  preeti: preetiEngine,
  unicode: unicodeEngine,
} as const;

export interface UseNepaliTypingResult {
  typedUnicode: string;
  typedCorrectness: boolean[];
  typedCount: number;
  totalKeys: number;
  isComplete: boolean;
  mistakes: number;
  startTime: number | null;
  endTime: number | null;
  activeKey: string;
  errorKey: string;
  nextPhysicalKey: string;
  nextShift: boolean;
  reset: () => void;
}

export function useNepaliTyping(
  targetSentence: string,
  options?: { strict?: boolean },
): UseNepaliTypingResult {
  const strict = options?.strict ?? false;

  const nepaliLanguageType = useAppStore((state) => state.nepaliLanguageType);

  const engine = ENGINES[nepaliLanguageType] ?? ENGINES.unicode;

  const targetSequence: TypingSequence = useMemo(
    () => engine.encodeSentenceToTypingSequence(targetSentence),
    [engine, targetSentence],
  );

  const targetStrokes: TypingStroke[] = useMemo(
    () => engine.flattenTypingStrokes(targetSequence),
    [engine, targetSequence],
  );

  const [typedCount, setTypedCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [activeKey, setActiveKey] = useState("");
  const [errorKey, setErrorKey] = useState("");

  const [mistakeStrokeChars, setMistakeStrokeChars] = useState<
    Map<number, string>
  >(new Map());

  const typedCountRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());

  typedCountRef.current = typedCount;
  startTimeRef.current = startTime;

  const isComplete =
    targetStrokes.length > 0 && typedCount >= targetStrokes.length;

  const reset = useCallback(() => {
    setTypedCount(0);
    setMistakes(0);
    setStartTime(null);
    setEndTime(null);
    setActiveKey("");
    setErrorKey("");
    setMistakeStrokeChars(new Map());

    typedCountRef.current = 0;
    startTimeRef.current = null;

    pressedKeysRef.current.clear();

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    reset();
  }, [targetSentence, nepaliLanguageType, reset]);

  useEffect(() => {
    if (isComplete && endTime === null) {
      setEndTime(Date.now());
    }
  }, [isComplete, endTime]);

  const flashError = useCallback((physicalKey: string) => {
    setErrorKey(physicalKey);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setErrorKey("");
      errorTimeoutRef.current = null;
    }, 200);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        setActiveKey("Shift");
        return;
      }

      if (e.code === "AltLeft" || e.code === "AltRight") {
        setActiveKey("Alt");
        return;
      }

      const physicalKey = convertCodeToLabel(e.code);

      if (e.code === "Backspace") {
        e.preventDefault();

        if (pressedKeysRef.current.has(e.code)) return;

        pressedKeysRef.current.add(e.code);
        setErrorKey("");

        return;
      }

      const isTypingKey = physicalKey.length === 1 || physicalKey === "Space";

      if (!isTypingKey) return;

      e.preventDefault();

      if (pressedKeysRef.current.has(e.code)) return;

      pressedKeysRef.current.add(e.code);

      setActiveKey(physicalKey);

      if (targetStrokes.length === 0) return;

      if (typedCountRef.current >= targetStrokes.length) return;

      const expected = targetStrokes[typedCountRef.current];

      if (!expected) return;

      if (startTimeRef.current === null) {
        const now = Date.now();

        startTimeRef.current = now;
        setStartTime(now);
      }

      const physicalKeyMatches =
        physicalKey.toUpperCase() === expected.physicalKey.toUpperCase();

      const shiftMatches = e.shiftKey === Boolean(expected.shift);

      const altMatches = e.altKey === Boolean(expected.alt);

      const matches = physicalKeyMatches && shiftMatches && altMatches;

      if (matches) {
        setTypedCount((current) => {
          const next = current + 1;

          typedCountRef.current = next;

          return next;
        });

        setErrorKey("");

        return;
      }

      // INCORRECT
      setMistakes((current) => current + 1);

      // Non-strict mode:
      // record the incorrect stroke and advance.
      //
      // Strict mode:
      // keep the cursor on the same stroke.
      if (!strict) {
        const wrongIndex = typedCountRef.current;
        const mistakenChar =
          KEY_LOOKUPS[nepaliLanguageType]?.(physicalKey, e.shiftKey) ??
          physicalKey;

        setMistakeStrokeChars((current) => {
          const next = new Map(current);
          next.set(wrongIndex, mistakenChar);
          return next;
        });

        setTypedCount((current) => {
          const next = current + 1;
          typedCountRef.current = next;
          return next;
        });
      }

      flashError(physicalKey);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const physicalKey = convertCodeToLabel(e.code);

      pressedKeysRef.current.delete(e.code);

      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        setActiveKey("");
        return;
      }

      if (e.code === "AltLeft" || e.code === "AltRight") {
        setActiveKey("");
        return;
      }

      setActiveKey((current) =>
        current.toUpperCase() === physicalKey.toUpperCase() ? "" : current,
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      pressedKeysRef.current.clear();
    };
  }, [targetStrokes, flashError, strict, nepaliLanguageType]);

  const { typedUnicode, typedCorrectness } = useMemo(() => {
    if (typedCount <= 0) {
      return {
        typedUnicode: "",
        typedCorrectness: [] as boolean[],
      };
    }

    let consumedStrokes = 0;
    let result = "";

    const correctness: boolean[] = [];

    for (const grapheme of targetSequence) {
      const strokeCount = grapheme.strokes.length;

      if (strokeCount === 0) break;

      if (consumedStrokes + strokeCount <= typedCount) {
        let mistypedChar: string | undefined;
        for (let i = consumedStrokes; i < consumedStrokes + strokeCount; i++) {
          if (mistakeStrokeChars.has(i)) {
            mistypedChar = mistakeStrokeChars.get(i);
            break;
          }
        }
        result += mistypedChar ?? grapheme.unicode;
        correctness.push(mistypedChar === undefined);
        consumedStrokes += strokeCount;
        continue;
      }

      break;
    }

    return {
      typedUnicode: result,
      typedCorrectness: correctness,
    };
  }, [targetSequence, typedCount, mistakeStrokeChars]);

  const expected = targetStrokes[typedCount];

  return {
    typedUnicode,
    typedCorrectness,
    typedCount,
    totalKeys: targetStrokes.length,
    isComplete,
    mistakes,
    startTime,
    endTime,
    activeKey,
    errorKey,
    nextPhysicalKey: expected?.physicalKey ?? "",
    nextShift: expected?.shift ?? false,
    reset,
  };
}
