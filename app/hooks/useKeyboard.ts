"use client";

import { useEffect, useState } from "react";

// ============================================================
// CONVERT KeyboardEvent.code -> PHYSICAL KEY LABEL
// ============================================================

/**
 * Converts KeyboardEvent.code into the physical key label
 * used by KeyboardLayout.tsx and the typing engine.
 *
 * IMPORTANT:
 *
 * This function returns the PHYSICAL KEY.
 *
 * It does NOT return the character produced by the key.
 *
 * Examples:
 *
 *   KeyA
 *      -> "a"
 *
 *   KeyA + Shift
 *      -> "a"
 *
 *   Digit1
 *      -> "1"
 *
 *   Digit1 + Shift
 *      -> "1"
 *
 * Shift is handled separately using:
 *
 *   event.shiftKey
 *
 * Therefore:
 *
 *   physicalKey = "a"
 *   shift       = true
 *
 * represents:
 *
 *   Shift + A
 */
export function convertCodeToLabel(
  code: string,
): string {
  // ==========================================================
  // LETTERS
  // ==========================================================

  if (code.startsWith("Key")) {
    return code.slice(3).toLowerCase();
  }

  // ==========================================================
  // NUMBER ROW
  // ==========================================================

  if (code.startsWith("Digit")) {
    return code.slice(5);
  }

  // ==========================================================
  // SYMBOL / PUNCTUATION KEYS
  // ==========================================================

  switch (code) {
    case "Backquote":
      return "`";

    case "Minus":
      return "-";

    case "Equal":
      return "=";

    case "BracketLeft":
      return "[";

    case "BracketRight":
      return "]";

    case "Backslash":
      return "\\";

    case "Semicolon":
      return ";";

    case "Quote":
      return "'";

    case "Comma":
      return ",";

    case "Period":
      return ".";

    case "Slash":
      return "/";

    // ========================================================
    // SPACE
    // ========================================================

    case "Space":
      return "Space";

    // ========================================================
    // CONTROL KEYS
    // ========================================================

    case "Tab":
      return "Tab";

    case "Enter":
      return "Enter";

    case "Backspace":
      return "Backspace";

    case "CapsLock":
      return "Caps";

    // ========================================================
    // SHIFT
    // ========================================================

    case "ShiftLeft":
    case "ShiftRight":
      return "Shift";

    // ========================================================
    // CTRL
    // ========================================================

    case "ControlLeft":
    case "ControlRight":
      return "Ctrl";

    // ========================================================
    // ALT
    // ========================================================

    case "AltLeft":
      return "Alt";

    case "AltRight":
      return "AltGr";

    // ========================================================
    // WINDOWS / META
    // ========================================================

    case "MetaLeft":
    case "MetaRight":
      return "Win";

    // ========================================================
    // ESCAPE
    // ========================================================

    case "Escape":
      return "Esc";

    // ========================================================
    // FUNCTION KEYS
    // ========================================================

    case "F1":
    case "F2":
    case "F3":
    case "F4":
    case "F5":
    case "F6":
    case "F7":
    case "F8":
    case "F9":
    case "F10":
    case "F11":
    case "F12":
      return code;

    // ========================================================
    // DEFAULT
    // ========================================================

    default:
      return code;
  }
}

// ============================================================
// VISUAL KEYBOARD HOOK
// ============================================================

/**
 * Standalone keyboard activity hook.
 *
 * This hook is ONLY responsible for determining which
 * physical key is currently being pressed.
 *
 * It does NOT:
 *
 *   - convert English -> Nepali
 *   - convert Nepali -> English
 *   - determine Preeti mappings
 *   - validate typing
 *   - calculate mistakes
 *   - track typing progress
 *
 * Those responsibilities belong to the typing engine/hook.
 *
 * Example:
 *
 *   Physical key:
 *
 *       KeyA
 *
 *   returns:
 *
 *       "a"
 *
 * If Shift is pressed:
 *
 *       Shift + KeyA
 *
 * still returns:
 *
 *       "a"
 *
 * because Shift is represented separately.
 */
export default function useKeyboard(): string {
  const [activeKey, setActiveKey] =
    useState("");

  useEffect(() => {
    // ========================================================
    // KEY DOWN
    // ========================================================

    const handleKeyDown = (
      e: KeyboardEvent,
    ) => {
      /**
       * Convert the physical browser key code into
       * the physical key used by KeyboardLayout.tsx.
       */
      const key =
        convertCodeToLabel(e.code);

      setActiveKey(key);
    };

    // ========================================================
    // KEY UP
    // ========================================================

    const handleKeyUp = (
      e: KeyboardEvent,
    ) => {
      const key =
        convertCodeToLabel(e.code);

      /**
       * Only clear the currently active key if the key
       * being released is actually the active key.
       *
       * This prevents:
       *
       *   A keydown
       *   B keydown
       *   A keyup
       *
       * from incorrectly clearing B.
       */
      setActiveKey(
        (current) => {
          if (
            current.toUpperCase() ===
            key.toUpperCase()
          ) {
            return "";
          }

          return current;
        },
      );
    };

    // ========================================================
    // EVENT LISTENERS
    // ========================================================

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    window.addEventListener(
      "keyup",
      handleKeyUp,
    );

    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp,
      );
    };
  }, []);

  return activeKey;
}