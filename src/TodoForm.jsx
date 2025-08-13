import { useRef } from "react"
import { useState } from "react";

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
        <label htmlFor="todoTitle">Todo</label>
        <input id="todoTitle" name="title" ref={todoTitleInput} 
        value={workingTodoTitle}
        onChange={(event)=>setWorkingTodoTitle(event.target.value)}
        />
        <button disabled={workingTodoTitle===""} >Add Todo</button>
    </form>
}

export default TodoForm