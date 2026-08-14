import { useState } from "react";

interface Props {
  code: string,
  resetKey: number;
}

// parent
export default function RandomCode({ code, resetKey }: Props) {
  return (
    <>
      <pre className="background-border w-full overflow-x-auto rounded-md p-2 sm:p-3 md:p-5 text-xs sm:text-sm md:text-base whitespace-pre-wrap wrap-break-word">
        <code>{code}</code>
      </pre>

      <UserInputCode key={resetKey} />
    </>
  );
}

// childrens

export function UserInputCode() {
  const [input, setInput] = useState("");

  return (
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      rows={10}
      className="
        background-border
        w-full
        min-h-40
        sm:min-h-50
        md:min-h-62.5
        p-2
        sm:p-3
        md:p-5
        text-xs
        sm:text-sm
        md:text-base
        tracking-normal
        sm:tracking-widest
        outline-none
        resize-y
        rounded-md
      "
      placeholder="Type here..."
    />
  );
}
