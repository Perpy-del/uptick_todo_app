import { ChangeEvent, useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const WelcomeMessageComponent = () => {
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  // useRef for input
  const inputRef = useRef<HTMLInputElement>(null);

  // handle input name change
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }

  // focus on the user name on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // get user name from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem("userName") || "";
    user ? setUserName(user) : "";
  }, []);

  // if there is no user name, set a new one on mount
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  // get the time of day for the welcome message on mount
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      setTimeOfDay("morning");
    } else if (hour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, [timeOfDay]);

  return (
    <div className="text-darkText font-bold sm:text-xl md:text-2xl flex justify-between items-center pb-6">
      <h3>
        Good {timeOfDay},{" "}
        <input
          ref={inputRef}
          type="text"
          value={userName}
          className="welcome"
          placeholder="Name Here"
          onChange={handleNameChange}
        />
      </h3>
      <ThemeToggle />
    </div>
  );
};

export default WelcomeMessageComponent;
