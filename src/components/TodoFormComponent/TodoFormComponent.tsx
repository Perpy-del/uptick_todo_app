import TodoTitleComponent from "./TodoTitleComponent";
import TodoDescComponent from "./TodoDescComponent";
import TodoDateComponent from "./TodoDateComponent";
import { Button } from "../ui/button";
import { useForm } from "@/hooks/useForm";
import { useTodos } from "@/hooks/useTodos";

const TodoFormComponent = () => {

  const {getAllTodos} = useTodos();
  const {title, desc, date,edit, setDate, inputTitleRef, handleSubmit, handleTitleChange, handleDescChange, titleNotValid, descNotValid, dateNotValid, dateNotPassed} = useForm(getAllTodos);

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-bold pb-3 text-[#888]">What do you have planned?</h3>
      <div className="flex sm:flex-col md:flex-row gap-10 pb-10">
        <TodoTitleComponent title={title} onTitleChange={handleTitleChange} inputTitleRef={inputTitleRef} />
        <TodoDescComponent desc={desc} onDescChange={handleDescChange} />
        <TodoDateComponent date={date} setDate={setDate} />
      </div>
      {titleNotValid && (
        <p className="text-red-700">The title field cannot be empty</p>
      )}
      {descNotValid && (
        <p className="text-red-700">The description field cannot be empty</p>
      )}
      {dateNotValid && (
        <p className="text-red-700">Please input a valid date.</p>
      )}
      {dateNotPassed && (
        <p className="text-red-700">
          The selected date is not current. Please enter a current date
        </p>
      )}
      <Button
        type="submit"
        className="w-full h-[3.75rem] sm:text-lg md:text-xl bg-[#da213f] shadow-xl dark:shadow-none dark:text-accent-foreground hover:bg-[#f0556e] transition duration-200 ease-in-out mb-9"
      >
        {edit ? "Update Task" : "Add Task"}
      </Button>
    </form>
  );
};

export default TodoFormComponent;
