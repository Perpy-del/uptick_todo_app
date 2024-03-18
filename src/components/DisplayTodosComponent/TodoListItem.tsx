import { useTodos } from "@/hooks/useTodos";
import { TodoInterface } from "@/interface/TodoInterface";
import { Button } from "../ui/button";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

const TodoListItem = (t: TodoInterface) => {
  const { handleCheckedTodos, handleEditTodo, handleDeleteTodo } = useTodos();

  return (
    <div
      key={t?.id}
      className="grid grid-cols-7 gap-3 items-center justify-items-start grid-flow-col "
    >
      <label className="col-span-1">
        <input
          type="checkbox"
          checked={t?.completed}
          onChange={() => handleCheckedTodos(t?.id)}
        />
      </label>
      <h3
        className={`sm:text-xs md:text-base text-ellipsis sm:w-[70%] md:w-full sm:overflow-hidden md:overflow-auto ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
      >
        {t?.title}
      </h3>
      <h3
        className={`sm:col-span-2 md:col-span-3 sm:text-xs md:text-base ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
      >
        {t?.description}
      </h3>
      <h3
        className={`sm:text-[8px] md:w-full md:text-base ${t?.completed ? "line-through text-[#888]" : "no-underline dark:text-[#FFF]"}`}
      >
        {t?.date?.toLocaleString().split(",")[0]}
      </h3>
      {t?.completed ? (
        <p className="sm:text-[10px] md:text-base">Task Completed</p>
      ) : (
        <div className="flex sm:flex-col md:items-center md:flex-row">
          <Button variant="edit" onClick={() => handleEditTodo(t?.id)}>
            <CiEdit size={30} />
          </Button>
          <Button variant="delete" onClick={() => handleDeleteTodo(t?.id)}>
            <MdDeleteForever size={25} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodoListItem;
