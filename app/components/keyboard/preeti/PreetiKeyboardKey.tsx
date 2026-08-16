"use client";

import type { ReactNode } from "react";

import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Volume1,
  Play,
  SkipBack,
  SkipForward,
  Search,
  Monitor,
  Wifi,
  Power,
} from "lucide-react";

import {
  preetiGraphemeStrokes,
  type KeyDef,
} from "./PreetiKeyboardLayout";

// ============================================================
// MULTI-STROKE LOOKUP
// ============================================================

const multiStrokeHints = new Map<string, string>();

for (const definition of preetiGraphemeStrokes) {
  if (definition.strokes.length > 1) {
    const sequence = definition.strokes
      .map((stroke) =>
        stroke.shift ? `Shift+${stroke.key}` : stroke.key,
      )
      .join(" → ");

    multiStrokeHints.set(definition.unicode, sequence);
  }
}

// ============================================================
// TYPES
// ============================================================

interface KeyboardKeyProps {
  keyDef: KeyDef | string;

  width?: string;
  height?: string;

  /**
   * The physical key is currently being pressed.
   */
  active?: boolean;

  /**
   * The physical key required for the next typing stroke.
   */
  next?: boolean;

  /**
   * The next required stroke requires Shift.
   */
  nextShift?: boolean;

  /**
   * The physical key produced an incorrect stroke.
   */
  error?: boolean;
}

// ============================================================
// FUNCTION KEY ICONS
// ============================================================

const functionIcons: Record<string, ReactNode> = {
  F1: <VolumeX className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F2: <Volume1 className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F3: <Volume2 className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F4: <Play className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F5: <SkipBack className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F6: <SkipForward className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F7: <Sun className="h-3.5 w-3.5 opacity-60" strokeWidth={1.75} />,
  F8: <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F9: <Search className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F10: <Monitor className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F11: <Wifi className="h-3.5 w-3.5" strokeWidth={1.75} />,
  F12: <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />,
  Esc: <Power className="h-3.5 w-3.5" strokeWidth={1.75} />,
};

// ============================================================
// SPECIAL / CONTROL KEYS
// ============================================================

const specialKeys = new Set([
  "Backspace",
  "Tab",
  "Caps",
  "Enter",
  "Shift",
  "Ctrl",
  "Win",
  "Alt",
  "Space",
  "AltGr",
  "Fn",
  "Menu",
]);

// ============================================================
// KEYBOARD KEY
// ============================================================

export default function PreetiKeyboardKey({
  keyDef,
  width = "w-14",
  height = "h-12",
  active = false,
  next = false,
  nextShift = false,
  error = false,
}: KeyboardKeyProps) {
  // ==========================================================
  // NORMALIZE KEY DEFINITION
  // ==========================================================

  const item: KeyDef =
    typeof keyDef === "string"
      ? { label: keyDef }
      : keyDef;

  const {
    label,
    shift,
    nepali,
    nepaliShift,
  } = item;

  // ==========================================================
  // KEY INFORMATION
  // ==========================================================

  const icon = functionIcons[label];

  const isSpecialControl =
    specialKeys.has(label);

  const isRequiredShiftKey =
    label === "Shift" && nextShift;

  const isNextKey =
    next || isRequiredShiftKey;

  // ==========================================================
  // KEY STATE
  //
  // Priority:
  //
  // error
  //   ↓
  // active
  //   ↓
  // next
  //   ↓
  // normal
  //
  // IMPORTANT:
  // Next and active intentionally use DIFFERENT visual
  // treatments so the learner can understand the state.
  // ==========================================================

  let stateStyle = `
    bg-[var(--surface)]
    text-[var(--text-primary)]
    border-[var(--border)]
  `;

  if (error) {
    // Wrong key: red = typing error
    stateStyle = `
      bg-[var(--error)]
      text-white
      border-[var(--error)]
      scale-95
      shadow-inner
    `;
  } else if (active) {
    // Correctly pressed key: accent green
    stateStyle = `
      bg-[var(--accent)]
      text-white
      border-[var(--accent-hover)]
      scale-95
      shadow-inner
    `;
  } else if (isNextKey) {
    // Next key: neutral surface + accent outline
    //
    // This is intentionally NOT green-filled.
    // Green is reserved for actual typing feedback.
    stateStyle = `
      bg-[var(--accent)]
      text-[var(--text-muted)]
      border-[var(--accent)]
      ring-2
      ring-[var(--accent)]
      ring-offset-1
      ring-offset-[var(--bg)]
      shadow-md
    `;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`
        relative
        flex
        flex-col
        rounded-lg
        border
        select-none
        transition-all
        duration-150

        ${width}
        ${height}
        ${stateStyle}

        ${isSpecialControl
          ? "items-center justify-center"
          : ""}
      `}
    >
      {isSpecialControl ? (
        // ======================================================
        // SPECIAL / CONTROL KEY
        // ======================================================
        <div className="flex h-full w-full items-center justify-center">
          {icon ? (
            <div className="flex items-center justify-center">
              {icon}
            </div>
          ) : (
            <span
              className="
                px-1
                text-center
                text-xs
                font-bold
                leading-tight
                text-[var(--text-primary)]
              "
            >
              {label}
            </span>
          )}
        </div>
      ) : (
        // ======================================================
        // NORMAL PREETI KEY
        // ======================================================
        <>
          {/* ====================================================
              TOP ROW
              English Shift | Nepali Shift
              ==================================================== */}

          <div
            className="
              flex
              w-full
              items-start
              justify-between
              px-1.5
              pt-1
              text-[11px]
              leading-none
            "
          >
            <span className="font-semibold text-[var(--text-muted)]">
              {shift ?? ""}
            </span>

            {icon ? (
              <span>{icon}</span>
            ) : (
              <span
                className="
                  font-semibold
                  text-[var(--text-primary)]
                "
                title={
                  nepaliShift &&
                  multiStrokeHints.has(nepaliShift)
                    ? `Type as ${multiStrokeHints.get(nepaliShift)}`
                    : undefined
                }
              >
                {nepaliShift ?? ""}

                {nepaliShift &&
                  multiStrokeHints.has(nepaliShift) && (
                    <sup
                      className="
                        ml-0.5
                        text-[var(--warning)]
                      "
                    >
                      …
                    </sup>
                  )}
              </span>
            )}
          </div>

          {/* ====================================================
              BOTTOM ROW
              English | Nepali
              ==================================================== */}

          <div
            className="
              mt-auto
              flex
              w-full
              items-end
              justify-between
              px-1.5
              pb-1
              leading-none
            "
          >
            <span
              className="
                text-sm
                font-bold
                text-[var(--text-primary)]
              "
            >
              {label}
            </span>

            {nepali && (
              <span
                title={
                  multiStrokeHints.has(nepali)
                    ? `Type as ${multiStrokeHints.get(nepali)}`
                    : undefined
                }
                className="
                  text-sm
                  font-semibold
                  text-[var(--text-primary)]
                "
              >
                {nepali}

                {multiStrokeHints.has(nepali) && (
                  <sup
                    className="
                      ml-0.5
                      text-[var(--warning)]
                    "
                  >
                    …
                  </sup>
                )}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}