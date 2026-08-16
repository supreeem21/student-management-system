import { RotateCcw, X, ArrowRight } from "lucide-react";

interface ShowResultProps {
  elapsedTime: string | null;
  isCompleted: boolean;
  wpm: number;
  typedLetters: string[];
  accuracy: number;
  result: string;
  handleNextChallenge: () => void;
  handleRestart: () => void;
  handleClose: () => void;
  language: string;
}

const ShowResult = ({
  elapsedTime,
  isCompleted,
  wpm,
  typedLetters,
  accuracy,
  result,
  handleNextChallenge,
  handleRestart,
  handleClose,
  language,
}: ShowResultProps) => {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

  const toNepaliNumber = (value: string | number) => {
    return value
      .toString()
      .replace(/\d/g, (digit) => nepaliDigits[Number(digit)]);
  };

  const formatElapsedTime = (elapsedTime: string | null, language: string) => {
    if (elapsedTime === null) return "--";

    const totalSeconds = Number(elapsedTime);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);

    if (language === "ne") {
      if (minutes > 0) {
        return `${toNepaliNumber(minutes)} मिनेट ${toNepaliNumber(
          seconds,
        )} सेकेन्ड`;
      }

      return `${toNepaliNumber(seconds)} सेकेन्ड`;
    }

    if (minutes > 0) {
      return `${minutes} min ${seconds} sec`;
    }

    return `${seconds}s`;
  };

  const displayScores = {
    elapsedTime: formatElapsedTime(elapsedTime, language),

    wpm: !isCompleted ? "--" : language === "ne" ? toNepaliNumber(wpm) : wpm,

    accuracy:
      typedLetters.length === 0
        ? "--"
        : language === "ne"
          ? `${toNepaliNumber(accuracy)}%`
          : `${accuracy}%`,
  };

  const your_scores =
    language === "en"
      ? {
          title: "Typing Completed!",
          time: "Time",
          wpm: "WPM",
          accuracy: "Accuracy",
          nextChallengeBtn: "Next challenge",
          restartBtn: "Restart"
        }
      : {
          title: "टाइपिङ पूरा भयो!",
          time: "समय",
          wpm: "प्रति मिनेट शब्द",
          accuracy: "शुद्धता",
          nextChallengeBtn: "अर्को चुनौती",
          restartBtn : "पुनःसुरु गर्नुहोस्"
        };

  if (!isCompleted) return null;

  const btnClassName =
    "flex items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] px-6 py-3 text-base font-medium transition-colors hover:bg-foreground hover:text-background cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-background p-6 shadow-xl sm:p-8">
        {/* Close button */}
        <button
          type="button"
          onClick={() => handleClose()}
          aria-label="Close result"
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            transition-colors
            hover:bg-foreground
            hover:text-background
            cursor-pointer
          "
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-8 text-center text-2xl font-bold">
          {your_scores.title}
        </h2>

        <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-3">
          <div className="text-center rounded-lg bg-background/30 p-4">
            <p className="text-sm text-[var(--text-muted)]">{your_scores.time}</p>

            <p className="mt-2 text-xl font-bold wrap-break-word">
              {displayScores.elapsedTime}
            </p>
          </div>

          <div className="text-center rounded-lg bg-background/30 p-4">
            <p className="text-sm text-[var(--text-muted)]">{your_scores.wpm}</p>

            <p className="mt-2 text-xl font-bold wrap-break-word">
              {displayScores.wpm}
            </p>
          </div>

          <div className="text-center rounded-lg bg-background/30 p-4">
            <p className="text-sm text-[var(--text-muted)]">{your_scores.accuracy}</p>

            <p className="mt-2 text-xl font-bold wrap-break-word">
              {displayScores.accuracy}
            </p>
          </div>
        </div>

        <p className="mb-6 text-center text-base font-medium">{result}</p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={handleNextChallenge}
            className={btnClassName}
          >
            <ArrowRight/>
            <span>{your_scores.nextChallengeBtn}</span>
          </button>
          <button onClick={handleRestart} className={btnClassName}>
            <RotateCcw className="h-5 w-5" />
            <span>{your_scores.restartBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowResult;
