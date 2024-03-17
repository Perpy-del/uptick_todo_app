import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleAddTodoDatabase({
  title,
  desc,
  date,
  completed,
  getAllTodos,
  id,
}: {
  title: string;
  desc: string;
  date: Date | undefined;
  completed: boolean;
  getAllTodos: () => void;
  id: string;
}) {
  const dbPromise = indexedDB.open("todoListDatabase", 2);

  if (title && desc && date) {
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      const transaction = db.transaction("todoList", "readwrite");

      const todoList = transaction.objectStore("todoList");

      const todos = todoList.put({
        id,
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

export function handleUpdateTodoDatabase(id: string) {
  const dbPromise = indexedDB.open("todoListDatabase", 2);

  dbPromise.onsuccess = () => {
    const db = dbPromise.result;

    const transaction = db.transaction("todoList", "readwrite");

    const todoList = transaction.objectStore("todoList");

    const todo = todoList.get(id);

    todo.onsuccess = (event) => {
      const todoItem = (event?.target as IDBRequest).result;

      todoItem.completed = !todoItem.completed;
      const updateTodo = todoList.put(todoItem);

      updateTodo.onsuccess = () => {
        alert("Task updated successfully!");
      };

      updateTodo.onerror = () => {
        alert("Error updating task!");
      };
    };

    todo.onerror = (e) => {
      console.log(e);
      alert("Error fetching task!");
    };
  };
}
