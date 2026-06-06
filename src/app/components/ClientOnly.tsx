"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-gray-100 rounded-2xl p-6 mb-8 animate-pulse h-32" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="h-8 bg-gray-100 rounded mb-4 animate-pulse" />
          <div className="h-12 bg-gray-100 rounded mb-4 animate-pulse" />
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
