// components/StoreHydrationProvider.tsx
"use client";

import { useAppStore } from "@/store/useAppStore";
import { ReactNode } from "react";

export function StoreHydrationProvider({ children }: { children: ReactNode }) {
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    // Render your app loading spinner, skeleton, or splash screen here
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading preferences...</p>
      </div>
    );
  }

  return <>{children}</>;
}