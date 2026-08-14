interface TargetSentenceProps {
  targetLetters: string[];
  typedLetters: string[];
}

const TargetSentence = ({
  targetLetters,
  typedLetters,
}: TargetSentenceProps) => {
  return (
    <div
      className="relative text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide wrap-break-word"
    >
      {targetLetters.map((letter, index) => {
        let className = "text-gray-400";

        if (index < typedLetters.length) {
          // Missed space after a correctly typed previous character
          if (
            letter === " " &&
            targetLetters[index - 1] === typedLetters[index - 1] &&
            typedLetters[index] !== " "
          ) {
            className = "bg-red-600 text-black rounded-sm";
          }
          // Correct character
          else if (typedLetters[index] === letter) {
            className = "text-green-600";
          }
          // Incorrect character
          else {
            className = "text-red-600";
          }
        }

        return (
          <span
            key={index}
            className={className}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        );
      })}
    </div>
  );
};

export default TargetSentence;