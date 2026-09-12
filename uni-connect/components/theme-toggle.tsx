"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem("uniconnect-theme", nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Alternar tema claro ou escuro"
      title="Alternar tema"
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}