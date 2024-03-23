import TodoTitleComponent from "./TodoTitleComponent";
import TodoDescComponent from "./TodoDescComponent";
import TodoDateComponent from "./TodoDateComponent";
import { Button } from "../ui/button";
import { useTodos } from "@/hooks/useTodos";

const TodoFormComponent = () => {
  const { edit, handleSubmit, titleNotValid, descNotValid, dateNotValid, dateHasPassed} = useTodos();

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-bold pb-3 text-[#888]">What do you have planned?</h3>
      <div className="flex sm:flex-col md:flex-row gap-10 pb-10">
        <TodoTitleComponent />
        <TodoDescComponent />
        <TodoDateComponent />
      </div>
      {titleNotValid && (
        <p className="text-red-700 text-lg text-center pb-5 font-bold">The title field cannot be empty</p>
      )}
      {descNotValid && (
        <p className="text-red-700 text-lg text-center pb- font-bold">The description field cannot be empty</p>
      )}
      {dateNotValid && (
        <p className="text-red-700 text-lg text-center pb-5 font-bold">Please input a valid date.</p>
      )}
      {dateHasPassed && (
        <p className="text-red-700 text-lg text-center pb-5 font-bold">
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
