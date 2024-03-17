/* eslint-disable @typescript-eslint/no-explicit-any */
import ThemeToggle from "./components/ThemeToggle";

import { ChangeEvent, useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createTodoCollection } from "./lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuid } from "uuid";

interface TodoInterface {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
}

function App() {
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [completed, setCompleted] = useState<boolean>(false);
  const [allTodosData, setAllTodosData] = useState<Array<TodoInterface>>([]);
  const [completedTodos, setCompletedTodos] = useState<Array<TodoInterface>>(
    [],
  );
  const [pendingTodos, setPendingTodos] = useState<Array<TodoInterface>>([]);
  const [selectedTodo, setSelectedTodo] = useState({});

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

  function getAllTodos() {
    const dbPromise = indexedDB.open("todoDatabase", 2);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      const transaction = db.transaction("todoList", "readonly");

      const todoList = transaction.objectStore("todoList");

      const todos = todoList.getAll();

      todos.onsuccess = (query) => {
        setAllTodosData(query?.target?.result);
      };

      todos.onerror = () => {
        alert("Error occured while loading initial data");
      };

      transaction.oncomplete = () => {
        db.close();
        setTitle("");
        setDesc("");
        setDate(undefined);
        setCompleted(false);
      };
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ title, desc, date });
    const dbPromise = indexedDB.open("todoDatabase", 2);

    if (title && desc && date) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        const transaction = db.transaction("todoList", "readwrite");

        const todoList = transaction.objectStore("todoList");

        const todos = todoList.put({
          id: uuid(),
          title,
          description: desc,
          date,
          completed,
        });

        todos.onsuccess = () => {
          transaction.oncomplete = () => {
            db.close();
          };
          getAllTodos();
          alert("Task added successfully!");
        };

        todos.onerror = (e) => {
          console.log(e);
          alert("Error adding task!");
        };
      };
    }
  }

  function handleCheckedTodos(
    e: React.ChangeEvent<HTMLInputElement>,
    t: TodoInterface,
  ) {
    const updatedTodos = allTodosData.map((todo) =>
      todo.id === t.id ? { ...todo, completed: e.target.checked } : todo,
    );
    const completed = updatedTodos.filter((todo) => todo.completed);
    const pending = updatedTodos.filter((todo) => !todo.completed);
    setAllTodosData(updatedTodos);
    setCompletedTodos(completed);
    setPendingTodos(pending);
  }

  function handleEditTodo(t: TodoInterface) {
    setSelectedTodo(t);
    setTitle(t.title);
    setDesc(t.description);
    setDate(t.date);
  }

  useEffect(() => {
    createTodoCollection();
  }, []);

  useEffect(() => {
    getAllTodos();
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
              className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground dark:text-white description shadow-xl dark:shadow-none"
              onChange={handleTitleChange}
            />
          </label>
          <label className="text-xl w-full">
            <h3 className="pb-2">Description:</h3>
            <input
              type="text"
              placeholder="e.g.Description of TOFO task"
              value={desc}
              className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground dark:text-white description shadow-xl dark:shadow-none"
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
                    "sm:w-full md:w-[240px] justify-start text-left font-normal text-xl h-[3.75rem]",
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
          className="w-full h-[3.75rem] text-xl bg-[#da213f] shadow-xl dark:shadow-none dark:text-accent-foreground hover:bg-[#f0556e] transition duration-200 ease-in-out mb-9"
        >
          Add Task
        </Button>
      </form>

      {/* Display the TODOS */}
      <div>
        {/* Tab for displaying All tasks, Completed Tasks, Pending Tasks */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-7 gap-3 align-start grid-flow-col my-5 font-semibold text-lg">
            <h3>Done</h3>
            <h3>Title</h3>
            <h3 className="col-span-3">Description</h3>
            <h3>Date</h3>
            <h3>Update</h3>
          </div>
          <TabsContent value="all">
            {allTodosData && allTodosData.length > 0 ? (
              allTodosData.map((t: TodoInterface) => {
                return (
                  <div
                    key={t?.id}
                    className="grid grid-cols-7 gap-3 items-center justify-items-start grid-flow-col "
                  >
                    <label className="col-span-1">
                      <input
                        type="checkbox"
                        checked={t?.completed}
                        onChange={(e) => handleCheckedTodos(e, t)}
                      />
                    </label>
                    <h3
                      className={`col-span-1 ${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.title}
                    </h3>
                    <h3
                      className={`col-span-3 ${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.description}
                    </h3>
                    <h3
                      className={`${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.date?.toLocaleString().split(",")[0]}
                    </h3>
                    <div className="flex items-center">
                      <Button className="min-w-fit bg-transparent text-green-500 font-bold">
                        <CiEdit size={30} />
                      </Button>
                      <Button className="min-w-fit bg-transparent text-red-500 font-bold">
                        <MdDeleteForever size={25} />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No Todos Created Yet</p>
            )}
          </TabsContent>
          <TabsContent value="pending">
            {pendingTodos && pendingTodos.length > 0 ? (
              pendingTodos.map((t: TodoInterface) => {
                return (
                  <div
                    key={t?.id}
                    className="grid grid-cols-7 gap-3 items-center justify-items-start grid-flow-col "
                  >
                    <label className="col-span-1">
                      <input
                        type="checkbox"
                        checked={t?.completed}
                        onChange={(e) => handleCheckedTodos(e, t)}
                      />
                    </label>
                    <h3
                      className={`col-span-1 ${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.title}
                    </h3>
                    <h3
                      className={`col-span-3 ${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.description}
                    </h3>
                    <h3
                      className={`${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.date?.toLocaleString().split(",")[0]}
                    </h3>
                    <div className="flex items-center">
                      <Button className="min-w-fit bg-transparent text-green-500 font-bold">
                        <CiEdit size={30} />
                      </Button>
                      <Button className="min-w-fit bg-transparent text-red-500 font-bold">
                        <MdDeleteForever size={25} />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No Todos Created Yet</p>
            )}
          </TabsContent>
          <TabsContent value="completed">
            {completedTodos && completedTodos.length > 0 ? (
              completedTodos.map((t: TodoInterface) => {
                return (
                  <div
                    key={t?.id}
                    className="grid grid-cols-7 gap-3 items-center justify-items-start grid-flow-col "
                  >
                    <label className="col-span-1">
                      <input
                        type="checkbox"
                        checked={t?.completed}
                        onChange={(e) => handleCheckedTodos(e, t)}
                      />
                    </label>
                    <h3
                      className={`col-span-1 ${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.title}
                    </h3>
                    <h3
                      className={`col-span-3 ${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.description}
                    </h3>
                    <h3
                      className={`${t?.completed ? "line-through text-[#888]" : "no-underline text-[#FFF]"}`}
                    >
                      {t?.date?.toLocaleString().split(",")[0]}
                    </h3>
                    <div className="flex items-center">
                      <Button className="min-w-fit bg-transparent text-green-500 font-bold">
                        <CiEdit size={30} />
                      </Button>
                      <Button className="min-w-fit bg-transparent text-red-500 font-bold">
                        <MdDeleteForever size={25} />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No Todos Created Yet</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
