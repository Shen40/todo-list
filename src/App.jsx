import './App.css'
import TodoList from './TodoList' 
import TodoForm from './features/TodoList/TodoForm'
import { useState } from 'react'

function App() {
  const [todoList, setTodoList] = useState([])

  function addTodo(title){
    const newTodo = {id:Date.now(), title:title, isCompleted:false}
    setTodoList([...todoList, newTodo])
  }

  function completeTodo(id){
    const updatedTodos = todoList.map((todo)=>{
      if(todo.id == id){
        return{...todo, isCompleted:true};
      }
      return todo; 
    })
    setTodoList(updatedTodos)
  }

  function updateTodo(editedTodo){
    const updatedTodos = todoList.map((todo)=>{
      if(todo.id == editedTodo.id){
        return{...editedTodo};
      }
      return todo;
    })
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  )
}

export default App