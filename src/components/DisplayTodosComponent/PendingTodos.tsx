import { useContext } from "react";
import { TabsContent } from "../ui/tabs";
import TodoListItem from "./TodoListItem";
import { TodoInterface } from "@/interface/TodoInterface";
import { TodoContext } from "@/Context/TodoContext";

const PendingTodos = () => {
  const { pendingTodos } = useContext(TodoContext);
  return (
    <TabsContent value="pending">
      {pendingTodos && pendingTodos.length > 0 ? (
        pendingTodos.map((t: TodoInterface) => {
          return (
            <TodoListItem key={t?.id}
              id={t?.id}
              title={t?.title}
              description={t?.description}
              date={t?.date}
              completed={t?.completed}
            />
          );
        })
      ) : (
        <p className="text-center mt-16 font-bold sm:text-xl md:text-3xl text-red-500">
          🤷‍♀️ No Todos Created Yet
        </p>
      )}
    </TabsContent>
  );
};

export default PendingTodos;
