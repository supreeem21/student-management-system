"use client";

import NepaliComponent from "@/app/components/language/Nepali";
import EnglishComponent from "@/app/components/language/English";

import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const language = useAppStore((state) => state.language);

  const hasHydrated = useAppStore((state) => state.hasHydrated);

  return (
    <div className="
      flex
      flex-col
      gap-5
      w-full
      overflow-hidden
      px-2
      sm:px-4
      md:px-6
      lg:px-8
    ">

      {/* english, nepali and code component for typing tests */}
      <section className="w-full">
        <article className="w-full">

          {!hasHydrated ? (
            <div className="h-40" aria-hidden="true" />
          ) : language === "english" ? (
            <EnglishComponent />
          ) : (
            <NepaliComponent />
          )}

        </article>
      </section>

    </div>
  );
}