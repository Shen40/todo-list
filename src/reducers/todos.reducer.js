const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};

function reducer(state=initialState, action) {
    switch(action.type){
        case actions.fetchTodos:
            return {
            ...state,
            isLoading:true
         };
        case actions.loadTodos:{
            const todos = action.records.map((record) => {
                const todo = {
                    id: record.id,
                    ...record.fields,
                };
                if (!todo.booleanProperty) {
                    todo.booleanProperty = false;
                }
                return todo;
            });
            return {
            ...state,
            todoList: todos,
            isLoading: false
            };
        };
        case actions.setLoadError:
            return {
            ...state,
            errorMessage: action.error.message,
            isLoading: false
        };
        case actions.startRequest:
            return {
            ...state,
            isSaving: true
        };
        case actions.addTodo:{
            const savedTodo={
                    id:action.records[0].id,
                    ...action.records[0].fields,
                };

            if (!action.records[0].fields.isCompleted) {savedTodo.isCompleted = false;}                
            
            return {
            ...state,
            todoList: [...state.todoList, savedTodo],
            isSaving:false
            }
        };
        case actions.endRequest:
            return {
            ...state,
            isLoading: false,
            isSaving: false
        };
        case actions.revertTodo:
        case actions.updateTodo:{
            const updatedTodos = state.todoList.map((todo) =>
                todo.id === action.editedTodo.id ? action.editedTodo : todo)
             if(action.error){
                updatedTodos.forEach(todo => {
                    todo.errorMessage = action.error.message;
                });
            }
            const updatedState = {
                ...state, 
                todoList: updatedTodos
            }
            return updatedState;
        }; 
        case actions.completeTodo:{
            const updatedTodos = state.todoList.map((todo) =>
                todo.id === action.id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            );
            return {
            ...state,
            todoList: updatedTodos
            }
        }; 
        case actions.clearError:
            return {
            ...state,
            errorMessage:""
        }; 
    }
};

const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: ""
};

export {initialState, actions, reducer}; 