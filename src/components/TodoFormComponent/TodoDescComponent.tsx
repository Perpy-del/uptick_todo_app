import { TodoContext } from "@/Context/TodoContext";
import { useContext } from "react";

const TodoDescComponent = () => {
  const { desc, handleDescChange } = useContext(TodoContext);

  return (
    <label className="sm:text-lg md:text-xl w-full">
      <h3 className="pb-2">Description:</h3>
      <input
        type="text"
        placeholder="e.g. Description of TODO task"
        value={desc}
        className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground dark:text-white description shadow-xl dark:shadow-none"
        onChange={handleDescChange}
      />
    </label>
  );
};

export default TodoDescComponent;
