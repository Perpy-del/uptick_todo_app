import { TodoContext } from "@/Context/TodoContext"
import { useContext } from "react"

export const useTodos = () => {
    const context = useContext(TodoContext);
    return context;
}