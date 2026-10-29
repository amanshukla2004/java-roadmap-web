import { useEffect, useState } from "react";

const THEME_KEY = "java-roadmap-theme";

export function useDarkMode() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      // Ignore: theme just won't be remembered.
    }
  }, [dark]);

  return [dark, setDark] as const;
}
