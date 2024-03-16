import ThemeToggle from "./components/ThemeToggle";

import { ChangeEvent, useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function App() {
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [date, setDate] = useState<Date>();
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
        <h3 className="font-bold pb-3 text-[#888]">
          What do you have planned?
        </h3>
        <div className="flex sm:flex-col md:flex-row gap-10">
          <label className="text-xl sm:w-full md:w-[70%]">
            <h3 className="pb-2">Title:</h3>
            <input
              type="text"
              placeholder="e.g. Submit TODO Task"
              className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground description shadow-xl dark:shadow-none"
            />
          </label>
          <label className="text-xl w-full">
            <h3 className="pb-2">Description:</h3>
            <input
              type="text"
              placeholder="e.g.Description of TOFO task"
              className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground description shadow-xl dark:shadow-none"
            />
          </label>
          <label className="text-xl">
            <h3 className="pb-2">Date:</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal text-xl h-[3.75rem]",
                  !date && "text-muted-foreground",
                )}
              >
                <FaCalendarAlt className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          </label>
        </div>
      </form>
    </div>
  );
}

export default App;
