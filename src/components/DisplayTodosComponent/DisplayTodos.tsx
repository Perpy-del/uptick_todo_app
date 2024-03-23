import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllTodos from "./AllTodos";
import PendingTodos from "./PendingTodos";
import CompletedTodos from "./CompletedTodos";
import { useTodos } from "@/hooks/useTodos";

const DisplayTodos = () => {
    const {completed, pending} = useTodos();

  return (
    <div>
      {/* Tab for displaying All tasks, Completed Tasks, Pending Tasks */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending" onClick={completed}>
            Pending
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={pending}>
            Completed
          </TabsTrigger>
        </TabsList>
        <div className="grid grid-cols-7 gap-3 align-start grid-flow-col my-5 font-semibold sm:text-sm md:text-lg">
          <h3>Done</h3>
          <h3>Title</h3>
          <h3 className="sm:col-span-2 md:col-span-3">Description</h3>
          <h3>Date</h3>
          <h3>Update</h3>
        </div>
        <AllTodos />
        <PendingTodos />
        <CompletedTodos />
      </Tabs>
    </div>
  );
};

export default DisplayTodos;
