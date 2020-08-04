import React, {
  createContext,
  useContext,
  useReducer,
  useCallback
} from "react";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  return (
    <TodoContext.Provider value={TodoValue()}>{children}</TodoContext.Provider>
  );
}

export const useTodo = () => useContext(TodoContext);

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: state.length, title: action.todo.title }];
    case "REMOVE_TODO":
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}

const initialState = { todos: [] };

function TodoValue() {
  const [todos, dispatch] = useReducer(todoReducer, initialState.todos);

  const addTodo = useCallback(
    todo => {
      dispatch({ type: "ADD_TODO", todo });
    },
    [dispatch]
  );

  const removeTodo = useCallback(
    id => {
      dispatch({ type: "REMOVE_TODO", id });
    },
    [dispatch]
  );

  return {
    todos,
    dispatch,
    addTodo,
    removeTodo
  };
}
