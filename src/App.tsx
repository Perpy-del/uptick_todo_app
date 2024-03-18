/* eslint-disable @typescript-eslint/no-explicit-any */
import ThemeToggle from "./components/ThemeToggle";

import { ChangeEvent, useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

import {
  cn,
  handleAddTodoDatabase,
  handleDeleteTodoDatabase,
  handleEditTodoDatabase,
  // handleEditTodoDatabase,
  handleUpdateTodoDatabase,
} from "@/lib/utils";
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

// Interface for todo
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
  const [allTodosData, setAllTodosData] = useState<Array<TodoInterface>>([]);
  const [completedTodos, setCompletedTodos] = useState<Array<TodoInterface>>(
    [],
  );
  const [pendingTodos, setPendingTodos] = useState<Array<TodoInterface>>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoInterface | undefined>(undefined);
  const [edit, setEdit] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputTitleRef = useRef<HTMLInputElement>(null);

  // handle input name change
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }

  // handle input title change
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  // handle input description change
  function handleDescChange(e: ChangeEvent<HTMLInputElement>) {
    setDesc(e.target.value);
  }

  // handle getting all the tasks from the database
  function getAllTodos() {
    const dbPromise = indexedDB.open("TODODatabase", 1);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      const transaction = db.transaction("todoList", "readonly");

      const todoList = transaction.objectStore("todoList");

      const todos = todoList?.getAll();

      todos.onsuccess = (query) => {
        setAllTodosData((query?.target as IDBRequest).result);
      };

      todos.onerror = () => {
        alert("Error occured while loading initial data");
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  }

  // handle adding a new task to the database
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ title, desc, date });
    if (edit) {
      handleEditTodoDatabase({
        id: selectedTodo?.id,
        title,
        description: desc,
        date,
        getAllTodos,
      });
    } else {
      handleAddTodoDatabase({
        title,
        desc,
        date,
        completed: false,
        getAllTodos,
        id: uuid(),
      });
    }
    setTitle("");
    setDesc("");
    setDate(undefined);
    setEdit(false);
  }

  // handle checkbox to update a task as completed
  function handleCheckedTodos(id: string) {
    handleUpdateTodoDatabase(id);
  }

  // handle edit todo
  function handleEditTodo(id: string) {
    const editTodo = allTodosData.filter((todo) => todo.id === id)[0];
    setSelectedTodo(editTodo);
    inputTitleRef.current?.focus();
    setTitle(editTodo.title);
    setDesc(editTodo.description);
    setDate(editTodo.date);
    setEdit(true);
  }

  // handle delete todo
  function handleDeleteTodo(id: string) {
    handleDeleteTodoDatabase({id, getAllTodos})
  }

  // handle completed tasks
  const completed = useCallback(() => {
    const completedTasks = allTodosData.filter((todo) => todo.completed);
    setCompletedTodos(completedTasks);
  }, [allTodosData]);

  // handle pending tasks
  const pending = useCallback(() => {
    const pendingTasks = allTodosData.filter((todo) => !todo.completed);
    setPendingTodos(pendingTasks);
  }, [allTodosData]);

  // call the database
  useEffect(() => {
    createTodoCollection();
  }, []);

  // load all todo tasks onmount
  useEffect(() => {
    getAllTodos();
    pending();
    completed();
  }, [completed, pending]);

  // focus on the user name on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  // get user name from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem("userName") || "";
    user ? setUserName(user) : "";
  }, []);

  // if there is no user name, set a new one on mount
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
              ref={inputTitleRef}
            />
          </label>
          <label className="text-xl w-full">
            <h3 className="pb-2">Description:</h3>
            <input
              type="text"
              placeholder="e.g. Description of TODO task"
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
          {edit ? "Update Task" : "Add Task"}
        </Button>
      </form>

      {/* Display the TODOS */}
      <div>
        {/* Tab for displaying All tasks, Completed Tasks, Pending Tasks */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending" onClick={completed}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={pending}>
              Completed
            </TabsTrigger>
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
                        onChange={() => handleCheckedTodos(t?.id)}
                      />
                    </label>
                    <h3
                      className={`col-span-1 ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.title}
                    </h3>
                    <h3
                      className={`col-span-3 ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.description}
                    </h3>
                    <h3
                      className={`${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.date?.toLocaleString().split(",")[0]}
                    </h3>
                    {t?.completed ? (
                      <p>Task Completed</p>
                    ) : (
                      <div className="flex items-center">
                        <Button
                          variant="edit"
                          onClick={() => handleEditTodo(t?.id)}
                        >
                          <CiEdit size={30} />
                        </Button>
                        <Button variant='delete' onClick={() => handleDeleteTodo(t?.id)}>
                          <MdDeleteForever size={25} />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center mt-16 font-bold text-3xl text-red-500">
                🤷‍♀️ No Todos Created Yet
              </p>
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
                        onChange={() => handleCheckedTodos(t?.id)}
                      />
                    </label>
                    <h3
                      className={`col-span-1 ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.title}
                    </h3>
                    <h3
                      className={`col-span-3 ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.description}
                    </h3>
                    <h3
                      className={`${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
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
              <p className="text-center mt-16 font-bold text-3xl text-red-500">
                🤷‍♀️ No Todos Created Yet
              </p>
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
                        onChange={() => handleCheckedTodos(t?.id)}
                      />
                    </label>
                    <h3
                      className={`col-span-1 ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.title}
                    </h3>
                    <h3
                      className={`col-span-3 ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.description}
                    </h3>
                    <h3
                      className={`${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
                    >
                      {t?.date?.toLocaleString().split(",")[0]}
                    </h3>
                    <p>Task Completed</p>
                  </div>
                );
              })
            ) : (
              <p className="text-center mt-16 font-bold text-3xl text-red-500">
                🤷‍♀️ No Todos Created Yet
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
