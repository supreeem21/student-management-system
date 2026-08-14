/**
 * Unicode / Nepali keyboard mapping.
 *
 * UnicodeKeyboardLayout.ts is the single source of truth.
 *
 * Architecture:
 *
 * UnicodeKeyboardLayout
 *        ↓
 * unicodeKeymap
 *        ↓
 * unicodeTypingEngine
 *        ↓
 * useUnicodeTyping
 *
 * There is no phonetic transliteration.
 *
 * The physical keyboard strokes come from:
 *
 *   unicodeGraphemeStrokes
 *
 * defined in UnicodeKeyboardLayout.ts.
 */

// ============================================================
// IMPORTS
// ============================================================

import {
  keyboardLayout,
  unicodeGraphemeStrokes,
  type KeyDef,
} from "@/app/components/keyboard/unicode/UnicodeKeyboardLayout";

// ============================================================
// TYPES
// ============================================================

/**
 * A single physical keyboard stroke.
 *
 * Example:
 *
 * {
 *   physicalKey: "k",
 *   shift: false,
 *   alt: false
 * }
 *
 * or:
 *
 * {
 *   physicalKey: "k",
 *   shift: true,
 *   alt: false
 * }
 */
export interface PhysicalKeyStroke {
  /**
   * Physical keyboard key.
   *
   * Examples:
   * "k"
   * "a"
   * "i"
   * "\\"
   * "Space"
   */
  physicalKey: string;

  /**
   * Whether Shift must be held.
   */
  shift?: boolean;

  /**
   * Whether Alt must be held.
   */
  alt?: boolean;
}

/**
 * A visible Unicode grapheme and the physical
 * strokes required to type it.
 */
export interface UnicodeGraphemeToken {
  unicode: string;
  strokes: PhysicalKeyStroke[];
}

/**
 * Backward-compatible key entry.
 *
 * This represents the output of a physical keyboard key.
 */
export interface UnicodeKeyEntry {
  physicalKey: string;
  unicode: string;
  unicodeShift: string;
}

/**
 * Backward-compatible reverse mapping token.
 */
export interface RomanKeyToken {
  unicode: string;
  physicalKey: string;
  shift: boolean;
}

// ============================================================
// TYPE GUARD
// ============================================================

function isKeyDef(item: KeyDef | string): item is KeyDef {
  return typeof item !== "string";
}

// ============================================================
// NORMALIZE PHYSICAL KEY
// ============================================================

function normalizePhysicalKey(physicalKey: string): string {
  if (!physicalKey) {
    return "";
  }

  return physicalKey.toUpperCase();
}

// ============================================================
// GET TYPING ROWS
// ============================================================

function getTypingRows(): (KeyDef | string)[][] {
  return [
    keyboardLayout.row1,
    keyboardLayout.row2,
    keyboardLayout.row3,
    keyboardLayout.row4,
    keyboardLayout.row5,
  ];
}

// ============================================================
// BUILD BASIC KEYMAP
// ============================================================

/**
 * Builds the physical-key → Unicode output map directly
 * from UnicodeKeyboardLayout.ts.
 *
 * Example:
 *
 *   k → क
 *   Shift + k → ख
 *
 *   g → ग
 *   Shift + g → घ
 */
function buildKeymap(): UnicodeKeyEntry[] {
  const entries: UnicodeKeyEntry[] = [];

  for (const row of getTypingRows()) {
    for (const item of row) {
      if (!isKeyDef(item)) {
        continue;
      }

      // Ignore keys which do not produce Unicode output.
      if (
        item.nepali === undefined &&
        item.nepaliShift === undefined
      ) {
        continue;
      }

      entries.push({
        physicalKey: item.label,

        unicode: item.nepali ?? "",

        unicodeShift:
          item.nepaliShift ??
          item.nepali ??
          "",
      });
    }
  }

  // ==========================================================
  // SPACE
  // ==========================================================

  entries.push({
    physicalKey: "Space",
    unicode: " ",
    unicodeShift: " ",
  });

  return entries;
}

// ============================================================
// BASIC KEYMAP
// ============================================================

export const UNICODE_KEYMAP: UnicodeKeyEntry[] =
  buildKeymap();

// ============================================================
// PHYSICAL KEY LOOKUP
// ============================================================

const physicalKeyToEntry =
  new Map<string, UnicodeKeyEntry>();

for (const entry of UNICODE_KEYMAP) {
  const key = normalizePhysicalKey(
    entry.physicalKey,
  );

  if (!physicalKeyToEntry.has(key)) {
    physicalKeyToEntry.set(key, entry);
  }
}

// ============================================================
// LOOKUP BY PHYSICAL KEY
// ============================================================

/**
 * Returns the Unicode character produced by a physical key.
 *
 * Example:
 *
 * lookupByPhysicalKey("k", false)
 * → "क"
 *
 * lookupByPhysicalKey("k", true)
 * → "ख"
 */
export function lookupByPhysicalKey(
  physicalKey: string,
  shift: boolean,
): string | undefined {
  const key =
    normalizePhysicalKey(physicalKey);

  const entry =
    physicalKeyToEntry.get(key);

  if (!entry) {
    return undefined;
  }

  return shift
    ? entry.unicodeShift
    : entry.unicode;
}

// ============================================================
// EXPLICIT GRAPHEME TOKENS
// ============================================================

/**
 * Builds grapheme tokens from the explicit physical
 * stroke definitions in UnicodeKeyboardLayout.ts.
 *
 * These definitions are authoritative for:
 *
 *   क्ष
 *   त्र
 *   ज्ञ
 *   श्र
 *   को
 *   का
 *   कि
 *   की
 *   ...
 *
 * The typing engine therefore does not need to guess
 * how these sequences should be typed.
 */
function buildExplicitGraphemeTokens():
  Map<string, UnicodeGraphemeToken> {
  const map =
    new Map<string, UnicodeGraphemeToken>();

  for (const definition of unicodeGraphemeStrokes) {
    if (
      !definition.unicode ||
      !definition.strokes ||
      definition.strokes.length === 0
    ) {
      continue;
    }

    map.set(definition.unicode, {
      unicode: definition.unicode,

      strokes: definition.strokes.map(
        (stroke) => ({
          physicalKey: stroke.key,
          shift: stroke.shift ?? false,
          alt: stroke.alt ?? false,
        }),
      ),
    });
  }

  return map;
}

// ============================================================
// BASIC GRAPHEME TOKENS
// ============================================================

/**
 * Builds one-stroke Unicode grapheme mappings directly
 * from the keyboard layout.
 *
 * Example:
 *
 *   k → क
 *   Shift + k → ख
 *
 *   a → ा
 *   Shift + a → आ
 *
 * Explicit grapheme definitions are applied afterward
 * and therefore override these basic mappings.
 */
function buildBasicGraphemeTokens():
  Map<string, UnicodeGraphemeToken> {
  const map =
    new Map<string, UnicodeGraphemeToken>();

  for (const row of getTypingRows()) {
    for (const item of row) {
      if (!isKeyDef(item)) {
        continue;
      }

      // ======================================================
      // NORMAL UNICODE OUTPUT
      // ======================================================

      if (item.nepali) {
        map.set(item.nepali, {
          unicode: item.nepali,

          strokes: [
            {
              physicalKey: item.label,
              shift: false,
              alt: false,
            },
          ],
        });
      }

      // ======================================================
      // SHIFT UNICODE OUTPUT
      // ======================================================

      if (item.nepaliShift) {
        map.set(item.nepaliShift, {
          unicode: item.nepaliShift,

          strokes: [
            {
              physicalKey: item.label,
              shift: true,
              alt: false,
            },
          ],
        });
      }
    }
  }

  return map;
}

// ============================================================
// SPACE
// ============================================================

function addSpaceToken(
  map: Map<string, UnicodeGraphemeToken>,
): void {
  map.set(" ", {
    unicode: " ",

    strokes: [
      {
        physicalKey: "Space",
        shift: false,
        alt: false,
      },
    ],
  });
}

// ============================================================
// GRAPHEME TOKEN MAP
// ============================================================

/**
 * Builds the complete Unicode grapheme token map.
 *
 * Priority:
 *
 *   1. Basic keyboard mappings
 *   2. Explicit grapheme mappings
 *
 * Therefore explicit definitions override basic mappings.
 *
 * Example:
 *
 * The basic layout may allow:
 *
 *   क → k
 *
 * while the explicit definitions additionally contain:
 *
 *   का → k + a
 *
 * Both can coexist.
 */
function buildGraphemeTokenMap():
  Map<string, UnicodeGraphemeToken> {
  const map =
    buildBasicGraphemeTokens();

  // ==========================================================
  // SPACE
  // ==========================================================

  addSpaceToken(map);

  // ==========================================================
  // EXPLICIT UNICODE MAPPINGS
  // ==========================================================

  const explicit =
    buildExplicitGraphemeTokens();

  for (const [
    unicode,
    token,
  ] of explicit) {
    map.set(unicode, token);
  }

  return map;
}

// ============================================================
// GRAPHEME TOKENS
// ============================================================

export const GRAPHEME_TOKENS =
  buildGraphemeTokenMap();

// ============================================================
// SORTED GRAPHEME TOKENS
// ============================================================

/**
 * Longest Unicode tokens first.
 *
 * This is extremely important.
 *
 * For example, when the target is:
 *
 *   क्ष
 *
 * the engine should check:
 *
 *   क्ष
 *
 * before:
 *
 *   क
 *
 * or:
 *
 *   ष
 *
 * Similarly:
 *
 *   को
 *
 * should be checked before:
 *
 *   क
 *
 * followed by:
 *
 *   ो
 */
export const SORTED_GRAPHEME_TOKENS:
  UnicodeGraphemeToken[] = [
    ...GRAPHEME_TOKENS.values(),
  ].sort((a, b) => {
    const aLength =
      Array.from(a.unicode).length;

    const bLength =
      Array.from(b.unicode).length;

    return bLength - aLength;
  });

// ============================================================
// LOOKUP BY GRAPHEME
// ============================================================

/**
 * Finds an exact Unicode grapheme token.
 */
export function lookupByGrapheme(
  unicode: string,
): UnicodeGraphemeToken | undefined {
  return GRAPHEME_TOKENS.get(unicode);
}

// ============================================================
// LONGEST GRAPHEME MATCH
// ============================================================

/**
 * Finds the longest Unicode grapheme beginning at
 * the supplied position.
 *
 * Example:
 *
 * text:
 *
 *   "क्षितिज"
 *
 * position:
 *
 *   0
 *
 * may match:
 *
 *   "क्ष"
 *
 * before matching:
 *
 *   "क"
 */
export function findLongestGraphemeToken(
  text: string,
  position: number,
): UnicodeGraphemeToken | undefined {
  for (
    const token of SORTED_GRAPHEME_TOKENS
  ) {
    if (
      text.startsWith(
        token.unicode,
        position,
      )
    ) {
      return token;
    }
  }

  return undefined;
}

// ============================================================
// REVERSE MAP
// ============================================================

/**
 * Builds the reverse:
 *
 * Unicode → physical key
 *
 * map from the basic keyboard layout.
 *
 * IMPORTANT:
 *
 * This reverse map represents single physical-key
 * mappings.
 *
 * Multi-stroke graphemes such as:
 *
 *   क्ष
 *   त्र
 *   ज्ञ
 *   को
 *
 * are handled by GRAPHEME_TOKENS instead.
 */
function buildReverseMap():
  Map<string, RomanKeyToken> {
  const map =
    new Map<string, RomanKeyToken>();

  for (const entry of UNICODE_KEYMAP) {
    // ========================================================
    // NORMAL OUTPUT
    // ========================================================

    if (
      entry.unicode &&
      !map.has(entry.unicode)
    ) {
      map.set(
        entry.unicode,
        {
          unicode: entry.unicode,

          physicalKey:
            entry.physicalKey,

          shift: false,
        },
      );
    }

    // ========================================================
    // SHIFT OUTPUT
    // ========================================================

    if (
      entry.unicodeShift &&
      !map.has(entry.unicodeShift)
    ) {
      map.set(
        entry.unicodeShift,
        {
          unicode:
            entry.unicodeShift,

          physicalKey:
            entry.physicalKey,

          shift: true,
        },
      );
    }
  }

  return map;
}

// ============================================================
// UNICODE → ROMAN KEY
// ============================================================

/**
 * Backward-compatible reverse map.
 *
 * The name is kept as `UNICODE_TO_ROMAN_KEY` so existing
 * code can continue using the same architecture as the
 * Preeti keyboard.
 */
export const UNICODE_TO_ROMAN_KEY =
  buildReverseMap();

// ============================================================
// SORTED ROMAN TOKENS
// ============================================================

/**
 * Longest Unicode tokens first.
 *
 * These are primarily useful for backward-compatible
 * single-key reverse lookup.
 */
export const SORTED_ROMAN_KEY_TOKENS:
  RomanKeyToken[] = [
    ...UNICODE_TO_ROMAN_KEY.values(),
  ].sort((a, b) => {
    const aLength =
      Array.from(a.unicode).length;

    const bLength =
      Array.from(b.unicode).length;

    return bLength - aLength;
  });

// ============================================================
// LOOKUP BY UNICODE
// ============================================================

/**
 * Finds the physical key for a Unicode character.
 *
 * This only represents the basic one-key mapping.
 *
 * For complete multi-stroke graphemes, use:
 *
 *   lookupByGrapheme()
 */
export function lookupByUnicode(
  unicode: string,
): RomanKeyToken | undefined {
  return UNICODE_TO_ROMAN_KEY.get(
    unicode,
  );
}

// ============================================================
// LONGEST ROMAN TOKEN
// ============================================================

/**
 * Finds the longest basic Unicode token beginning at
 * the supplied position.
 *
 * Kept for compatibility with the Preeti architecture.
 */
export function findLongestRomanToken(
  text: string,
  position: number,
): RomanKeyToken | undefined {
  for (
    const token of SORTED_ROMAN_KEY_TOKENS
  ) {
    if (
      text.startsWith(
        token.unicode,
        position,
      )
    ) {
      return token;
    }
  }

  return undefined;
}