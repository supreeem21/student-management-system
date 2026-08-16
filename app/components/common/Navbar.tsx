"use client";

import darkModeLogo from "@/public/logo.png";
import lightModeLogo from "@/public/original_logo.png";
import { Sun, Moon, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Language } from "@/store/slices/languageSlice";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NepaliLanguageType } from "@/store/slices/nepaliLanguageSlice";

export default function Navbar() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const difficulty = useAppStore((state) => state.difficulty);
  const setDifficulty = useAppStore((state) => state.setDifficulty);

  const nepaliLanguageType = useAppStore((state) => state.nepaliLanguageType);

  const setNepaliLanguageType = useAppStore(
    (state) => state.setNepaliLanguageType,
  );

  const [showNav, setShowNav] = useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const page = usePathname();

  const selectedLanguage =
    language === "english" ? "english" : nepaliLanguageType;

  // ==========================================================
  // NAVIGATION ITEM
  // Same width + same height for every item
  // ==========================================================

  const navItem = `
    flex
    h-9
    w-[70px]
    shrink-0
    items-center
    justify-center
    rounded-lg
    text-sm
    font-semibold
    transition-all
    duration-150
  `;

  // ==========================================================
  // DIFFICULTY ITEM
  // Same width + same height for every item
  // ==========================================================

  const difficultyItem = `
    flex
    h-9
    w-[72px]
    shrink-0
    items-center
    justify-center
    rounded-lg
    text-sm
    hover:cursor-pointer
    font-semibold
    transition-all
    duration-150
  `;

  // ==========================================================
  // LANGUAGE CHANGE
  // ==========================================================

  const handleLanguageChange = (value: string) => {
    if (value === "preeti" || value === "unicode") {
      setLanguage("nepali" as Language);

      setNepaliLanguageType(value as NepaliLanguageType);
    } else {
      setLanguage("english" as Language);
    }
  };

  return (
    <nav
      className="
        relative
        z-50
        h-[68px]
        w-full
        border-b
        border-[var(--border)]
        bg-[var(--surface)]
      "
    >
      {/* ======================================================
          DESKTOP
          ====================================================== */}

      <div
        className="
          mx-auto
          hidden
          h-full
          w-full
          max-w-[1500px]
          items-center
          px-6
          lg:flex
          xl:px-8
        "
      >
        {/* ====================================================
            LOGO
            Fixed width
            ==================================================== */}

        <div
          className="
            flex
            h-full
            w-[180px]
            shrink-0
            items-center
          "
        >
          <Link
            href="/"
            aria-label="Darbar Tech home"
            className="
              flex
              h-full
              items-center
              rounded-md
              focus-visible:outline-2
              focus-visible:outline-[var(--accent)]
            "
          >
            {
              theme === "dark" ? <Image
              src={darkModeLogo}
              alt="Darbar Tech logo"
              priority
              className="
                block
                h-auto
                max-h-18
                w-40
                object-contain
              "
            /> : <Image
              src={lightModeLogo}
              alt="Darbar Tech logo"
              priority
              className="
                block
                h-auto
                max-h-18
                w-40
                object-contain
              "
            />
            }
          </Link>
        </div>

        {/* ====================================================
            NAVIGATION
            Test / Learn / Code
            ==================================================== */}

        <div
          className="
            flex
            h-10
            w-[210px]
            shrink-0
            items-center
            gap-1
          "
        >
          {/* Test */}

          {page === "/" ? (
            <span
              aria-current="page"
              className={`
                ${navItem}
                bg-[var(--accent)]
                text-white
              `}
            >
              Test
            </span>
          ) : (
            <Link
              href="/"
              className={`
                ${navItem}
                text-[var(--text-secondary)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--accent)]
              `}
            >
              Test
            </Link>
          )}

          {/* Learn */}

          {page === "/learn" ? (
            <span
              aria-current="page"
              className={`
                ${navItem}
                bg-[var(--accent)]
                text-white
              `}
            >
              Learn
            </span>
          ) : (
            <Link
              href="/learn"
              className={`
                ${navItem}
                text-[var(--text-secondary)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--accent)]
              `}
            >
              Learn
            </Link>
          )}

          {/* Code */}

          {page === "/code" ? (
            <span
              aria-current="page"
              className={`
                ${navItem}
                bg-[var(--accent)]
                text-white
              `}
            >
              Code
            </span>
          ) : (
            <Link
              href="/code"
              className={`
                ${navItem}
                text-[var(--text-secondary)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--accent)]
              `}
            >
              Code
            </Link>
          )}
        </div>

        {/* ====================================================
            SEPARATOR
            ==================================================== */}

        <div
          className="
            mx-5
            h-7
            w-px
            shrink-0
            bg-[var(--border)]
          "
        />

        {/* ====================================================
            DIFFICULTY
            Easy / Medium / Hard
            ==================================================== */}

        <div
          className="
            flex
            h-11
            w-[235px]
            shrink-0
            items-center
            gap-1
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--background)]
            p-1
          "
          role="group"
          aria-label="Difficulty"
        >
          {/* Easy */}

          <button
            type="button"
            aria-pressed={difficulty === "easy"}
            onClick={() => setDifficulty("easy")}
            className={`
              ${difficultyItem}
              ${
                difficulty === "easy"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)]"
              }
            `}
          >
            Easy
          </button>

          {/* Medium */}

          <button
            type="button"
            aria-pressed={difficulty === "medium"}
            onClick={() => setDifficulty("medium")}
            className={`
              ${difficultyItem}
              ${
                difficulty === "medium"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)]"
              }
            `}
          >
            Medium
          </button>

          {/* Hard */}

          <button
            type="button"
            aria-pressed={difficulty === "hard"}
            onClick={() => setDifficulty("hard")}
            className={`
              ${difficultyItem}
              ${
                difficulty === "hard"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)]"
              }
            `}
          >
            Hard
          </button>
        </div>

        {/* ====================================================
            FLEXIBLE SPACE
            ==================================================== */}

        <div className="min-w-0 flex-1" />

        {/* ====================================================
            LANGUAGE
            Fixed 180px
            ==================================================== */}

        <div className="w-[180px] shrink-0">
          {page !== "/code" ? (
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={showLanguageDropdown}
                onClick={() => setShowLanguageDropdown((prev) => !prev)}
                className="
      flex
      h-10
      w-[180px]
      items-center
      justify-between
      rounded-lg
      border
      border-[var(--border)]
      bg-[var(--background)]
      px-3
      text-sm
      font-semibold
      text-[var(--text-primary)]
      outline-none
      transition-all
      duration-150
      hover:border-[var(--accent)]
      focus:border-[var(--accent)]
      hover:cursor-pointer
    "
              >
                <span>
                  {selectedLanguage === "english"
                    ? "English"
                    : selectedLanguage === "preeti"
                      ? "Nepali (Preeti)"
                      : "Nepali (Unicode)"}
                </span>

                <span
                  className={`transition-transform duration-150 ${
                    showLanguageDropdown ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {showLanguageDropdown && (
                <div
                  role="listbox"
                  className="
        absolute
        right-0
        top-12
        z-[100]
        w-[180px]
        overflow-hidden
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-1
        shadow-xl
      "
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedLanguage === "english"}
                    onClick={() => {
                      handleLanguageChange("english");
                      setShowLanguageDropdown(false);
                    }}
                    className={`
          w-full
          rounded-md
          px-3
          py-2
          text-left
          text-sm
          font-semibold
          transition-colors
          hover:cursor-pointer
          ${
            selectedLanguage === "english"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          }
        `}
                  >
                    English
                  </button>

                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedLanguage === "preeti"}
                    onClick={() => {
                      handleLanguageChange("preeti");
                      setShowLanguageDropdown(false);
                    }}
                    className={`
          w-full
          rounded-md
          px-3
          py-2
          text-left
          text-sm
          font-semibold
          transition-colors
          hover:cursor-pointer
          ${
            selectedLanguage === "preeti"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          }
        `}
                  >
                    Nepali (Preeti)
                  </button>

                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedLanguage === "unicode"}
                    onClick={() => {
                      handleLanguageChange("unicode");
                      setShowLanguageDropdown(false);
                    }}
                    className={`
          w-full
          rounded-md
          px-3
          py-2
          text-left
          text-sm
          font-semibold
          transition-colors
          hover:cursor-pointer
          ${
            selectedLanguage === "unicode"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          }
        `}
                  >
                    Nepali (Unicode)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-10 w-[180px]" />
          )}
        </div>

        {/* ====================================================
            THEME
            Fixed 44px
            ==================================================== */}

        <div
          className="
            ml-3
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
          "
        >
          <button
            type="button"
            aria-label={
              theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              border
              border-transparent
              text-[var(--text-primary)]
              transition-all
              duration-150
              hover:border-[var(--border)]
              hover:bg-[var(--surface-hover)]
              hover:text-[var(--accent)]
              active:scale-95
              hover:cursor-pointer
            "
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* ======================================================
          MOBILE NAVBAR
          ====================================================== */}

      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-between
          px-4
          lg:hidden
        "
      >
        {/* Mobile logo */}

        <Link
          href="/"
          aria-label="Darbar Tech home"
          className="
            flex
            h-11
            items-center
          "
        >
          {
            theme === "dark" ? <Image
            src={darkModeLogo}
            alt="Darbar Tech logo"
            width={140}
            height={42}
            priority
            className="
              block
              h-auto
              max-h-18
              object-contain
            "
          /> : <Image
            src={lightModeLogo}
            alt="Darbar Tech logo"
            width={140}
            height={42}
            priority
            className="
              block
              h-auto
              max-h-18
              object-contain
            "
          />

          }
        </Link>

        {/* Mobile controls */}

        <div className="flex items-center gap-1">
          {/* Theme */}

          <button
            type="button"
            aria-label={
              theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-[var(--text-primary)]
              hover:bg-[var(--surface-hover)]
              hover:cursor-pointer
            "
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Menu */}

          <button
            type="button"
            aria-label={showNav ? "Close navigation" : "Open navigation"}
            aria-expanded={showNav}
            onClick={() => setShowNav((prev) => !prev)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-[var(--text-primary)]
              hover:bg-[var(--surface-hover)]
              hover:cursor-pointer
            "
          >
            {showNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* ====================================================
            MOBILE MENU
            ==================================================== */}

        {showNav && (
          <div
            className="
              absolute
              right-4
              top-[62px]
              z-50
              w-[290px]
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-4
              shadow-2xl
            "
          >
            {/* Navigation */}

            <div className="grid grid-cols-3 gap-1">
              {page === "/" ? (
                <span
                  className={`
                    ${navItem}
                    bg-[var(--accent)]
                    text-white
                  `}
                >
                  Test
                </span>
              ) : (
                <Link
                  href="/"
                  onClick={() => setShowNav(false)}
                  className={`
                    ${navItem}
                    text-[var(--text-secondary)]
                    hover:bg-[var(--surface-hover)]
                    hover:text-[var(--accent)]
                  `}
                >
                  Test
                </Link>
              )}

              {page === "/learn" ? (
                <span
                  className={`
                    ${navItem}
                    bg-[var(--accent)]
                    text-white
                  `}
                >
                  Learn
                </span>
              ) : (
                <Link
                  href="/learn"
                  onClick={() => setShowNav(false)}
                  className={`
                    ${navItem}
                    text-[var(--text-secondary)]
                    hover:bg-[var(--surface-hover)]
                    hover:text-[var(--accent)]
                  `}
                >
                  Learn
                </Link>
              )}

              {page === "/code" ? (
                <span
                  className={`
                    ${navItem}
                    bg-[var(--accent)]
                    text-white
                  `}
                >
                  Code
                </span>
              ) : (
                <Link
                  href="/code"
                  onClick={() => setShowNav(false)}
                  className={`
                    ${navItem}
                    text-[var(--text-secondary)]
                    hover:bg-[var(--surface-hover)]
                    hover:text-[var(--accent)]
                  `}
                >
                  Code
                </Link>
              )}
            </div>

            {/* Difficulty */}

            <div
              className="
                mt-5
                border-t
                border-[var(--border)]
                pt-4
              "
            >
              <p
                className="
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-[var(--text-muted)]
                "
              >
                Difficulty
              </p>

              <div className="grid grid-cols-3 gap-1">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={difficulty === level}
                    onClick={() => {
                      setDifficulty(level);
                      setShowNav(false);
                    }}
                    className={`
                      h-10
                      rounded-lg
                      border
                      text-xs
                      font-semibold
                      transition-all
                      hover:cursor-pointer
                      ${
                        difficulty === level
                          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                          : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)]"
                      }
                    `}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}

            {page !== "/code" && (
              <div
                className="
                  mt-5
                  border-t
                  border-[var(--border)]
                  pt-4
                "
              >
                <p
                  className="
                    mb-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[var(--text-muted)]
                  "
                >
                  Language
                </p>

                <div className="relative w-full">
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={showLanguageDropdown}
                    onClick={() => setShowLanguageDropdown((prev) => !prev)}
                    className="
      flex
      h-10
      w-full
      items-center
      justify-between
      rounded-lg
      border
      border-[var(--border)]
      bg-[var(--background)]
      px-3
      text-sm
      font-semibold
      text-[var(--text-primary)]
      outline-none
      transition-all
      duration-150
      hover:border-[var(--accent)]
      focus:border-[var(--accent)]
      hover:cursor-pointer
    "
                  >
                    <span>
                      {selectedLanguage === "english"
                        ? "English"
                        : selectedLanguage === "preeti"
                          ? "Nepali (Preeti)"
                          : "Nepali (Unicode)"}
                    </span>

                    <span
                      className={`transition-transform duration-150 ${
                        showLanguageDropdown ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {showLanguageDropdown && (
                    <div
                      role="listbox"
                      className="
        absolute
        left-0
        right-0
        top-12
        z-[100]
        w-full
        overflow-hidden
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-1
        shadow-xl
      "
                    >
                      {/* English */}
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedLanguage === "english"}
                        onClick={() => {
                          handleLanguageChange("english");
                          setShowLanguageDropdown(false);
                          setShowNav(false);
                        }}
                        className={`
          w-full
          rounded-md
          px-3
          py-2
          text-left
          text-sm
          font-semibold
          transition-colors
          hover:cursor-pointer
          ${
            selectedLanguage === "english"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          }
        `}
                      >
                        English
                      </button>

                      {/* Nepali Preeti */}
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedLanguage === "preeti"}
                        onClick={() => {
                          handleLanguageChange("preeti");
                          setShowLanguageDropdown(false);
                          setShowNav(false);
                        }}
                        className={`
          w-full
          rounded-md
          px-3
          py-2
          text-left
          text-sm
          font-semibold
          transition-colors
          hover:cursor-pointer
          ${
            selectedLanguage === "preeti"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          }
        `}
                      >
                        Nepali (Preeti)
                      </button>

                      {/* Nepali Unicode */}
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedLanguage === "unicode"}
                        onClick={() => {
                          handleLanguageChange("unicode");
                          setShowLanguageDropdown(false);
                          setShowNav(false);
                        }}
                        className={`
          w-full
          rounded-md
          px-3
          py-2
          text-left
          text-sm
          font-semibold
          transition-colors
          hover:cursor-pointer
          ${
            selectedLanguage === "unicode"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          }
        `}
                      >
                        Nepali (Unicode)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
