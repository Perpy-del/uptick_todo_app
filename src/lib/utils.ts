import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleAddTodoDatabase({
  title,
  desc,
  date,
  dateNotPassed,
  completed,
  getAllTodos,
  id,
}: {
  title: string;
  desc: string;
  date: Date | undefined;
  dateNotPassed?: boolean,
  completed: boolean;
  getAllTodos: () => void;
  id: string;
}) {
  const dbPromise = indexedDB.open("TODODatabase", 1);
  
  if (!title && !desc && !date && !dateNotPassed) return;

  if (title && desc && date && dateNotPassed) {
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
  const dbPromise = indexedDB.open("TODODatabase", 1);

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

export function handleEditTodoDatabase({
  id,
  title,
  description,
  date,
  getAllTodos,
}: {
  id: string | undefined;
  title: string;
  description: string;
  date: Date | undefined;
  getAllTodos: () => void;
}) {
  const dbPromise = indexedDB.open("TODODatabase", 1);

  dbPromise.onsuccess = () => {
    const db = dbPromise.result;

    const transaction = db.transaction("todoList", "readwrite");

    const todoList = transaction.objectStore("todoList");
    if (id) {
      const todo = todoList.get(id);

      todo.onsuccess = (event) => {
        const todoItem = (event?.target as IDBRequest).result;

        todoItem.title = title;
        todoItem.description = description;
        todoItem.date = date;
        todoItem.id = id;
        const updateTodo = todoList.put(todoItem);

        updateTodo.onsuccess = () => {
          getAllTodos();
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
    }
  };
}

export function handleDeleteTodoDatabase({
  id,
  getAllTodos,
}: {
  id: string;
  getAllTodos: () => void;
}) {
  const dbPromise = indexedDB.open("TODODatabase", 1);

  dbPromise.onsuccess = () => {
    const db = dbPromise.result;

    const transaction = db.transaction("todoList", "readwrite");

    const todoList = transaction.objectStore("todoList");

    const confirmDeleteTodo = confirm(
      "Are you sure you want to delete this task?",
    );

    if (confirmDeleteTodo) {
      const deleteTodo = todoList.delete(id);

      deleteTodo.onsuccess = () => {
        getAllTodos();
        console.log("Task deleted successfully");
        alert("Task deleted successfully");
      };

      deleteTodo.onerror = (e) => {
        console.log(e);
        alert("Error deleting task!");
      };
    }
  };
}
