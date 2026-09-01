"use client";

import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Add global providers here like QueryClientProvider, ThemeProvider, etc.
  return <>{children}</>;
}
