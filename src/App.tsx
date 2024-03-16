import ThemeToggle from "./components/ThemeToggle";

import { ChangeEvent, useEffect, useState, useRef } from "react";
import { format } from "date-fns"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function App() {
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [date, setDate] = useState<Date>()
  const inputRef = useRef<HTMLInputElement>(null);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    console.log(now.toString());
    const hour = now.getHours();

    if (hour < 12) {
      setTimeOfDay("morning");
    } else if (hour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, [timeOfDay]);

  useEffect(() => {
    const user = localStorage.getItem("userName") || "";
    user ? setUserName(user) : "";
  }, []);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  return (
    <div className="h-full dark:bg-background bg-[#EEE] py-5 px-5 font-Nunito">
      {/* Welcome Message */}
      <div className="text-darkText font-bold text-2xl flex justify-between items-center pb-6">
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

      {/* Add New Task */}
      <form>
        <h3 className="font-bold pb-3 text-[#888]">What do you have planned?</h3>
        <div className="flex sm:flex-col md:flex-row gap-10">
          <label className="text-xl sm:w-full md:w-[70%]">
            <h3 className="pb-2">Title:</h3>
            <input
              type="text"
              placeholder="e.g. Submit TODO Task"
              className="block title shadow-xl dark:shadow-none"
            />
          </label>
          <label className="text-xl w-full">
            <h3 className="pb-2">Description:</h3>
            <input
              type="text"
              placeholder="e.g.Description of TOFO task"
              className="block description shadow-xl dark:shadow-none"
            />
          </label>
          <label className="text-xl w-full">
            <h3 className="pb-2">Date:</h3>
            <input
              type="text"
              placeholder="e.g.Description of TOFO task"
              className="block description"
            />
          </label>
        </div>
      </form>
    </div>
  );
}

export default App;
