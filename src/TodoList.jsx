import TodoListItem from "./TodoListItem"
import styles from "./TodoList.module.css"
import { useNavigate, useSearchParams } from 'react-router'
import { useEffect } from "react";

function TodoList({todoList, onCompleteTodo, onUpdateTodo, isLoading}){
    const filteredTodoList = todoList.filter(todo=>!todo.isCompleted);
    const [searchParams, setSearchParams] = useSearchParams(); 
    const navigate = useNavigate();

    const itemsPerPage = 15; 
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const indexOfFirstTodo = (currentPage-1)*itemsPerPage; 
    const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
    const totalPages = Math.ceil(filteredTodoList.length/itemsPerPage); 

    const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);

    useEffect(()=>{
        if(totalPages>0){
            if(isNaN(currentPage)||currentPage<1||currentPage>totalPages){
            navigate("/"); 
        }
        }
    }, [currentPage, totalPages, navigate]); 

    
    const handlePreviousPage = ()=>{
        if(currentPage>1)setSearchParams({page: String(currentPage-1)}); 
    }

    const handleNextPage = ()=>{
        if(currentPage<totalPages)setSearchParams({page: String(currentPage+1)}); 
    }

    return ( 
        isLoading?
        <p>Todo list loading...</p>:  
            filteredTodoList.length === 0 ? 
                <p>Add todo above to get started</p> : 
                <div>
                    <ul className={styles.list}>{currentTodos.map(todo => <TodoListItem key={todo.id} todo={todo} 
                    onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>)}</ul>  
                    <div className={styles.PaginationControls}>
                        <button disabled={currentPage===1} onClick={handlePreviousPage}>Previous</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button disabled={currentPage===totalPages} onClick={handleNextPage}>Next</button>
                    </div>
                </div>
    )
}

export default TodoList