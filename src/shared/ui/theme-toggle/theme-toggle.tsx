"use client";

import { MonitorIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "../button";

const THEME_OPTIONS = [
  { value: "light", label: "Светлая", icon: <Sun /> },
  { value: "dark", label: "Тёмная", icon: <Moon /> },
  { value: "system", label: "Автоматическая", icon: <MonitorIcon /> },
] as const;

type ThemeToggleProps = {
  variant?: "default" | "expanded";
  className?: string;
};

export function ThemeToggle({
  variant = "default",
  className,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    if (variant === "expanded") {
      return (
        <div className={cn("grid grid-cols-3 gap-2", className)}>
          {THEME_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              size="sm"
              disabled
              aria-hidden
              className="pointer-events-none"
            >
              {option.icon}
            </Button>
          ))}
        </div>
      );
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-hidden
        className={cn("pointer-events-none", className)}
      />
    );
  }

  if (variant === "expanded") {
    const currentTheme = theme ?? "system";

    return (
      <div
        className={cn("grid grid-cols-3 gap-2", className)}
        role="group"
        aria-label="Тема"
      >
        {THEME_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={currentTheme === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme(option.value)}
          >
            {option.icon}
          </Button>
        ))}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      className={className}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
