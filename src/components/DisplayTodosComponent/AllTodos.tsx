import { TabsContent } from "../ui/tabs";
import TodoListItem from "./TodoListItem";
import { TodoInterface } from "@/interface/TodoInterface";
import { useTodos } from "@/hooks/useTodos";

const AllTodos = () => {
  const {allTodosData} = useTodos();
  return (
    <TabsContent value="all">
      {allTodosData && allTodosData.length > 0 ? (
        allTodosData.map((t: TodoInterface) => {
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

export default AllTodos;
