/* eslint-disable @typescript-eslint/no-explicit-any */
import WelcomeMessageComponent from "./components/WelcomeMessageComponent";
import TodoFormComponent from "./components/TodoFormComponent/TodoFormComponent";
import DisplayTodos from "./components/DisplayTodosComponent/DisplayTodos";

function App() {
  return (
    <div className="h-[150vh] dark:bg-background bg-[#EEE] pt-5 pb-20 sm:px-3 md:px-5 font-Nunito">
      {/* Welcome Message */}
      <WelcomeMessageComponent />

      {/* Add New Task */}
      <TodoFormComponent />

      {/* Display Todo List */}
      <DisplayTodos />
    </div>
  );
}

export default App;
