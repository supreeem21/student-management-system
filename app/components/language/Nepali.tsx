"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ShowResult from "../ShowResult";
import TargetSentence  from "../TargetSentence";
import { generateRandomSentence } from "../../lib/utils";
import { useAppStore } from "../../../store/useAppStore";
import { useNepaliTyping } from "../../hooks/useNepaliTyping";

import PreetiKeyboard from "../keyboard/preeti/PreetiKeyboard";
import UnicodeKeyboard from "../keyboard/unicode/UnicodeKeyboard";

const nepaliSentences = {
  easy: [
    "मेरो नाम राम हो।",
    "आज मौसम राम्रो छ।",
    "म विद्यालय जान्छु।",
    "मलाई किताब पढ्न मन पर्छ।",
    "हामी सँगै खेल्छौं।",
    "पानी जीवन हो।",
    "यो मेरो घर हो।",
    "तिमी कस्तो छौ?",
    "म बिहान उठ्छु।",
    "उहाँ शिक्षक हुनुहुन्छ।",
    "हामी खाना खान्छौं।",
    "नेपाल सुन्दर देश हो।",
    "म साथीसँग कुरा गर्छु।",
    "कुकुर भुकिरहेको छ।",
    "बिरालो सुतिरहेको छ।",
    "फूल धेरै राम्रो छ।",
    "आज शनिबार हो।",
    "म नेपाली लेख्दै छु।",
    "हामी पार्क जान्छौं।",
    "सधैं सत्य बोल।",
  ],

  medium: [
    "हरेक दिन अभ्यास गर्दा टाइपिङ गति बढ्छ।",
    "समयको सही उपयोग गर्नु आवश्यक हुन्छ।",
    "सफलता निरन्तर मेहनतको परिणाम हो।",
    "नयाँ कुरा सिक्न कहिल्यै ढिलो हुँदैन।",
    "स्वास्थ्य नै सबैभन्दा ठूलो धन हो।",
    "सकारात्मक सोचले जीवन परिवर्तन गर्न सक्छ।",
    "इमानदारीले मानिसको सम्मान बढाउँछ।",
    "किताब पढ्दा ज्ञान र अनुभव बढ्छ।",
    "परिवारसँग समय बिताउनु महत्त्वपूर्ण हुन्छ।",
    "प्रकृतिको संरक्षण गर्नु सबैको जिम्मेवारी हो।",
    "आफ्नो लक्ष्य प्राप्त गर्न निरन्तर प्रयास गर्नुहोस्।",
    "सधैं नयाँ सीप सिक्ने बानी बसाल्नुहोस्।",
    "राम्रो साथीले सही बाटो देखाउँछ।",
    "कडा मेहनतले सफलता अवश्य दिलाउँछ।",
    "आत्मविश्वासले कठिन काम पनि सजिलो बनाउँछ।",
    "धैर्य राख्ने मानिसले सफलता चाँडै पाउँछ।",
    "शिक्षा उज्ज्वल भविष्यको आधार हो।",
    "हामीले वातावरण सफा राख्नुपर्छ।",
    "नियमित अभ्यासले उत्कृष्ट परिणाम दिन्छ।",
    "प्रत्येक दिन नयाँ अवसर लिएर आउँछ।",
  ],

  hard: [
    "आधुनिक प्रविधिले मानिसहरूको जीवनशैली र काम गर्ने तरिकामा ठूलो परिवर्तन ल्याएको छ।",
    "निरन्तर अभ्यास, धैर्य र आत्मविश्वासले कुनै पनि कठिन लक्ष्य हासिल गर्न सकिन्छ।",
    "सफल व्यक्तिहरूले असफलतालाई सिकाइको अवसरका रूपमा स्वीकार गर्छन्।",
    "सकारात्मक सोच र अनुशासनले दीर्घकालीन सफलताको आधार तयार गर्छ।",
    "प्रविधिको सही प्रयोगले शिक्षा, स्वास्थ्य र व्यवसायमा उल्लेखनीय सुधार ल्याउन सक्छ।",
    "राम्रो नेतृत्वले टोलीका सदस्यहरूलाई प्रेरित गर्दै साझा लक्ष्यतर्फ अघि बढ्न मद्दत गर्छ।",
    "कुनै पनि समस्या समाधान गर्न तार्किक सोच र उचित योजना आवश्यक हुन्छ।",
    "सफलताको यात्रा साना प्रयासहरूलाई निरन्तर दोहोर्याउँदा मात्र सम्भव हुन्छ।",
    "नियमित अध्ययन र व्यवहारिक अभ्यासले ज्ञानलाई अझ प्रभावकारी बनाउँछ।",
    "समय व्यवस्थापनको सीपले व्यक्तिगत र व्यावसायिक जीवनलाई सन्तुलित बनाउँछ।",
    "डिजिटल प्रविधिको विकाससँगै साइबर सुरक्षाको महत्त्व पनि दिनप्रतिदिन बढ्दै गएको छ।",
    "रचनात्मक सोच भएका व्यक्तिहरूले नयाँ अवसर सिर्जना गर्दै समाजमा सकारात्मक प्रभाव पार्छन्।",
    "टिमवर्क र प्रभावकारी सञ्चारले जटिल परियोजनाहरू सफलतापूर्वक सम्पन्न गर्न सहयोग गर्छ।",
    "सही निर्णय लिनुअघि उपलब्ध जानकारीको विश्लेषण गर्नु अत्यन्त आवश्यक हुन्छ।",
    "दीर्घकालीन उपलब्धिका लागि निरन्तर सिकाइ र आत्मसुधारको प्रक्रिया कहिल्यै रोकिनु हुँदैन।",
    "प्राकृतिक स्रोतहरूको संरक्षण गर्नु भावी पुस्ताप्रतिको हाम्रो साझा जिम्मेवारी हो।",
    "प्रत्येक चुनौतीले नयाँ अनुभव र सिकाइको अवसर प्रदान गर्दछ।",
    "उत्कृष्ट सफ्टवेयर विकासका लागि योजना, परीक्षण र मर्मतसम्भार उत्तिकै महत्त्वपूर्ण हुन्छन्।",
    "प्रभावकारी सञ्चार र सहकार्यले कार्यस्थलमा विश्वास तथा उत्पादकता दुवै बढाउँछ।",
    "आफ्नो लक्ष्यप्रति समर्पित रहने व्यक्तिले कठिन परिस्थितिमा पनि सफलता प्राप्त गर्न सक्छ।",
  ],
};

export default function NepaliComponent() {
  const [placeholderText, setPlaceholderText] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const typingAreaRef = useRef<HTMLDivElement>(null);

  const difficulty = useAppStore((state) => state.difficulty);

  const nepaliLanguageType = useAppStore((state) => state.nepaliLanguageType);

  // ============================================================
  // GENERATE INITIAL SENTENCE
  // ============================================================

  useEffect(() => {
    const sentence = generateRandomSentence(nepaliSentences, difficulty);

    setPlaceholderText(sentence);

    requestAnimationFrame(() => {
      typingAreaRef.current?.focus();
    });
  }, [difficulty]);

  // ============================================================
  // GRAPHEME SEGMENTER
  // ============================================================

  const segmenter = useMemo(
    () =>
      new Intl.Segmenter("ne", {
        granularity: "grapheme",
      }),
    [],
  );

  // ============================================================
  // TARGET LETTERS
  // ============================================================

  const targetLetters = useMemo(
    () =>
      [...segmenter.segment(placeholderText)].map((segment) => segment.segment),
    [placeholderText, segmenter],
  );

  // ============================================================
  // TYPING ENGINE
  // ============================================================

  const {
    typedUnicode,
    typedCorrectness,
    typedCount,
    isComplete,
    mistakes,
    startTime,
    endTime,
    activeKey,
    errorKey,
    nextPhysicalKey,
    nextShift,
    reset,
  } = useNepaliTyping(placeholderText);

  // ============================================================
  // TYPED LETTERS
  // ============================================================

  const typedLetters = useMemo(
    () =>
      [...segmenter.segment(typedUnicode)].map((segment) => segment.segment),
    [typedUnicode, segmenter],
  );

  // ============================================================
  // SHOW RESULT
  // ============================================================

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    setResult("🎉 तपाईंले कार्य पूरा गर्नुभयो।");
    setShowResult(true);
  }, [isComplete]);

  // ============================================================
  // CLOSE RESULT
  // ============================================================

  const handleClose = () => {
    setShowResult(false);

    requestAnimationFrame(() => {
      typingAreaRef.current?.focus();
    });
  };

  // ============================================================
  // NEXT CHALLENGE
  // ============================================================

  const handleNextChallenge = () => {
    const nextSentence = generateRandomSentence(nepaliSentences, difficulty);

    setShowResult(false);
    setResult("");
    setPlaceholderText(nextSentence);

    requestAnimationFrame(() => {
      typingAreaRef.current?.focus();
    });
  };

  // ============================================================
  // RESTART
  // ============================================================

  const handleRestart = () => {
    setShowResult(false);
    setResult("");

    reset();

    requestAnimationFrame(() => {
      typingAreaRef.current?.focus();
    });
  };

  // ============================================================
  // TIME
  // ============================================================

  const elapsedTime =
    startTime !== null && endTime !== null
      ? ((endTime - startTime) / 1000).toFixed(2)
      : null;

  // ============================================================
  // ACCURACY
  // ============================================================

  const accuracy =
    typedCount + mistakes > 0
      ? Math.round((typedCount / (typedCount + mistakes)) * 100)
      : 100;

  // ============================================================
  // WPM
  // ============================================================

  const wpm =
    startTime !== null && endTime !== null
      ? Math.round(typedCount / 5 / ((endTime - startTime) / 60000))
      : 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <article className="flex flex-col gap-8 py-10 text-center">
      {/* Target sentence */}

      <TargetSentence
        targetLetters={targetLetters}
        typedLetters={typedLetters}
        typedCorrectness={typedCorrectness}
      />

      {/* Typed output */}

      <div
        ref={typingAreaRef}
        tabIndex={0}
        role="textbox"
        aria-label="Nepali typing area"
        aria-live="polite"
        className="
          min-h-20
          w-full
          overflow-hidden
          rounded-md
          border
          p-3
          text-center
          text-3xl
          leading-relaxed
          outline-none
        "
      >
        {typedUnicode ? (
          typedUnicode
        ) : (
          <span className="text-[var(--text-muted)] text-lg sm:text-2xl">यहाँ टाइप गर्नुहोस्</span>
        )}
      </div>

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

      {/* Result */}

      {showResult && (
        <ShowResult
          elapsedTime={elapsedTime}
          isCompleted={isComplete}
          wpm={wpm}
          typedLetters={typedLetters}
          accuracy={accuracy}
          result={result}
          handleRestart={handleRestart}
          language="ne"
          handleClose={handleClose}
          handleNextChallenge={handleNextChallenge}
        />
      )}
    </article>
  );
}
