import { useRef } from "react"
import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styled from "styled-components";

const StyledForm = styled.form`
    padding: 0.5rem;
`;

const StyledButton  = styled.button`
    padding: 0.5rem;
    margin:0.5rem;
    &:disabled{
        font-style:italic;
    }
`

function TodoForm({onAddTodo, isSaving}){
    const[workingTodoTitle, setWorkingTodoTitle] = useState("")
    const todoTitleInput = useRef("");

    function handleAddTodo(event){
        event.preventDefault()
        onAddTodo({ title: workingTodoTitle, isCompleted: false })
        setWorkingTodoTitle("")
        todoTitleInput.current.focus();
    }

    return <StyledForm action="" onSubmit={handleAddTodo}>
        <TextInputWithLabel 
        ref={todoTitleInput} 
        value={workingTodoTitle}
        onChange={(event)=>setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText = "Todo"
        />
        <label htmlFor="todoTitle">Todo</label>
        <StyledButton disabled={workingTodoTitle.trim()===""}>
            {isSaving ? 'Saving...' : 'Add Todo'}
        </StyledButton>
    </StyledForm>
}

export default TodoForm