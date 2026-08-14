// ============================================================
// TYPES
// ============================================================

export type Finger =
  | "leftPinky"
  | "leftRing"
  | "leftMiddle"
  | "leftIndex"
  | "leftThumb"
  | "rightThumb"
  | "rightIndex"
  | "rightMiddle"
  | "rightRing"
  | "rightPinky";

// ============================================================
// PHYSICAL KEY -> FINGER MAP
// ============================================================

/**
 * Maps PHYSICAL keyboard keys to the finger responsible
 * for pressing them.
 *
 * IMPORTANT:
 *
 * This file knows nothing about:
 *
 * - Nepali Unicode
 * - Preeti characters
 * - Devanagari graphemes
 * - transliteration
 * - typing-engine tokens
 *
 * The typing engine determines which physical key is required.
 *
 * This file only determines which finger should be highlighted
 * for that physical key.
 *
 * Example:
 *
 *     "A" -> leftPinky
 *     "S" -> leftRing
 *     "I" -> rightMiddle
 *     "Space" -> rightThumb
 *
 * Therefore the same physical key always uses the same finger,
 * regardless of what Unicode character that key produces.
 */
export const fingerMap: Record<string, Finger> = {
  // ==========================================================
  // NUMBER ROW
  // ==========================================================

  "`": "leftPinky",

  "1": "leftPinky",
  "2": "leftRing",
  "3": "leftMiddle",
  "4": "leftIndex",
  "5": "leftIndex",

  "6": "rightIndex",
  "7": "rightIndex",
  "8": "rightMiddle",
  "9": "rightRing",
  "0": "rightPinky",

  "-": "rightPinky",
  "=": "rightPinky",

  // ==========================================================
  // QWERTY ROW
  // ==========================================================

  // Left pinky
  Q: "leftPinky",

  // Left ring
  W: "leftRing",

  // Left middle
  E: "leftMiddle",

  // Left index
  R: "leftIndex",
  T: "leftIndex",

  // Right index
  Y: "rightIndex",
  U: "rightIndex",

  // Right middle
  I: "rightMiddle",

  // Right ring
  O: "rightRing",

  // Right pinky
  P: "rightPinky",
  "[": "rightPinky",
  "]": "rightPinky",
  "\\": "rightPinky",

  // ==========================================================
  // HOME ROW
  // ==========================================================

  // Left pinky
  A: "leftPinky",

  // Left ring
  S: "leftRing",

  // Left middle
  D: "leftMiddle",

  // Left index
  F: "leftIndex",
  G: "leftIndex",

  // Right index
  H: "rightIndex",
  J: "rightIndex",

  // Right middle
  K: "rightMiddle",

  // Right ring
  L: "rightRing",

  // Right pinky
  ";": "rightPinky",
  "'": "rightPinky",

  // ==========================================================
  // BOTTOM ROW
  // ==========================================================

  // Left pinky
  Z: "leftPinky",

  // Left ring
  X: "leftRing",

  // Left middle
  C: "leftMiddle",

  // Left index
  V: "leftIndex",
  B: "leftIndex",

  // Right index
  N: "rightIndex",
  M: "rightIndex",

  // Right ring
  ",": "rightRing",
  ".": "rightRing",

  // Right pinky
  "/": "rightPinky",

  // ==========================================================
  // MODIFIER / CONTROL KEYS
  // ==========================================================

  // Left pinky
  SHIFT: "leftPinky",
  TAB: "leftPinky",
  CAPS: "leftPinky",
  CTRL: "leftPinky",

  // Right pinky
  ENTER: "rightPinky",
  BACKSPACE: "rightPinky",

  // ==========================================================
  // THUMBS
  // ==========================================================

  // Space bar
  SPACE: "rightThumb",

  // Left Alt
  ALT: "leftThumb",

  // Right Alt / AltGr
  ALTGR: "rightThumb",
};

// ============================================================
// LOOKUP HELPER
// ============================================================

/**
 * Returns the finger associated with a physical key.
 *
 * The lookup is case-insensitive for single-character
 * alphabetic keys.
 *
 * Examples:
 *
 *     getFinger("a")
 *     -> "leftPinky"
 *
 *     getFinger("A")
 *     -> "leftPinky"
 *
 *     getFinger("s")
 *     -> "leftRing"
 *
 *     getFinger("Space")
 *     -> "rightThumb"
 *
 *     getFinger("q")
 *     -> "leftPinky"
 */
export function getFinger(
  physicalKey: string,
): Finger | undefined {
  if (!physicalKey) {
    return undefined;
  }

  // ----------------------------------------------------------
  // Special physical keys
  // ----------------------------------------------------------

  const specialKey = physicalKey.toUpperCase();

  if (fingerMap[specialKey]) {
    return fingerMap[specialKey];
  }

  // ----------------------------------------------------------
  // Single-character keys
  //
  // Normalize letters to uppercase.
  // Symbols remain unchanged.
  // ----------------------------------------------------------

  const normalized =
    physicalKey.length === 1
      ? physicalKey.toUpperCase()
      : physicalKey;

  return fingerMap[normalized];
}