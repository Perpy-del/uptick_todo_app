import { ChangeEvent } from "react";

const TodoDescComponent = ({desc, onDescChange}: {desc: string, onDescChange: (e: ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <label className="sm:text-lg md:text-xl w-full">
      <h3 className="pb-2">Description:</h3>
      <input
        type="text"
        placeholder="e.g. Description of TODO task"
        value={desc}
        className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground dark:text-white description shadow-xl dark:shadow-none"
        onChange={onDescChange}
      />
    </label>
  );
};

export default TodoDescComponent;
