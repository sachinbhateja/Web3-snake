import React, { useState, useEffect } from "react";
import Game from "./components/Game";

const App: React.FC = () => {
  /* =========================
     BASE MINI APP READY
     ========================= */
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@farcaster/miniapp-sdk")
        .then(({ sdk }) => {
          sdk.actions.ready();
        })
        .catch((err) => {
          console.error("MiniApp SDK load failed:", err);
        });
    }
  }, []);

  /* =========================
     THEME LOGIC
     ========================= */
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="min-h-screen font-mono text-gray-800 dark:text-gray-200 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-black transition-colors duration-500 flex items-center justify-center p-4">
      <Game theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};

export default App;
