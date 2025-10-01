import './App.css'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import styles from "./App.module.css"
import { useReducer } from 'react'
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import TodosPage from './pages/TodosPage'
import Header from './shared/Header'
import { useLocation } from 'react-router'
import { Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState); 
  const[sortField, setSortField] = useState("createdTime");
  const[sortDirection, setSortDirection] = useState("desc");
  const[queryString, setQueryString] = useState("");
  const[title, setTitle] = useState("To Do List"); 

  const location = useLocation(); 

  const encodeUrl = useCallback(() => {
  let searchQuery = "";
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  if(queryString){
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }
  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  } ,[sortField, sortDirection, queryString])

  useEffect(()=>{
    if(location.pathname==="/") setTitle("To Do List"); 
    else if(location.pathname==="/about") setTitle("About"); 
    else setTitle("Not Found")
  }, [location])

  useEffect(()=>{
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      
      const options = {
        method:"GET",
        headers:{
          Authorization: token,
        },
      }

      try {
        const resp = await fetch(encodeUrl(), options);

        if(!resp.ok){
          throw new Error(resp.message);
        }

        const response = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: response.records});


      } catch(error){
        dispatch({ type: todoActions.setLoadError, error:error});
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    };
    fetchTodos();
  },[sortField, sortDirection,queryString, encodeUrl])

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

      dispatch({ type: todoActions.startRequest});
      const resp = await fetch(encodeUrl(), options);

      if(!resp.ok){
          throw new Error(resp.message);
      }
      
      const {records}= await resp.json();
      
      dispatch({type: todoActions.addTodo, records:records});

    } catch(error){
      console.log(error);
      dispatch({type: todoActions.setLoadError, error:error});
    } finally{
      dispatch({type: todoActions.endRequest});
    }
  }

  const completeTodo = async (id)=> {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id)
    dispatch({type: todoActions.completeTodo, id})

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
    const resp = await fetch(encodeUrl(), options);
    if(!resp.ok){
          throw new Error(resp.message);
    }
  }catch(error){
    dispatch({
      type: todoActions.revertTodo,
      editedTodo: originalTodo,
      error: error,
    });
  }finally{
    dispatch({ type: todoActions.endRequest });
    }
  }

  const updateTodo = async (editedTodo) =>{
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id)
    dispatch({type: todoActions.updateTodo,editedTodo: editedTodo })

    
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
    const resp = await fetch(encodeUrl(), options);
    if(!resp.ok){
          throw new Error(resp.message);
    }
  }catch(error){
    dispatch({
      type: todoActions.revertTodo,
      editedTodo: originalTodo,
      error: error,
    });
  }finally{
    dispatch({ type: todoActions.endRequest });
    }
  }

  return(
    <div className ={styles.body}>
      <Header title={title}></Header>
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoState={todoState}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              queryString={queryString}
              setQueryString={setQueryString}
              addTodo={addTodo}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
            />
          }
        />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      {todoState.errorMessage && (
      <div className={styles.error}>
        <hr />
        <p>{todoState.errorMessage}</p>
        <button onClick={() => dispatch({type: todoActions.clearError})}>Dismiss</button>
      </div>
      )}
    </div>
  )
}

export default App