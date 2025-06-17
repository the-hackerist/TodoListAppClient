/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { API_ROOT_URL } from "../helper/constants";
import AddTodo from "./AddTodo";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "./Loader";
import TodoItem from "./TodoItem";

function TodoDashboard() {
  const { user } = useAuth();

  const [todos, setTodos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    getTodos();
  }, [user, sortBy, searchQuery]);

  const getTodos = async () => {
    setLoading(true);
    const data = await fetch(
      `${API_ROOT_URL}/todos?${sortBy && `sort=${sortBy}`}`,
      {
        headers: { Authorization: `Bearer ${user}` },
      },
    );
    const result = await data.json();
    let todoList = result.todos;

    if (!searchQuery) {
      setTodos(todoList);
      setLoading(false);
      return;
    }

    todoList = result.todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setTodos(todoList);
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <AddTodo
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getTodos={getTodos}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {loading ? (
        <section className="mt-8 flex min-h-100 items-center justify-center rounded-md border-1 border-[#DDDDDD] p-8">
          <Loader />
        </section>
      ) : todos && !todos.length ? (
        <section className="mt-8 flex min-h-100 items-center justify-center rounded-md border-1 border-[#DDDDDD] p-8">
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-gray-400">
            {!searchQuery ? (
              <>
                <h2 className="text-xl font-semibold">😲 No todos yet.</h2>
                <p className="text-sm">Add a new task to get started.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">🔎 Todo not found.</h2>
                <p className="text-sm">
                  Add '{searchQuery}' as a todo to track it.
                </p>
              </>
            )}
          </div>
        </section>
      ) : (
        <section className="mt-8 grid min-h-100 grid-flow-row grid-cols-4 gap-8 rounded-md border-1 border-[#DDDDDD] p-8">
          {todos &&
            todos.length > 0 &&
            todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} getTodos={getTodos} />
            ))}
        </section>
      )}
    </ProtectedRoute>
  );
}

export default TodoDashboard;
