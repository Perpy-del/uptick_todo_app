import WelcomeMessageComponent from "./WelcomeMessageComponent";
import TodoFormComponent from "./TodoFormComponent/TodoFormComponent";
import DisplayTodos from "./DisplayTodosComponent/DisplayTodos";
import TodoContextProvider from "@/Context/TodoContext";

function App() {
  return (
    <TodoContextProvider>
      <div className="h-[150vh] dark:bg-background bg-[#EEE] pt-5 pb-20 sm:px-3 md:px-5 font-Nunito">
        {/* Welcome Message */}
        <WelcomeMessageComponent />

        {/* Add New Task */}
        <TodoFormComponent />

        {/* Display Todo List */}
        <DisplayTodos />
      </div>
    </TodoContextProvider>
  );
}

export default App;
