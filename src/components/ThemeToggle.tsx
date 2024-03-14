import { useState, useEffect } from "react";
import { RiMoonClearLine } from "react-icons/ri";
import { BsSunFill } from "react-icons/bs";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (
      theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    )
      setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? (
        <div className="flex gap-2 ">
          <RiMoonClearLine className="text-darkSecondary" size={18} />{" "}
          <h4 className="font-semibold text-sm">Dark Mode</h4>
        </div>
      ) : (
        <div className="flex gap-2 ">
          <BsSunFill className="text-darkSecondary" size={18} />{" "}
          <h4 className="font-semibold text-sm">Light Mode</h4>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
