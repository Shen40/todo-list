import './App.css'
import TodoList from './TodoList' 
import TodoForm from './features/TodoList/TodoForm'
import { useEffect, useState } from 'react'
import TodosViewForm from './features/TodoList/TodosViewForm'


const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

const encodeUrl = ({sortField, sortDirection, queryString}) => {
  let searchQuery = "";
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  if(queryString){
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }
  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
}; 

function App() {
  const [todoList, setTodoList] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const[errorMessage, setErrorMessage] = useState("");
  const[isSaving, setIsSaving]= useState(false);
  const[sortField, setSortField] = useState("createdTime");
  const[sortDirection, setSortDirection] = useState("desc");
  const[queryString, setQueryString] = useState("");

  useEffect(()=>{
    const fetchTodos = async () => {
      setIsLoading(true);
      
      const options = {
        Method:"GET",
        headers:{
          Authorization: token,
        },
      }

      try {
        const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);

        if(!resp.ok){
          throw new Error(resp.message);
        }

        const response = await resp.json();
        const todos = response.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
        if(!todo.booleanProperty){
          todo.booleanProperty = false;
        }
        return todo;
      })
      setTodoList([...todos])

      } catch(error){
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false); 
      }
    };
    fetchTodos();
  },[sortField, sortDirection,queryString])

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    try{

      setIsSaving(true);
      const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);

      if(!resp.ok){
          throw new Error(resp.message);
      }
      
      const {records}= await resp.json();
      
      const savedTodo={
        id:records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {savedTodo.isCompleted = false;}

      setTodoList([...todoList, savedTodo]);
    } catch(error){
      console.log(error);
      setErrorMessage(error.message);
    } finally{
      setIsSaving(false);
    }
  }

  const completeTodo = async (id)=> {
    const originalTodo = todoList.find((todo) => todo.id === id)
    const updatedTodoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodoList(updatedTodoList);

    const payload = {
    records: [
        {
            id: id,
            fields: {
                title: originalTodo.title,
                isCompleted: !originalTodo.isCompleted,
            },
        },
    ],
  };

  const options = {
        method:"PATCH",
        headers:{
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      }

  try{
    const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);
    if(!resp.ok){
          throw new Error(resp.message);
    }
  }catch(error){
    console.log(error);
    setErrorMessage(`${error.message}. Reverting todo...`);
    const revertedTodos = todoList.map((todo) =>
      todo.id === id ? originalTodo : todo
    );
    setTodoList([...revertedTodos]);
  }finally{
    setIsSaving(false);
    }
  }

  const updateTodo = async (editedTodo) =>{
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id)
    const updatedTodoList = todoList.map((todo) =>todo.id === editedTodo.id ? editedTodo : todo)
    setTodoList(updatedTodoList);
    
    const payload = {
    records: [
        {
            id: editedTodo.id,
            fields: {
                title: editedTodo.title,
                isCompleted: editedTodo.isCompleted,
            },
        },
    ],
  };
  const options = {
        method:"PATCH",
        headers:{
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      }
  try{
    const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }), options);
    if(!resp.ok){
          throw new Error(resp.message);
    }
  }catch(error){
    console.log(error);
    setErrorMessage(`${error.message}. Reverting todo...`);
    const revertedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? originalTodo : todo
    );
    setTodoList([...revertedTodos]);
  }finally{
    setIsSaving(false);
    }
  }

  return(
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} 
      onUpdateTodo={updateTodo} isLoading={isLoading}/>
      <hr />
      <TodosViewForm sortDirection={sortDirection} setSortDirection={setSortDirection} 
      sortField={sortField} setSortField={setSortField}
      queryString={queryString} setQueryString={setQueryString}></TodosViewForm>
      {errorMessage && (
      <div>
        <hr />
        <p>{errorMessage}</p>
        <button onClick={() => setErrorMessage("")}>Dismiss</button>
      </div>
      )}
    </div>
  )
}

export default App