import TodoForm from "../features/TodoList/TodoForm";
import TodoList from "../TodoList";
import TodosViewForm from "../features/TodoList/TodosViewForm";

function TodosPage({
    todoState, 
    sortField, 
    setSortField,
    sortDirection,
    setSortDirection,
    queryString,
    setQueryString, 
    addTodo,
    completeTodo,
    updateTodo

}){
    return(<div>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving}/>
        <TodoList todoList={todoState.todoList} onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} isLoading={todoState.isLoading}/>
        <hr />
        <TodosViewForm 
        sortDirection={sortDirection} 
        setSortDirection={setSortDirection} 
        sortField={sortField} 
        setSortField={setSortField}
        queryString={queryString} 
        setQueryString={setQueryString}>
        </TodosViewForm>
    </div>
    ) 
}
export default TodosPage;