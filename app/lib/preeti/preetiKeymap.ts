/**
 * Preeti / Nepali keyboard mapping.
 *
 * KeyboardLayout.tsx is the single source of truth.
 *
 * Architecture:
 *
 * KeyboardLayout
 *      ↓
 * nepaliKeymap
 *      ↓
 * nepaliTypingEngine
 *      ↓
 * useNepaliTyping
 */

import {
  keyboardLayout,
  preetiGraphemeStrokes,
  type KeyDef,
} from "@/app/components/keyboard/preeti/PreetiKeyboardLayout";

// ============================================================
// TYPES
// ============================================================

export interface PhysicalKeyStroke {
  /**
   * Physical keyboard key.
   *
   * Examples:
   * "s"
   * "f"
   * "l"
   * "]"
   * "'"
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

export interface NepaliGraphemeToken {
  unicode: string;
  strokes: PhysicalKeyStroke[];
}

/**
 * Backward-compatible type.
 */
export interface NepaliKeyEntry {
  physicalKey: string;
  unicode: string;
  unicodeShift: string;
}

/**
 * Backward-compatible type.
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

  if (physicalKey.length === 1) {
    return physicalKey.toUpperCase();
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

function buildKeymap(): NepaliKeyEntry[] {
  const entries: NepaliKeyEntry[] = [];

  for (const row of getTypingRows()) {
    for (const item of row) {
      if (!isKeyDef(item)) {
        continue;
      }

      // Ignore keys that do not produce Nepali output.
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

export const NEPALI_KEYMAP: NepaliKeyEntry[] =
  buildKeymap();

// ============================================================
// PHYSICAL KEY LOOKUP
// ============================================================

const physicalKeyToEntry =
  new Map<string, NepaliKeyEntry>();

for (const entry of NEPALI_KEYMAP) {
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
 * KeyboardLayout.tsx already contains the
 * authoritative Preeti physical stroke definitions.
 *
 * Example:
 *
 * "त्र"
 *
 * becomes multiple physical strokes according
 * to the definitions in KeyboardLayout.tsx.
 */

function buildExplicitGraphemeTokens():
  Map<string, NepaliGraphemeToken> {
  const map =
    new Map<string, NepaliGraphemeToken>();

  for (const definition of preetiGraphemeStrokes) {
    if (
      !definition.unicode ||
      !definition.strokes ||
      definition.strokes.length === 0
    ) {
      continue;
    }

    map.set(definition.unicode, {
      unicode: definition.unicode,

      // IMPORTANT:
      // preetiGraphemeStrokes already uses
      // PhysicalKeyStroke objects.
      //
      // Therefore we do NOT convert KeyStroke -> PhysicalKeyStroke.
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

function buildBasicGraphemeTokens():
  Map<string, NepaliGraphemeToken> {
  const map =
    new Map<string, NepaliGraphemeToken>();

  for (const row of getTypingRows()) {
    for (const item of row) {
      if (!isKeyDef(item)) {
        continue;
      }

      // ======================================================
      // NORMAL NEPALI OUTPUT
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
      // SHIFT NEPALI OUTPUT
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

  // ==========================================================
  // SPACE
  // ==========================================================

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

  return map;
}

// ============================================================
// GRAPHEME TOKEN MAP
// ============================================================

function buildGraphemeTokenMap():
  Map<string, NepaliGraphemeToken> {
  const map =
    buildBasicGraphemeTokens();

  // ==========================================================
  // EXPLICIT PREETI MAPPINGS OVERRIDE BASIC MAPPINGS
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
 * Example:
 *
 * क्ष
 * ज्ञ
 * त्र
 *
 * are checked before their
 * shorter components.
 */

export const SORTED_GRAPHEME_TOKENS:
  NepaliGraphemeToken[] = [
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

export function lookupByGrapheme(
  unicode: string,
): NepaliGraphemeToken | undefined {
  return GRAPHEME_TOKENS.get(unicode);
}

// ============================================================
// LONGEST GRAPHEME MATCH
// ============================================================

export function findLongestGraphemeToken(
  text: string,
  position: number,
): NepaliGraphemeToken | undefined {
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

function buildReverseMap():
  Map<string, RomanKeyToken> {
  const map =
    new Map<string, RomanKeyToken>();

  for (const entry of NEPALI_KEYMAP) {
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
      !map.has(
        entry.unicodeShift,
      )
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

export const UNICODE_TO_ROMAN_KEY =
  buildReverseMap();

// ============================================================
// SORTED ROMAN TOKENS
// ============================================================

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

export function lookupByUnicode(
  unicode: string,
): RomanKeyToken | undefined {
  return UNICODE_TO_ROMAN_KEY.get(unicode);
}

// ============================================================
// LONGEST ROMAN TOKEN
// ============================================================

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