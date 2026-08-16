"use client";

import { memo } from "react";
import KeyboardKey from "./PreetiKeyboardKey";
import { keyboardLayout, KeyDef } from "./PreetiKeyboardLayout";
import Image from "next/image";
import { fingerMap } from "@/app/lib/fingermap";

import fullLeftHand from "@/public/hands/left/fullLeftHand.png";
import fullRightHand from "@/public/hands/right/fullRightHand.png";

import leftThumb from "@/public/hands/left/leftThumb.png";
import leftIndex from "@/public/hands/left/leftIndex.png";
import leftMiddle from "@/public/hands/left/leftMiddle.png";
import leftRing from "@/public/hands/left/leftRing.png";
import leftPinky from "@/public/hands/left/leftPinky.png";

import rightThumb from "@/public/hands/right/rightThumb.png";
import rightIndex from "@/public/hands/right/rightIndex.png";
import rightMiddle from "@/public/hands/right/rightMiddle.png";
import rightRing from "@/public/hands/right/rightRing.png";
import rightPinky from "@/public/hands/right/rightPinky.png";

import { useAppStore } from "@/store/useAppStore";

import { usePathname } from "next/navigation";

interface Props {
  /** Physical key currently held down, e.g. "A", "1", "Space". */
  activeKey?: string;
  /** Physical key the learner needs to press next (from the typing engine). */
  nextPhysicalKey?: string;
  /** Whether Shift must be held for `nextPhysicalKey`. */
  nextShift?: boolean;
  /** Physical key that was just pressed incorrectly. */
  errorKey?: string;
}

const widthMap: Record<string, string> = {
  Esc: "w-14",
  Backspace: "w-28",
  Tab: "w-20",
  Caps: "w-24",
  Enter: "w-28",
  Shift: "w-32",
  Ctrl: "w-16",
  Fn: "w-16",
  Win: "w-16",
  Alt: "w-16",
  AltGr: "w-16",
  Menu: "w-16",
  Space: "w-[340px]",
};

// Highlighting is driven directly by the typing engine's Roman key
// sequence (see `useNepaliTyping`), which already knows exactly which
// physical key — and whether Shift — comes next. No fuzzy character
// matching against the layout table is needed, which is what caused
// highlighting to only work reliably for the first key.
const Keyboard = memo(function Keyboard({
  activeKey = "",
  nextPhysicalKey = "",
  nextShift = false,
  errorKey = "",
}: Props) {
  const page = usePathname();

  const upperActiveKey = activeKey.toUpperCase();
  const upperNextKey = nextPhysicalKey.toUpperCase();
  const upperErrorKey = errorKey.toUpperCase();

  const fingerToType = fingerMap[upperNextKey];

  const isSpace = upperNextKey === " ";
  const isPeriod = upperNextKey === ".";

  const language = useAppStore((state) => state.language);

  const isCapitalLetter =
    language === "english" &&
    nextPhysicalKey.length === 1 &&
    /^[A-Z]$/.test(nextPhysicalKey);

  if (isCapitalLetter) {
    nextShift = true;
  }

  const renderRow = (
    row: (KeyDef | string)[],
    defaultWidth = "w-14",
    defaultHeight = "h-12",
  ) => {
    return (
      <div className="flex gap-2">
        {row.map((keyDef, index) => {
          const label = typeof keyDef === "string" ? keyDef : keyDef.label;
          const upperLabel = label.toUpperCase();

          const isNext =
            upperLabel === upperNextKey ||
            (label === "Shift" && nextShift && upperNextKey !== "");

          return (
            <KeyboardKey
              key={`${label}-${index}`}
              keyDef={keyDef}
              width={widthMap[label] ?? defaultWidth}
              height={defaultHeight}
              active={upperActiveKey !== "" && upperActiveKey === upperLabel}
              next={isNext}
              error={upperErrorKey !== "" && upperErrorKey === upperLabel}
            />
          );
        })}
      </div>
    );
  };

  const imagePositionClassName =
    "absolute opacity-50 pointer-events-none z-50 -bottom-49";
  const leftHandFingersPosition = "left-25";
  const rightHandFingersPosition = "left-105";

  return (
    <div className="rounded-xl border border-foreground p-5 w-fit mx-auto space-y-3 relative overflow-y-hidden">
      {page === "/" ? (
        ""
      ) : (
        <>
          {/* full left hand */}
          <Image
            src={fullLeftHand}
            alt="Left hand position guide"
            loading="eager"
            className={`${imagePositionClassName} ${leftHandFingersPosition} `}
          />

          {/* left Pinky finger */}
          {(fingerToType === "leftPinky" || isCapitalLetter) && (
            <Image
              src={leftPinky}
              alt="Left hand pinky finger guide"
              className={`${imagePositionClassName} ${leftHandFingersPosition} `}
            />
          )}

          {fingerToType === "leftRing" && (
            <Image
              src={leftRing}
              alt="Left hand ring finger"
              className={`${imagePositionClassName} ${leftHandFingersPosition} `}
            />
          )}

          {fingerToType === "leftMiddle" && (
            <Image
              src={leftMiddle}
              alt="Left hand middle finger guide"
              className={`${imagePositionClassName} ${leftHandFingersPosition} `}
            />
          )}

          {fingerToType === "leftIndex" && (
            <Image
              src={leftIndex}
              alt="Left hand index finger guide"
              className={`${imagePositionClassName} ${leftHandFingersPosition} `}
            />
          )}

          {(fingerToType === "leftThumb" || isSpace) && (
            <Image
              src={leftThumb}
              alt="Left hand thumb finger guide"
              className={`${imagePositionClassName} ${leftHandFingersPosition} `}
            />
          )}

          {/* right hand */}
          <Image
            src={fullRightHand}
            alt="Right hand position guide"
            className={`${imagePositionClassName} ${rightHandFingersPosition}`}
          />

          {(fingerToType === "rightPinky" || isCapitalLetter) && (
            <Image
              src={rightPinky}
              alt="Right hand pinky finger guide"
              className={`${imagePositionClassName} ${rightHandFingersPosition} `}
            />
          )}

          {(fingerToType === "rightRing" || isPeriod) && (
            <Image
              src={rightRing}
              alt="Right hand ring finger guide"
              className={`${imagePositionClassName} ${rightHandFingersPosition} `}
            />
          )}

          {fingerToType === "rightMiddle" && (
            <Image
              src={rightMiddle}
              alt="Right hand middle finger guide"
              className={`${imagePositionClassName} ${rightHandFingersPosition} `}
            />
          )}

          {fingerToType === "rightIndex" && (
            <Image
              src={rightIndex}
              alt="Right hand index finger guide"
              className={`${imagePositionClassName} ${rightHandFingersPosition} `}
            />
          )}

          {(fingerToType === "rightThumb" || isSpace) && (
            <Image
              src={rightThumb}
              alt="Right hand thumb finger guide"
              className={`${imagePositionClassName} ${rightHandFingersPosition} `}
            />
          )}
        </>
      )}

      {/* Function Row */}
      <div className="flex gap-2">
        {renderRow(keyboardLayout.function, "w-12", "h-12")}
      </div>

      {/* Main Keyboard Rows */}
      <div className="space-y-2">
        {renderRow(keyboardLayout.row1)}
        {renderRow(keyboardLayout.row2)}
        {renderRow(keyboardLayout.row3)}
        {renderRow(keyboardLayout.row4)}
        {renderRow(keyboardLayout.row5)}
      </div>
    </div>
  );
});

export default Keyboard;
