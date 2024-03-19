// import { TodoInterface } from "@/interface/TodoInterface";
// import { handleAddTodoDatabase, handleEditTodoDatabase } from "@/lib/utils";
// import { ChangeEvent, useRef, useState } from "react";
// import { v4 as uuid } from "uuid";
// // import { useTodos } from "./useTodos";

// export function useForm(getAllTodos: () => void) {
// //  const { edit, setEdit } = useTodos();
//   // input states
//   const [title, setTitle] = useState<string>("");
//   const [desc, setDesc] = useState<string>("");
//   const [date, setDate] = useState<Date>();

// //   const [edit, setEdit] = useState<boolean>(false);
//   // Validation
//   const [titleNotValid, setTitleNotValid] = useState<boolean>(false);
//   const [descNotValid, setDescNotValid] = useState<boolean>(false);
//   const [dateNotValid, setDateNotValid] = useState<boolean>(false);
//   const [dateHasPassed, setDateHasPassed] = useState<boolean>(false);
//   const [selectedTodo, setSelectedTodo] = useState<TodoInterface | undefined>(
//     undefined,
//   );

//   // useRef for input
//   const inputTitleRef = useRef<HTMLInputElement>(null);

//   // handle input title change
//   function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
//     setTitle(e.target.value);
//   }

//   // handle input description change
//   function handleDescChange(e: ChangeEvent<HTMLInputElement>) {
//     setDesc(e.target.value);
//   }

//   // handle adding a new task to the database
//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     console.log("DATE: ", date);
//     const now = new Date();
//     const currDate = new Date(now);
//     currDate.setDate(now.getDate() - 1);
//     console.log("CURR DATE: ", currDate);
//     if (date) {
//       console.log(currDate > date);
//     }
//     if (!title) {
//       setTitleNotValid(true);
//     } else if (title && !desc) {
//       setDescNotValid(true);
//       setTitleNotValid(false);
//     } else if (!desc) {
//       setDescNotValid(true);
//     } else if (!date) {
//       setDescNotValid(false);
//       setDateNotValid(true);
//     } else if (date && currDate > date) {
//       setDateNotValid(false);
//       setDateHasPassed(true);
//     } else {
//       setTitleNotValid(false);
//       setDateNotValid(false);
//       setDescNotValid(false);
//       setDateHasPassed(false);
//       if (edit) {
//         handleEditTodoDatabase({
//           id: selectedTodo?.id,
//           title,
//           description: desc,
//           date,
//           getAllTodos,
//         });
//       } else {
//         handleAddTodoDatabase({
//           title,
//           desc,
//           date,
//           completed: false,
//           getAllTodos,
//           id: uuid(),
//         });
//       }
//       setTitle("");
//       setDesc("");
//       setDate(undefined);
//       setEdit(false);
//     }
//   }

//   return {
//     // edit,
//     title,
//     desc,
//     date,
//     setTitle,
//     setDesc,
//     setDate,
//     // setEdit,
//     titleNotValid,
//     descNotValid,
//     dateNotValid,
//     dateHasPassed,
//     selectedTodo,
//     setSelectedTodo,
//     inputTitleRef,
//     handleSubmit,
//     handleTitleChange,
//     handleDescChange,
//   };
// }
