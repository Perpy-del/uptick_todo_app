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
import { createTodoCollection } from "./lib/db";
// import { v4 as uuid } from "uuid";

function App() {
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [completed, setCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }
  function handleDescChange(e: ChangeEvent<HTMLInputElement>) {
    setDesc(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ title, desc, date });
    const dbPromise = indexedDB.open("todoDatabase", 2);

    if (title && desc && date) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        const transaction = db.transaction('todoList', 'readwrite');

        const todoList = transaction.objectStore('todoList');

        const todos = todoList.put({
          id: 1,
          title,
          description: desc,
          date,
          completed
        })

        todos.onsuccess = () => {
          transaction.oncomplete = () => {
            db.close();
          };

          alert('Task added successfully!')
        };

        todos.onerror = (e) => {
          console.log(e);
          alert('Error adding task!')
        };
      }
    }
  }

  useEffect(() => {
    createTodoCollection();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      <form onSubmit={handleSubmit}>
        <h3 className="font-bold pb-3 text-[#888]">
          What do you have planned?
        </h3>
        <div className="flex sm:flex-col md:flex-row gap-10 pb-10">
          <label className="text-xl sm:w-full md:w-[70%]">
            <h3 className="pb-2">Title:</h3>
            <input
              type="text"
              placeholder="e.g. Submit TODO Task"
              value={title}
              className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground description shadow-xl dark:shadow-none"
              onChange={handleTitleChange}
            />
          </label>
          <label className="text-xl w-full">
            <h3 className="pb-2">Description:</h3>
            <input
              type="text"
              placeholder="e.g.Description of TOFO task"
              value={desc}
              className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground description shadow-xl dark:shadow-none"
              onChange={handleDescChange}
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
        <Button
          type="submit"
          className="w-full h-[3.75rem] text-xl bg-[#da213f] shadow-xl dark:shadow-none dark:text-accent-foreground hover:bg-[#f0556e] transition duration-200 ease-in-out"
        >
          Add Task
        </Button>
      </form>

      {/* Display the TODOS */}
      <div>
        {/* Tab for displaying All tasks, Completed Tasks, Pending Tasks */}
        <div>
            <label>
              <input type="checkbox" checked={completed} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setCompleted(e.target.checked)} />
            </label>


        </div>
      </div>
    </div>
  );
}

export default App;
