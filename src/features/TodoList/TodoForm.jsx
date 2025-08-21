import { useRef } from "react"
import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoForm({onAddTodo}){
    const[workingTodoTitle, setWorkingTodoTitle] = useState("")
    const todoTitleInput = useRef("");

    function handleAddTodo(event){
        event.preventDefault()
        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle("")
        todoTitleInput.current.focus();
    }

    return <form action="" onSubmit={handleAddTodo}>
        <TextInputWithLabel 
        ref={todoTitleInput} 
        value={workingTodoTitle}
        onChange={(event)=>setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText = "Todo"
        />
        <label htmlFor="todoTitle">Todo</label>
        <button disabled={workingTodoTitle===""} >Add Todo</button>
    </form>
}

export default TodoForm