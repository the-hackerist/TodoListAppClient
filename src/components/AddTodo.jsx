import { useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";

import { toastOptions, API_ROOT_URL } from "../helper/constants";
import { useAuth } from "../contexts/AuthContext";
import Modal from "./Modal";
import Add from "./Add";

function AddTodo({ getTodos, sortBy, setSortBy, searchQuery, setSearchQuery }) {
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    priority: "",
  });

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (validator.isEmpty(todo.title)) {
      toast.error("Title is required.", toastOptions);
      return;
    }

    if (validator.isEmpty(todo.description)) {
      toast.error("Description is required.", toastOptions);
      return;
    }

    const newTodo = await fetch(`${API_ROOT_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user}`,
      },
      body: JSON.stringify({
        ...todo,
        priority: todo.priority ? todo.priority : "medium",
      }),
    });

    const result = await newTodo.json();

    if (!result.isSuccess) {
      toast.error(
        (result.errors.length > 0 && result.errors[0].msg) || result.message,
        toastOptions,
      );
      return;
    }

    await getTodos();
    setTodo({
      title: "",
      description: "",
      priority: "",
    });
    setShowModal(false);
    toast.success(result.message, toastOptions);
  };

  const handleOnClose = () => {
    setShowModal(false);
    setTodo({ title: "", description: "", priority: "" });
  };

  const handleClearSearchQuery = () => {
    setSearchQuery("");
  };

  return (
    <section className="flex items-center justify-between">
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <div className="flex items-center rounded-sm border-1 border-[#CCCCCC]">
          <input
            className="px-4 py-1 outline-none"
            type="text"
            placeholder="Search a todo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              role="button"
              className="cursor-pointer px-3 py-1 text-lg font-semibold text-red-500 hover:bg-red-200"
              onClick={handleClearSearchQuery}
            >
              x
            </button>
          )}
        </div>
        {showModal && (
          <Modal onClose={handleOnClose}>
            <Add
              todo={todo}
              setTodo={setTodo}
              handleAddTodo={handleAddTodo}
              setShowModal={setShowModal}
            />
          </Modal>
        )}
        <button
          type="button"
          className={`cursor-pointer rounded-sm bg-blue-500 px-8 font-semibold text-white`}
          onClick={() => setShowModal(true)}
        >
          Add New Todo
        </button>
      </form>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="first rounded-md border-1 border-[#CCCCCC] px-4 py-2"
      >
        <option value="" disabled>
          Sort by
        </option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="completed">Completed</option>
        <option value="uncompleted">Uncompleted</option>
      </select>
    </section>
  );
}

export default AddTodo;
