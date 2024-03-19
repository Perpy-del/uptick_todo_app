// import { TodoInterface } from "@/interface/TodoInterface";
// import {
//   handleDeleteTodoDatabase,
//   handleUpdateTodoDatabase,
// } from "@/lib/utils";
// import { useCallback, useEffect, useState } from "react";
// import { useForm } from "./useForm";
// import { createTodoCollection } from "@/lib/db";

// export function useTodos() {
//   // states for todos
//   const [edit, setEdit] = useState<boolean>(false);
//   const [allTodosData, setAllTodosData] = useState<Array<TodoInterface>>([]);
//   const [completedTodos, setCompletedTodos] = useState<Array<TodoInterface>>(
//     [],
//   );
//   const [pendingTodos, setPendingTodos] = useState<Array<TodoInterface>>([]);

//   const {
//     setSelectedTodo,
//     setTitle,
//     setDate,
//     setDesc,
//     // setEdit,
//     inputTitleRef
//   } = useForm(getAllTodos);
//   // handle getting all the tasks from the database
//   function getAllTodos() {
//     const dbPromise = indexedDB.open("TODODatabase", 2);

//     dbPromise.onsuccess = () => {
//       const db = dbPromise.result;

//       const transaction = db.transaction("todoList", "readonly");

//       const todoList = transaction.objectStore("todoList");

//       const todos = todoList?.getAll();

//       todos.onsuccess = (query) => {
//         setAllTodosData((query?.target as IDBRequest).result);
//       };

//       todos.onerror = () => {
//         alert("Error occured while loading initial data");
//       };

//       transaction.oncomplete = () => {
//         db.close();
//       };
//     };
//   }

//   // handle checkbox to update a task as completed
//   function handleCheckedTodos(id: string) {
//     handleUpdateTodoDatabase(id);
//   }

//   // handle edit todo
//   function handleEditTodo(id: string) {
//       setEdit(true);
//     const editTodo = allTodosData.filter((todo) => todo.id === id)[0];
//     setSelectedTodo(editTodo);
//     inputTitleRef.current?.focus();
//     setTitle(editTodo.title);
//     setDesc(editTodo.description);
//     setDate(editTodo.date);
//   }

//   // handle delete todo
//   function handleDeleteTodo(id: string) {
//     handleDeleteTodoDatabase({ id, getAllTodos });
//   }

//   // handle completed tasks
//   const completed = useCallback(() => {
//     const completedTasks = allTodosData.filter((todo) => todo.completed);
//     setCompletedTodos(completedTasks);
//   }, [allTodosData]);

//   // handle pending tasks
//   const pending = useCallback(() => {
//     const pendingTasks = allTodosData.filter((todo) => !todo.completed);
//     setPendingTodos(pendingTasks);
//   }, [allTodosData]);

//   // call the database
//   useEffect(() => {
//     createTodoCollection();
//   }, []);

//   // load all todo tasks onmount
//   useEffect(() => {
//     getAllTodos();
//     pending();
//     completed();
//   }, [completed, pending]);

//   return {
//     edit,
//     setEdit,
//     allTodosData, setAllTodosData,
//     getAllTodos,
//     completedTodos,
//     pendingTodos,
//     pending,
//     completed,
//     handleCheckedTodos,
//     handleEditTodo,
//     handleDeleteTodo,
//   };
// }
