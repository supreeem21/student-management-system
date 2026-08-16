import { useAppStore } from "@/store/useAppStore";
import { useEffect, useRef } from "react";

interface ModalProps {
  handleRestart: () => void;
  result: string;
}

const Modal = ({ handleRestart, result }: ModalProps) => {
  const language = useAppStore((state) => state.language);

  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // ==========================================================
  // ACCESSIBILITY
  //
  // - Focus moves into the dialog on open.
  // - Escape confirms/restarts.
  // - Tab is trapped inside the dialog.
  // ==========================================================

  useEffect(() => {
    confirmButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleRestart();
        return;
      }

      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable || focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleRestart]);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        p-3 sm:p-4
        animate-fadeIn
      "
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="typing-result-heading"
        className="
          w-full max-w-lg
          flex flex-col items-center
          gap-4 sm:gap-6
          p-5 sm:p-8
          text-center

          bg-[var(--surface)]
          border border-[var(--border)]
          rounded-lg

          shadow-2xl

          transform
          transition-all
          scale-100
        "
      >
        <h2
          id="typing-result-heading"
          className="
            text-xl sm:text-2xl
            font-bold
            text-[var(--text-muted)]
          "
        >
          {result}
        </h2>

        <div className="flex gap-4">
          <button
            ref={confirmButtonRef}
            onClick={handleRestart}
            className="
              mt-2
              w-full sm:w-auto

              px-5 sm:px-6
              py-2.5 sm:py-3

              bg-background
              hover:bg-foreground

              text-primary
              hover:text-background

              rounded-lg

              transition-colors
              duration-200

              shadow-lg
              shadow-[var(--accent)]/30

              active:scale-95
              hover:cursor-pointer
              outline-2
              outline-foreground
              hover:outline-none
            "
          >
            {language === "english"
              ? "Next Challenge"
              : "अर्को चुनौती प्रयास गर्नुहोस्"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;