interface TargetSentenceProps {
  targetLetters: string[];
  typedLetters: string[];
  typedCorrectness?: boolean[]; // NEW
}

const TargetSentence = ({ targetLetters, typedLetters, typedCorrectness }: TargetSentenceProps) => {
  return (
    <div className="relative text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide wrap-break-word">
      {targetLetters.map((letter, index) => {
        let className = "text-[var(--text-muted)]";

        if (index < typedLetters.length) {
          const isCorrect =
            typedCorrectness !== undefined
              ? typedCorrectness[index] !== false
              : typedLetters[index] === letter;

          className = isCorrect ? "text-[var(--success)]" : "text-[var(--error)]";
        }

        return <span key={index} className={className}>{letter === " " ? "\u00A0" : letter}</span>;
      })}
    </div>
  );
};

export default TargetSentence