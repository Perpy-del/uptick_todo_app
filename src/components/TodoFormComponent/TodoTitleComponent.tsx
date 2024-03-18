import React, { ChangeEvent } from "react";

const TodoTitleComponent = ({
  title,
  onTitleChange,
  inputTitleRef,
}: {
  title: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputTitleRef: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <label className="sm:text-lg md:text-xl sm:w-full md:w-[70%]">
      <h3 className="pb-2">Title:</h3>
      <input
        type="text"
        placeholder="e.g. Submit TODO Task"
        value={title}
        className="block dark:border dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground dark:text-white description shadow-xl dark:shadow-none"
        onChange={onTitleChange}
        ref={inputTitleRef}
      />
    </label>
  );
};

export default TodoTitleComponent;
