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

  // Nepali / Preeti output
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
      nepali: "ञ",
      // Previously duplicated "ञ" on both unshifted and
      // shifted press. ङ (velar nasal) had no direct key
      // anywhere in this layout (audit §2.7) — bind it here
      // instead of the redundant duplicate.
      nepaliShift: "ङ",
    },

    {
      label: "1",
      shift: "!",
      nepali: "१",
      nepaliShift: "ज्ञ",
    },

    {
      label: "2",
      shift: "@",
      nepali: "२",
      nepaliShift: "द्द",
    },

    {
      label: "3",
      shift: "#",
      nepali: "३",
      nepaliShift: "घ",
    },

    {
      label: "4",
      shift: "$",
      nepali: "४",
      nepaliShift: "झ",
    },

    {
      label: "5",
      shift: "%",
      nepali: "५",
      nepaliShift: "छ",
    },

    {
      label: "6",
      shift: "^",
      nepali: "६",
      nepaliShift: "ट",
    },

    {
      label: "7",
      shift: "&",
      nepali: "७",
      nepaliShift: "ठ",
    },

    {
      label: "8",
      shift: "*",
      nepali: "८",
      nepaliShift: "ड",
    },

    {
      label: "9",
      shift: "(",
      nepali: "९",
      nepaliShift: "ढ",
    },

    {
      label: "0",
      shift: ")",
      nepali: "०",
      nepaliShift: "ण",
    },

    {
      label: "-",
      shift: "_",
      nepali: ")",
      nepaliShift: "(",
    },

    {
      label: "=",
      shift: "+",
      nepali: "ं",
      // "।" (danda) is intentionally not duplicated here.
      // The canonical key is unshifted "." (see row4 and
      // preetiGraphemeStrokes) — audit §2.8.
      nepaliShift: "",
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
      nepali: "त्र",
      nepaliShift: "त्त",

      strokes: [
        {
          key: "t",
        },
        {
          key: "/",
        },
        {
          key: "r",
        },
      ],
    },

    {
      label: "w",
      shift: "W",
      nepali: "ध",
      nepaliShift: "ध्",
    },

    {
      label: "e",
      shift: "E",
      nepali: "भ",
      nepaliShift: "भ्",
    },

    {
      label: "r",
      shift: "R",
      nepali: "च",
      nepaliShift: "च्",
    },

    {
      label: "t",
      shift: "T",
      nepali: "त",
      nepaliShift: "त्",
    },

    {
      label: "y",
      shift: "Y",
      nepali: "थ",
      nepaliShift: "थ्",
    },

    {
      label: "u",
      shift: "U",
      nepali: "ग",
      nepaliShift: "ग्",
    },

    {
      label: "i",
      shift: "I",
      nepali: "ष",
      nepaliShift: "क्ष",
    },

    {
      label: "o",
      shift: "O",
      nepali: "य",
      nepaliShift: "इ",
    },

    {
      label: "p",
      shift: "P",
      nepali: "उ",
      nepaliShift: "ए",
    },

    {
      label: "[",
      shift: "{",
      nepali: "ृ",
      nepaliShift: "ई",
    },

    {
      label: "]",
      shift: "}",
      nepali: "े",
      nepaliShift: "ै",
    },

    {
      label: "\\",
      shift: "|",
      nepali: "्",
      nepaliShift: "्र",
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
      nepali: "ब",
      nepaliShift: "ब्",
    },

    {
      label: "s",
      shift: "S",
      nepali: "क",
      nepaliShift: "क्",
    },

    {
      label: "d",
      shift: "D",
      nepali: "म",
      nepaliShift: "म्",
    },

    {
      label: "f",
      shift: "F",
      nepali: "ा",
      nepaliShift: "ँ",
    },

    {
      label: "g",
      shift: "G",
      nepali: "न",
      nepaliShift: "न्",
    },

    {
      label: "h",
      shift: "H",
      nepali: "ज",
      nepaliShift: "ज्",
    },

    {
      label: "j",
      shift: "J",
      nepali: "व",
      nepaliShift: "व्",
    },

    {
      label: "k",
      shift: "K",
      nepali: "प",
      nepaliShift: "फ",
    },

    {
      label: "l",
      shift: "L",
      nepali: "ि",
      nepaliShift: "ी",
    },

    {
      label: ";",
      shift: ":",
      nepali: "स",
      nepaliShift: "स्",
    },

    {
      label: "'",
      shift: '"',
      nepali: "ु",
      nepaliShift: "ू",
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
      nepali: "श",
      nepaliShift: "श्",
    },

    {
      label: "x",
      shift: "X",
      nepali: "ह",
      nepaliShift: "ह्",
    },

    {
      label: "c",
      shift: "C",
      nepali: "अ",
      nepaliShift: "ऋ",
    },

    {
      label: "v",
      shift: "V",
      nepali: "ख",
      nepaliShift: "ख्",
    },

    {
      label: "b",
      shift: "B",
      nepali: "द",
      nepaliShift: "द्य",
    },

    {
      label: "n",
      shift: "N",
      nepali: "ल",
      nepaliShift: "ल्",
    },

    {
      label: "m",
      shift: "M",
      nepali: "ः",
      nepaliShift: "फ्",
    },

    {
      label: ",",
      shift: "<",
      nepali: ",",
      nepaliShift: "?",
    },

    {
      label: ".",
      shift: ">",
      nepali: "।",
      nepaliShift: "श्र",
    },

    {
      label: "/",
      shift: "?",
      nepali: "र",
      nepaliShift: "र्",
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
// IMPORTANT:
//
// These are NOT guessed Unicode -> key mappings.
//
// They describe the actual ordered physical strokes needed
// by the Preeti layout.
//
// The typing engine should use these definitions when
// converting a visible Unicode grapheme into keystrokes.
// ============================================================

export interface GraphemeStroke {
  unicode: string;
  strokes: KeyStroke[];
}

export const preetiGraphemeStrokes: GraphemeStroke[] = [
  // ----------------------------------------------------------
  // Basic consonants
  // ----------------------------------------------------------

  {
    unicode: "क",
    strokes: [{ key: "s" }],
  },

  {
    unicode: "ख",
    strokes: [{ key: "v" }],
  },

  {
    unicode: "ग",
    strokes: [{ key: "u" }],
  },

  {
    unicode: "घ",
    strokes: [{ key: "3" }],
  },

  {
    unicode: "च",
    strokes: [{ key: "r" }],
  },

  {
    unicode: "छ",
    strokes: [{ key: "5" }],
  },

  {
    unicode: "ज",
    strokes: [{ key: "h" }],
  },

  {
    unicode: "झ",
    strokes: [{ key: "4", shift: true }],
  },

  {
    unicode: "ट",
    strokes: [{ key: "6" }],
  },

  {
    unicode: "ठ",
    strokes: [{ key: "7" }],
  },

  {
    unicode: "ड",
    strokes: [{ key: "8" }],
  },

  {
    unicode: "ढ",
    strokes: [{ key: "9" }],
  },

  {
    unicode: "ण",
    strokes: [{ key: "0" }, { key: "f" }],
  },

  {
    unicode: "त",
    strokes: [{ key: "t" }],
  },

  {
    unicode: "थ",
    strokes: [{ key: "y" }],
  },

  {
    unicode: "द",
    strokes: [{ key: "b" }],
  },

  {
    unicode: "ध",
    strokes: [{ key: "w" }],
  },

  {
    unicode: "न",
    strokes: [{ key: "g" }],
  },

  {
    unicode: "प",
    strokes: [{ key: "k" }],
  },

  {
    unicode: "ब",
    strokes: [{ key: "a" }],
  },

  {
    unicode: "भ",
    strokes: [{ key: "e" }],
  },

  {
    unicode: "म",
    strokes: [{ key: "d" }],
  },

  {
    unicode: "य",
    strokes: [{ key: "o" }],
  },

  {
    unicode: "र",
    strokes: [{ key: "/" }],
  },

  {
    unicode: "ल",
    strokes: [{ key: "n" }],
  },

  {
    unicode: "व",
    strokes: [{ key: "j" }],
  },

  {
    unicode: "श",
    strokes: [{ key: "z" }],
  },

  {
    unicode: "ष",
    strokes: [{ key: "i" }, { key: "f" }],
  },

  {
    unicode: "स",
    strokes: [{ key: ";" }],
  },

  {
    unicode: "ह",
    strokes: [{ key: "x" }],
  },

  {
    unicode: "ङ",
    strokes: [{ key: "`", shift: true }],
  },

  // ----------------------------------------------------------
  // VOWEL / INDEPENDENT VOWELS
  // ----------------------------------------------------------

  {
    unicode: "अ",
    strokes: [{ key: "c" }],
  },

  {
    unicode: "आ",
    strokes: [{ key: "c" }, { key: "f" }],
  },

  {
    unicode: "इ",
    strokes: [{ key: "[" }],
  },

  {
    unicode: "ई",
    strokes: [{ key: "[" }, { key: "]", shift: true }],
  },

  {
    unicode: "उ",
    strokes: [{ key: "p" }],
  },

  {
    unicode: "ऊ",
    strokes: [{ key: "p" }, { key: "'", shift: true }],
  },

  {
    unicode: "ए",
    strokes: [{ key: "]" }],
  },

  {
    unicode: "ऐ",
    strokes: [{ key: "]", shift: true }],
  },

  // ----------------------------------------------------------
  // MATRAS
  // ----------------------------------------------------------

  {
    unicode: "ा",
    strokes: [{ key: "f" }],
  },

  {
    unicode: "ि",
    strokes: [{ key: "l" }],
  },

  {
    unicode: "ी",
    strokes: [{ key: "l", shift: true }],
  },

  {
    unicode: "ु",
    strokes: [{ key: "'" }],
  },

  {
    unicode: "ू",
    strokes: [{ key: "'", shift: true }],
  },

  {
    unicode: "े",
    strokes: [{ key: "]" }],
  },

  {
    unicode: "ै",
    strokes: [{ key: "]", shift: true }],
  },

  {
    unicode: "ो",
    strokes: [{ key: "f" }, { key: "]" }],
  },

  {
    unicode: "ौ",
    strokes: [{ key: "f" }, { key: "]", shift: true }],
  },

  // ----------------------------------------------------------
  // SIGNS
  // ----------------------------------------------------------

  {
    unicode: "ं",
    strokes: [{ key: "+" }, { key: "=", shift: true }],
  },

  {
    unicode: "ः",
    strokes: [{ key: "]" }],
  },

  {
    unicode: "्",
    strokes: [{ key: "6", shift: true }],
  },

  {
    unicode: "।",
    strokes: [{ key: "." }],
  },

  // ----------------------------------------------------------
  // COMMON CONJUNCTS
  // ----------------------------------------------------------

  {
    unicode: "त्र",
    strokes: [{ key: "t" }, { key: "/" }, { key: "r" }],
  },

  {
    unicode: "क्ष",
    strokes: [{ key: "k" }, { key: "/" }, { key: "z" }],
  },

  {
    unicode: "ज्ञ",
    strokes: [{ key: "j" }, { key: "/" }, { key: "y" }],
  },

  {
    unicode: "श्र",
    strokes: [{ key: "z", shift: true }, { key: "/" }, { key: "r" }],
  },

  {
    unicode: "द्य",
    strokes: [{ key: "b" }, { key: "/" }, { key: "o" }],
  },

  {
    unicode: "द्ध",
    strokes: [{ key: "d" }, { key: "4" }],
  },

  {
    unicode: "त्त",
    strokes: [{ key: "t" }, { key: "/" }, { key: "t" }],
  },

  {
    unicode: "छौं",
    strokes: [
      { key: "5" },
      { key: "f" },
      { key: "]", shift: true },
      { key: "=", shift: true },
    ],
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

export const altCombinations: AltCombination[] = [
  {
    code: "0132",
    output: "घ",
  },
  {
    code: "0133",
    output: "‘",
  },
  {
    code: "0218",
    output: "’",
  },
  {
    code: "0230",
    output: "“",
  },
  {
    code: "0198",
    output: "”",
  },
  {
    code: "0150",
    output: "-",
  },
  {
    code: "0151",
    output: "—",
  },
  {
    code: "0152",
    output: "§",
  },
  {
    code: "0177",
    output: "+",
  },
  {
    code: "0210",
    output: "…",
  },
  {
    code: "0214",
    output: "=",
  },
  {
    code: "0247",
    output: "/",
  },
  {
    code: "0171",
    output: "^",
  },
  {
    code: "0222",
    output: ".",
  },
  {
    code: "0220",
    output: "%",
  },
  {
    code: "0219",
    output: "!",
  },
  {
    code: "0217",
    output: ";",
  },
  {
    code: "0167",
    output: "्",
  },
  {
    code: "0203",
    output: "ज्ञ",
  },
  {
    code: "0205",
    output: "ङ",
  },
  {
    code: "0206",
    output: "ॐ",
  },
  {
    code: "0221",
    output: "ु",
  },
  {
    code: "0170",
    output: "ू",
  },
  {
    code: "0182",
    output: "्",
  },
  {
    code: "0139",
    output: "ृ",
  },
  {
    code: "0149",
    output: "ु",
  },
  {
    code: "0176",
    output: "ी",
  },
  {
    code: "0155",
    output: "ृ",
  },
  {
    code: "0137",
    output: "भ",
  },
  {
    code: "0231",
    output: "ॐ",
  },
  {
    code: "0136",
    output: "प",
  },
  {
    code: "0163",
    output: "घ",
  },
  {
    code: "0165",
    output: "ङ",
  },
  {
    code: "0216",
    output: "च",
  },
  {
    code: "0229",
    output: "द",
  },
  {
    code: "0223",
    output: "झ",
  },
  {
    code: "0204",
    output: "त्र",
  },
  {
    code: "0191",
    output: "रू",
  },
  {
    code: "0197",
    output: "ह",
  },
];
