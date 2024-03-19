/* eslint-disable @typescript-eslint/no-explicit-any */
import { TodoInterface } from "@/interface/TodoInterface";
import { createTodoCollection } from "@/lib/db";
import { handleAddTodoDatabase, handleDeleteTodoDatabase, handleEditTodoDatabase, handleUpdateTodoDatabase } from "@/lib/utils";
import { ChangeEvent, createContext, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export const TodoContext = createContext<any>({});

export default function TodoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [date, setDate] = useState<Date>();

  const [edit, setEdit] = useState<boolean>(false);
  const [allTodosData, setAllTodosData] = useState<Array<TodoInterface>>([]);
  const [completedTodos, setCompletedTodos] = useState<Array<TodoInterface>>(
    [],
  );
  const [pendingTodos, setPendingTodos] = useState<Array<TodoInterface>>([]);

  const [titleNotValid, setTitleNotValid] = useState<boolean>(false);
  const [descNotValid, setDescNotValid] = useState<boolean>(false);
  const [dateNotValid, setDateNotValid] = useState<boolean>(false);
  const [dateHasPassed, setDateHasPassed] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoInterface | undefined>(
    undefined,
  );

  // useRef for input
  const inputTitleRef = useRef<HTMLInputElement>(null);
  
  // handle getting all the tasks from the database
  function getAllTodos() {
    const dbPromise = indexedDB.open("TODODatabase", 2);

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
    handleDeleteTodoDatabase({ id, getAllTodos });
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

  // handle input title change
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  // handle input description change
  function handleDescChange(e: ChangeEvent<HTMLInputElement>) {
    setDesc(e.target.value);
  }

  // handle adding a new task to the database
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const now = new Date();
    const currDate = new Date(now);
    currDate.setDate(now.getDate() - 1);

    if (!title) {
      setTitleNotValid(true);
    } else if (title && !desc) {
      setDescNotValid(true);
      setTitleNotValid(false);
    } else if (!desc) {
      setDescNotValid(true);
    } else if (!date) {
      setDescNotValid(false);
      setDateNotValid(true);
    } else if (date && currDate > date) {
      setDateNotValid(false);
      setDateHasPassed(true);
    } else {
      setTitleNotValid(false);
      setDateNotValid(false);
      setDescNotValid(false);
      setDateHasPassed(false);
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
  }

  return <TodoContext.Provider value={{allTodosData, completedTodos, pendingTodos, completed, pending, handleCheckedTodos, handleEditTodo, handleDeleteTodo, date, setDate, desc, handleDescChange, handleSubmit, titleNotValid, descNotValid, dateNotValid, dateHasPassed, edit, title, handleTitleChange, inputTitleRef}}>{children}</TodoContext.Provider>;
}
