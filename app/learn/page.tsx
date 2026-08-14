"use client";

import LearnNepaliComponent from "@/app/components/learn/LearnNepaliComponent";
import LearnEnglishComponent from "@/app/components/learn/LearnEnglishComponent";
import { useAppStore } from "@/store/useAppStore";

const LearnPage = () => {
  const language = useAppStore((state) => state.language);

  const hasHydrated = useAppStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <section className="w-full overflow-hidden px-2 sm:px-4 md:px-6 lg:px-8"></section>
    );
  }

  return (
    <section className="w-full overflow-hidden px-2 sm:px-4 md:px-6 lg:px-8">
      {language === "english" ? (
        <LearnEnglishComponent />
      ) : language === "nepali" ? (
        <LearnNepaliComponent />
      ): ""}
    </section>
  );
};

export default LearnPage;
