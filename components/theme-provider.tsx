"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { theme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const brand = resolvedTheme === "dark" ? theme.darkBrand : theme.brand;
    document.documentElement.style.setProperty("--brand", brand);
  }, [resolvedTheme]);

  return <>{children}</>;
}

