"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button 
      onClick={toggle}
      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} className="text-yellow-400" />}
    </button>
  );
}