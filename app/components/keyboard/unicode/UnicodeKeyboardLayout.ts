// ============================================================
// TYPES
// ============================================================

export interface KeyboardLayout {
  function: string[];
  row1: (KeyDef | string)[];
  row2: (KeyDef | string)[];
  row3: (KeyDef | string)[];
  row4: (KeyDef | string)[];
  row5: (KeyDef | string)[];
}

export interface KeyStroke {
  key: string;
  shift?: boolean;
  alt?: boolean;
}

export interface KeyDef {
  label: string;

  // English keyboard output
  shift?: string;

  // Nepali / Unicode output
  nepali?: string;
  nepaliShift?: string;

  // Optional explicit physical sequence for
  // complex Nepali graphemes.
  strokes?: KeyStroke[];
}

export interface AltCombination {
  code: string;
  output: string;
}

// ============================================================
// KEYBOARD LAYOUT
// ============================================================

export const keyboardLayout: KeyboardLayout = {
  // ==========================================================
  // FUNCTION KEYS
  // ==========================================================

  function: [
    "Esc",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
  ],

  // ==========================================================
  // NUMBER ROW
  // ==========================================================

  row1: [
    {
      label: "`",
      shift: "~",
      nepali: "",
      nepaliShift: "",
    },

    {
      label: "1",
      shift: "!",
      nepali: "१",
      nepaliShift: "!",
    },

    {
      label: "2",
      shift: "@",
      nepali: "२",
      nepaliShift: "@",
    },

    {
      label: "3",
      shift: "#",
      nepali: "३",
      nepaliShift: "#",
    },

    {
      label: "4",
      shift: "$",
      nepali: "४",
      nepaliShift: "$",
    },

    {
      label: "5",
      shift: "%",
      nepali: "५",
      nepaliShift: "%",
    },

    {
      label: "6",
      shift: "^",
      nepali: "६",
      nepaliShift: "^",
    },

    {
      label: "7",
      shift: "&",
      nepali: "७",
      nepaliShift: "&",
    },

    {
      label: "8",
      shift: "*",
      nepali: "८",
      nepaliShift: "*",
    },

    {
      label: "9",
      shift: "(",
      nepali: "९",
      nepaliShift: "(",
    },

    {
      label: "0",
      shift: ")",
      nepali: "०",
      nepaliShift: ")",
    },

    {
      label: "-",
      shift: "_",
      nepali: "-",
      nepaliShift: "_",
    },

    {
      label: "=",
      shift: "+",
      nepali: "=",
      nepaliShift: "+",
    },

    {
      label: "Backspace",
    },
  ],

  // ==========================================================
  // QWERTY ROW
  // ==========================================================

  row2: [
    {
      label: "Tab",
    },

    {
      label: "q",
      shift: "Q",
      nepali: "ट",
      nepaliShift: "ठ",
    },

    {
      label: "w",
      shift: "W",
      nepali: "ौ",
      nepaliShift: "औ",
    },

    {
      label: "e",
      shift: "E",
      nepali: "े",
      nepaliShift: "ै",
    },

    {
      label: "r",
      shift: "R",
      nepali: "र",
      nepaliShift: "ृ",
    },

    {
      label: "t",
      shift: "T",
      nepali: "त",
      nepaliShift: "थ",
    },

    {
      label: "y",
      shift: "Y",
      nepali: "य",
      nepaliShift: "ञ",
    },

    {
      label: "u",
      shift: "U",
      nepali: "ु",
      nepaliShift: "ू",
    },

    {
      label: "i",
      shift: "I",
      nepali: "ि",
      nepaliShift: "ी",
    },

    {
      label: "o",
      shift: "O",
      nepali: "ो",
      nepaliShift: "ओ",
    },

    {
      label: "p",
      shift: "P",
      nepali: "प",
      nepaliShift: "फ",
    },

    {
      label: "[",
      shift: "{",
      nepali: "इ",
      nepaliShift: "ई",
    },

    {
      label: "]",
      shift: "}",
      nepali: "ए",
      nepaliShift: "ऐ",
    },

    {
      label: "\\",
      shift: "|",
      nepali: "",
      nepaliShift: "",
    },
  ],

  // ==========================================================
  // HOME ROW
  // ==========================================================

  row3: [
    {
      label: "Caps",
    },

    {
      label: "a",
      shift: "A",
      nepali: "अ",
      nepaliShift: "आ",
    },

    {
      label: "s",
      shift: "S",
      nepali: "स",
      nepaliShift: "श",
    },

    {
      label: "d",
      shift: "D",
      nepali: "द",
      nepaliShift: "ध",
    },

    {
      label: "f",
      shift: "F",
      nepali: "उ",
      nepaliShift: "ऊ",
    },

    {
      label: "g",
      shift: "G",
      nepali: "ग",
      nepaliShift: "घ",
    },

    {
      label: "h",
      shift: "H",
      nepali: "ह",
      nepaliShift: "अ",
    },

    {
      label: "j",
      shift: "J",
      nepali: "ज",
      nepaliShift: "झ",
    },

    {
      label: "k",
      shift: "K",
      nepali: "क",
      nepaliShift: "ख",
    },

    {
      label: "l",
      shift: "L",
      nepali: "ल",
      nepaliShift: "",
    },

    {
      label: ";",
      shift: ":",
      nepali: "",
      nepaliShift: "ः",
    },

    {
      label: "'",
      shift: '"',
      nepali: "",
      nepaliShift: "",
    },

    {
      label: "Enter",
    },
  ],

  // ==========================================================
  // BOTTOM ROW
  // ==========================================================

  row4: [
    {
      label: "Shift",
    },

    {
      label: "z",
      shift: "Z",
      nepali: "ष",
      nepaliShift: "ऋ",
    },

    {
      label: "x",
      shift: "X",
      nepali: "ड",
      nepaliShift: "ढ",
    },

    {
      label: "c",
      shift: "C",
      nepali: "च",
      nepaliShift: "छ",
    },

    {
      label: "v",
      shift: "V",
      nepali: "व",
      nepaliShift: "ँ",
    },

    {
      label: "b",
      shift: "B",
      nepali: "ब",
      nepaliShift: "भ",
    },

    {
      label: "n",
      shift: "N",
      nepali: "न",
      nepaliShift: "ण",
    },

    {
      label: "m",
      shift: "M",
      nepali: "म",
      nepaliShift: "ं",
    },

    {
      label: ",",
      shift: "<",
      nepali: ",",
      nepaliShift: "ङ",
    },

    {
      label: ".",
      shift: ">",
      nepali: "।",
      nepaliShift: "?",
    },

    {
      label: "/",
      shift: "?",
      nepali: "्",
      nepaliShift: "",
    },

    {
      label: "Shift",
    },
  ],

  // ==========================================================
  // CONTROL ROW
  // ==========================================================

  row5: [
    {
      label: "Ctrl",
    },

    {
      label: "Win",
    },

    {
      label: "Alt",
    },

    {
      label: "Space",

      strokes: [
        {
          key: " ",
        },
      ],
    },

    {
      label: "AltGr",
    },

    {
      label: "Fn",
    },

    {
      label: "Menu",
    },

    {
      label: "Ctrl",
    },
  ],
};

// ============================================================
// GRAPHEME / STROKE DEFINITIONS
//
// These describe the physical key sequence required to
// produce Unicode Nepali characters.
//
// IMPORTANT:
//
// Unicode typing is different from Preeti typing.
//
// For example:
//
//   क  -> k
//   ख  -> Shift + k
//   ग  -> g
//   घ  -> Shift + g
//
// Complex characters use multiple physical strokes.
//
// Example:
//
//   क्ष -> k + / + z
//   त्र -> t + / + r
//   ज्ञ -> j + / + Shift+y
// ============================================================

export interface GraphemeStroke {
  unicode: string;
  strokes: KeyStroke[];
}

export const unicodeGraphemeStrokes: GraphemeStroke[] = [
  // ----------------------------------------------------------
  // BASIC CONSONANTS
  // ----------------------------------------------------------

  {
    unicode: "क",
    strokes: [{ key: "k" }],
  },

  {
    unicode: "ख",
    strokes: [{ key: "k", shift: true }],
  },

  {
    unicode: "ग",
    strokes: [{ key: "g" }],
  },

  {
    unicode: "घ",
    strokes: [{ key: "g", shift: true }],
  },

  {
    unicode: "ङ",
    strokes: [{ key: ",", shift: true }],
  },

  {
    unicode: "च",
    strokes: [{ key: "c" }],
  },

  {
    unicode: "छ",
    strokes: [{ key: "c", shift: true }],
  },

  {
    unicode: "ज",
    strokes: [{ key: "j" }],
  },

  {
    unicode: "झ",
    strokes: [{ key: "j", shift: true }],
  },

  {
    unicode: "ञ",
    strokes: [{ key: "y", shift: true }],
  },

  {
    unicode: "ट",
    strokes: [{ key: "q" }],
  },

  {
    unicode: "ठ",
    strokes: [{ key: "q", shift: true }],
  },

  {
    unicode: "ड",
    strokes: [{ key: "x" }],
  },

  {
    unicode: "ढ",
    strokes: [{ key: "x", shift: true }],
  },

  {
    unicode: "ण",
    strokes: [{ key: "n", shift: true }],
  },

  {
    unicode: "त",
    strokes: [{ key: "t" }],
  },

  {
    unicode: "थ",
    strokes: [{ key: "t", shift: true }],
  },

  {
    unicode: "द",
    strokes: [{ key: "d" }],
  },

  {
    unicode: "ध",
    strokes: [{ key: "d", shift: true }],
  },

  {
    unicode: "न",
    strokes: [{ key: "n" }],
  },

  {
    unicode: "प",
    strokes: [{ key: "p" }],
  },

  {
    unicode: "फ",
    strokes: [{ key: "p", shift: true }],
  },

  {
    unicode: "ब",
    strokes: [{ key: "b" }],
  },

  {
    unicode: "भ",
    strokes: [{ key: "b", shift: true }],
  },

  {
    unicode: "म",
    strokes: [{ key: "m" }],
  },

  {
    unicode: "य",
    strokes: [{ key: "y" }],
  },

  {
    unicode: "र",
    strokes: [{ key: "r" }],
  },

  {
    unicode: "ल",
    strokes: [{ key: "l" }],
  },

  {
    unicode: "व",
    strokes: [{ key: "v" }],
  },

  {
    unicode: "श",
    strokes: [{ key: "s", shift: true }],
  },

  {
    unicode: "ष",
    strokes: [{ key: "z" }],
  },

  {
    unicode: "स",
    strokes: [{ key: "s" }],
  },

  {
    unicode: "ह",
    strokes: [{ key: "h" }],
  },

  // ----------------------------------------------------------
  // INDEPENDENT VOWELS
  // ----------------------------------------------------------

  {
    unicode: "अ",
    strokes: [{ key: "h", shift: true }],
  },

  {
    unicode: "आ",
    strokes: [{ key: "a", shift: true }],
  },

  {
    unicode: "इ",
    strokes: [{ key: "[" }],
  },

  {
    unicode: "ई",
    strokes: [{ key: "[", shift: true }],
  },

  {
    unicode: "उ",
    strokes: [{ key: "f" }],
  },

  {
    unicode: "ऊ",
    strokes: [{ key: "f", shift: true }],
  },

  {
    unicode: "ऋ",
    strokes: [{ key: "z", shift: true }],
  },

  {
    unicode: "ए",
    strokes: [{ key: "]" }],
  },

  {
    unicode: "ऐ",
    strokes: [{ key: "]", shift: true }],
  },

  {
    unicode: "ओ",
    strokes: [{ key: "o", shift: true }],
  },

  {
    unicode: "औ",
    strokes: [{ key: "w", shift: true }],
  },

  // ----------------------------------------------------------
  // MATRAS
  // ----------------------------------------------------------

  {
    unicode: "ा",
    strokes: [{ key: "a" }],
  },

  {
    unicode: "ि",
    strokes: [{ key: "i" }],
  },

  {
    unicode: "ी",
    strokes: [{ key: "i", shift: true }],
  },

  {
    unicode: "ु",
    strokes: [{ key: "u" }],
  },

  {
    unicode: "ू",
    strokes: [{ key: "u", shift: true }],
  },

  {
    unicode: "ृ",
    strokes: [{ key: "r", shift: true }],
  },

  {
    unicode: "े",
    strokes: [{ key: "e" }],
  },

  {
    unicode: "ै",
    strokes: [{ key: "e", shift: true }],
  },

  {
    unicode: "ो",
    strokes: [{ key: "o" }],
  },

  {
    unicode: "ौ",
    strokes: [{ key: "w" }],
  },

  // ----------------------------------------------------------
  // SIGNS
  // ----------------------------------------------------------

  {
    unicode: "ं",
    strokes: [{ key: "m", shift: true }],
  },

  {
    unicode: "ः",
    strokes: [{ key: ";", shift: true }],
  },

  {
    unicode: "ँ",
    strokes: [{ key: "v", shift: true }],
  },

  {
    unicode: "्",
    strokes: [{ key: "\\" }],
  },

  // ----------------------------------------------------------
  // COMMON CONJUNCTS
  // ----------------------------------------------------------

  {
    unicode: "क्ष",
    strokes: [
      { key: "k" },
      { key: "\\" },
      { key: "z" },
    ],
  },

  {
    unicode: "त्र",
    strokes: [
      { key: "t" },
      { key: "\\" },
      { key: "r" },
    ],
  },

  {
    unicode: "ज्ञ",
    strokes: [
      { key: "j" },
      { key: "\\" },
      { key: "y", shift: true },
    ],
  },

  {
    unicode: "श्र",
    strokes: [
      { key: "s", shift: true },
      { key: "\\" },
      { key: "r" },
    ],
  },

  {
    unicode: "त्त",
    strokes: [
      { key: "t" },
      { key: "\\" },
      { key: "t" },
    ],
  },

  {
    unicode: "द्ध",
    strokes: [
      { key: "d" },
      { key: "\\" },
      { key: "d", shift: true },
    ],
  },

  // ----------------------------------------------------------
  // COMMON COMBINATIONS
  // ----------------------------------------------------------

  {
    unicode: "को",
    strokes: [
      { key: "k" },
      { key: "o" },
    ],
  },

  {
    unicode: "का",
    strokes: [
      { key: "k" },
      { key: "a" },
    ],
  },

  {
    unicode: "कि",
    strokes: [
      { key: "k" },
      { key: "i" },
    ],
  },

  {
    unicode: "की",
    strokes: [
      { key: "k" },
      { key: "i", shift: true },
    ],
  },

  {
    unicode: "कु",
    strokes: [
      { key: "k" },
      { key: "u" },
    ],
  },

  {
    unicode: "कू",
    strokes: [
      { key: "k" },
      { key: "u", shift: true },
    ],
  },

  {
    unicode: "कृ",
    strokes: [
      { key: "k" },
      { key: "r", shift: true },
    ],
  },

  {
    unicode: "के",
    strokes: [
      { key: "k" },
      { key: "e" },
    ],
  },

  {
    unicode: "कै",
    strokes: [
      { key: "k" },
      { key: "e", shift: true },
    ],
  },

  {
    unicode: "कौ",
    strokes: [
      { key: "k" },
      { key: "w" },
    ],
  },

  {
    unicode: "कं",
    strokes: [
      { key: "k" },
      { key: "m", shift: true },
    ],
  },

  {
    unicode: "कः",
    strokes: [
      { key: "k" },
      { key: ";", shift: true },
    ],
  },

  {
    unicode: "कँ",
    strokes: [
      { key: "k" },
      { key: "v", shift: true },
    ],
  },

  // ----------------------------------------------------------
  // PUNCTUATION
  //
  // Explicit, in addition to the row1/row4 legends above,
  // so the engine never depends on a single source going
  // stale (see unicodeKeymap.ts / §2.4 of the audit).
  // ----------------------------------------------------------

  {
    unicode: "।",
    strokes: [{ key: "." }],
  },

  {
    unicode: "?",
    strokes: [{ key: ".", shift: true }],
  },

  {
    unicode: "!",
    strokes: [{ key: "1", shift: true }],
  },

  {
    unicode: ",",
    strokes: [{ key: "," }],
  },

  {
    unicode: "-",
    strokes: [{ key: "-" }],
  },

  // ----------------------------------------------------------
  // DIGITS
  // ----------------------------------------------------------

  {
    unicode: "०",
    strokes: [{ key: "0" }],
  },

  {
    unicode: "१",
    strokes: [{ key: "1" }],
  },

  {
    unicode: "२",
    strokes: [{ key: "2" }],
  },

  {
    unicode: "३",
    strokes: [{ key: "3" }],
  },

  {
    unicode: "४",
    strokes: [{ key: "4" }],
  },

  {
    unicode: "५",
    strokes: [{ key: "5" }],
  },

  {
    unicode: "६",
    strokes: [{ key: "6" }],
  },

  {
    unicode: "७",
    strokes: [{ key: "7" }],
  },

  {
    unicode: "८",
    strokes: [{ key: "8" }],
  },

  {
    unicode: "९",
    strokes: [{ key: "9" }],
  },

  // ----------------------------------------------------------
  // SPACE
  // ----------------------------------------------------------

  {
    unicode: " ",
    strokes: [{ key: "Space" }],
  },
];

// ============================================================
// ALT + NUMBER SPECIAL CHARACTER COMBINATIONS
// ============================================================
//
// Unicode keyboard does not depend on the Preeti Alt-code
// mappings, so this is intentionally kept empty.
//
// The interface is preserved so the rest of the keyboard
// architecture remains identical to PreetiKeyboardLayout.ts.
// ============================================================

export const altCombinations: AltCombination[] = [];