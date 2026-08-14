"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function ThemeUpdater() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
