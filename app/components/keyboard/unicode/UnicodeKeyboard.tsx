"use client";

import { memo } from "react";
import UnicodeKeyboardKey from "./UnicodeKeyboardKey";
import { keyboardLayout, type KeyDef } from "./UnicodeKeyboardLayout";

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

import { usePathname } from "next/navigation";

// ============================================================
// TYPES
// ============================================================

interface Props {
  /**
   * Physical key currently held down.
   *
   * Examples:
   *
   * "a"
   * "1"
   * "Space"
   */
  activeKey?: string;

  /**
   * Physical key the learner needs to press next.
   */
  nextPhysicalKey?: string;

  /**
   * Whether Shift must be held for nextPhysicalKey.
   */
  nextShift?: boolean;

  /**
   * Physical key that was just pressed incorrectly.
   */
  errorKey?: string;
}

// ============================================================
// KEY WIDTHS
// ============================================================

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

// ============================================================
// KEYBOARD
// ============================================================

const UnicodeKeyboard = memo(function UnicodeKeyboard({
  activeKey = "",
  nextPhysicalKey = "",
  nextShift = false,
  errorKey = "",
}: Props) {
  // ==========================================================
  // CURRENT PAGE
  // ==========================================================

  const page = usePathname();

  // ==========================================================
  // NORMALIZE PHYSICAL KEYS
  // ==========================================================

  const upperActiveKey = activeKey.toUpperCase();

  const upperNextKey = nextPhysicalKey.toUpperCase();

  const upperErrorKey = errorKey.toUpperCase();

  // ==========================================================
  // FINGER GUIDE
  // ==========================================================

  const fingerToType = fingerMap[upperNextKey];

  // ==========================================================
  // SPECIAL KEY DETECTION
  // ==========================================================

  const isSpace = upperNextKey === " ";

  const isPeriod = upperNextKey === ".";

  // ==========================================================
  // RENDER ROW
  // ==========================================================

  const renderRow = (
    row: (KeyDef | string)[],
    defaultWidth = "w-14",
    defaultHeight = "h-12",
  ) => {
    return (
      <div className="flex gap-2">
        {row.map((keyDef, index) => {
          // --------------------------------------------------
          // GET PHYSICAL KEY LABEL
          // --------------------------------------------------

          const label = typeof keyDef === "string" ? keyDef : keyDef.label;

          const upperLabel = label.toUpperCase();

          // --------------------------------------------------
          // NEXT KEY
          // --------------------------------------------------

          const isNext =
            upperLabel === upperNextKey ||
            (label === "Shift" && nextShift && upperNextKey !== "");

          // --------------------------------------------------
          // ACTIVE KEY
          // --------------------------------------------------

          const isActive =
            upperActiveKey !== "" && upperActiveKey === upperLabel;

          // --------------------------------------------------
          // ERROR KEY
          // --------------------------------------------------

          const isError = upperErrorKey !== "" && upperErrorKey === upperLabel;

          // --------------------------------------------------
          // KEY
          // --------------------------------------------------

          return (
            <UnicodeKeyboardKey
              key={`${label}-${index}`}
              keyDef={keyDef}
              width={widthMap[label] ?? defaultWidth}
              height={defaultHeight}
              active={isActive}
              next={isNext}
              nextShift={nextShift}
              error={isError}
            />
          );
        })}
      </div>
    );
  };

  // ==========================================================
  // HAND POSITIONING
  // ==========================================================

  const imagePositionClassName =
    "absolute opacity-50 pointer-events-none z-50 -bottom-49";

  const leftHandFingersPosition = "left-25";

  const rightHandFingersPosition = "left-105";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        rounded-xl
        border 
        border-foreground
        p-5
        w-fit
        mx-auto
        space-y-3
        relative
        overflow-y-hidden
      "
    >
      {/* ======================================================
          HAND GUIDES
          ====================================================== */}

      {page !== "/" && (
        <>
          {/* ==================================================
              FULL LEFT HAND
              ================================================== */}

          <Image
            src={fullLeftHand}
            alt="Left hand position guide"
            loading="eager"
            className={`
              ${imagePositionClassName}
              ${leftHandFingersPosition}
            `}
          />

          {/* ==================================================
              LEFT PINKY
              ================================================== */}

          {(fingerToType === "leftPinky" || nextShift) && (
            <Image
              src={leftPinky}
              alt="Left hand pinky finger guide"
              className={`
                ${imagePositionClassName}
                ${leftHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              LEFT RING
              ================================================== */}

          {fingerToType === "leftRing" && (
            <Image
              src={leftRing}
              alt="Left hand ring finger"
              className={`
                ${imagePositionClassName}
                ${leftHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              LEFT MIDDLE
              ================================================== */}

          {fingerToType === "leftMiddle" && (
            <Image
              src={leftMiddle}
              alt="Left hand middle finger guide"
              className={`
                ${imagePositionClassName}
                ${leftHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              LEFT INDEX
              ================================================== */}

          {fingerToType === "leftIndex" && (
            <Image
              src={leftIndex}
              alt="Left hand index finger guide"
              className={`
                ${imagePositionClassName}
                ${leftHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              LEFT THUMB
              ================================================== */}

          {(fingerToType === "leftThumb" || isSpace) && (
            <Image
              src={leftThumb}
              alt="Left hand thumb finger guide"
              className={`
                ${imagePositionClassName}
                ${leftHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              FULL RIGHT HAND
              ================================================== */}

          <Image
            src={fullRightHand}
            alt="Right hand position guide"
            className={`
              ${imagePositionClassName}
              ${rightHandFingersPosition}
            `}
          />

          {/* ==================================================
              RIGHT PINKY
              ================================================== */}

          {(fingerToType === "rightPinky" || nextShift) && (
            <Image
              src={rightPinky}
              alt="Right hand pinky finger guide"
              className={`
                ${imagePositionClassName}
                ${rightHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              RIGHT RING
              ================================================== */}

          {(fingerToType === "rightRing" || isPeriod) && (
            <Image
              src={rightRing}
              alt="Right hand ring finger"
              className={`
                ${imagePositionClassName}
                ${rightHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              RIGHT MIDDLE
              ================================================== */}

          {fingerToType === "rightMiddle" && (
            <Image
              src={rightMiddle}
              alt="Right hand middle finger guide"
              className={`
                ${imagePositionClassName}
                ${rightHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              RIGHT INDEX
              ================================================== */}

          {fingerToType === "rightIndex" && (
            <Image
              src={rightIndex}
              alt="Right hand index finger guide"
              className={`
                ${imagePositionClassName}
                ${rightHandFingersPosition}
              `}
            />
          )}

          {/* ==================================================
              RIGHT THUMB
              ================================================== */}

          {(fingerToType === "rightThumb" || isSpace) && (
            <Image
              src={rightThumb}
              alt="Right hand thumb finger guide"
              className={`
                ${imagePositionClassName}
                ${rightHandFingersPosition}
              `}
            />
          )}
        </>
      )}

      {/* ======================================================
          FUNCTION ROW
          ====================================================== */}

      <div className="flex gap-2">
        {renderRow(keyboardLayout.function, "w-12", "h-12")}
      </div>

      {/* ======================================================
          MAIN KEYBOARD
          ====================================================== */}

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

export default UnicodeKeyboard;
