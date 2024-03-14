import ThemeToggle from "./components/ThemeToggle";

import { useEffect, useState } from "react";

// const userN = prompt('Hello, Please enter your name:', 'Jane/John Doe')
// console.log("USER: ", userN)

function App() {
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [userName, setUserName] = useState<string | null>("");

  useEffect(() => {
    const now = new Date();
    console.log(now.toString());
    const hour = now.getHours();

    if (hour < 12) {
      setTimeOfDay("morning");
    } else if (hour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, [timeOfDay]);

  useEffect(() => {
    const user = localStorage.getItem("userName") || "";
    // userN && localStorage.setItem('userName', userN)
    user ? setUserName(user) : setUserName("");
  }, [userName]);

  return (
    <div className="bg-darkBg h-full py-5 px-5">
      {/* Welcome Message */}
      <div className="text-darkText font-bold text-3xl font-Nunito flex justify-between items-center">
        <h3>
          Good {timeOfDay}, {userName} 👋
        </h3>
        <ThemeToggle />
      </div>

      {/* Add New Task */}
      <form>
        <h3>What do you have planned?</h3>
        <label>
          Title:
          <input type="text" placeholder="e.g. Submit TODO Task" />
        </label>
        <label>
          Description:
          <input type="text" placeholder="e.g.Description of TOFO task" />
        </label>
        
      </form>
    </div>
  );
}

export default App;
