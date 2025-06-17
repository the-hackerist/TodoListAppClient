import { useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";

import { toastOptions, API_ROOT_URL } from "../helper/constants";
import { useAuth } from "../contexts/AuthContext";
import Modal from "./Modal";
import Edit from "./Edit";

function TodoItem({ todo, getTodos }) {
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editedTodo, setEditedTodo] = useState({
    title: todo.title,
    description: todo.description,
    isDone: todo.isDone,
    priority: todo.priority,
  });

  const handleEditedTodo = async (e, overrideState) => {
    e.preventDefault();

    if (
      editedTodo.title.trim() === overrideState.title.trim() &&
      editedTodo.description.trim() === overrideState.description.trim() &&
      editedTodo.isDone === overrideState.isDone &&
      editedTodo.priority === overrideState.priority
    ) {
      setShowModal(false);
      toast.warn("Change any value to update this todo.", toastOptions);
      return;
    }

    if (validator.isEmpty(editedTodo.title)) {
      toast.error("Title is required.");
      return;
    }

    if (validator.isEmpty(editedTodo.description)) {
      toast.error("Description is required.");
      return;
    }

    const updatedTodo = await fetch(`${API_ROOT_URL}/todos/${todo._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(overrideState),
    });

    const result = await updatedTodo.json();

    if (!result.isSuccess) {
      toast.error(
        (result.errors.length > 0 && result.errors[0].msg) || result.message,
        toastOptions,
      );
      return;
    }

    toast.success(result.message, toastOptions);

    await getTodos();

    setEditedTodo(result.updatedTodo);
    setShowModal(false);
  };

  const handleDeleteTodo = async () => {
    const deletedTodo = await fetch(`${API_ROOT_URL}/todos/${todo._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user}`,
        "Content-Type": "application/json",
      },
    });

    const result = await deletedTodo.json();

    if (!result.isSuccess) {
      toast.error(
        (result.errors.length > 0 && result.errors[0].msg) || result.message,
        toastOptions,
      );
      return;
    }

    await getTodos();

    toast.success(result.message, toastOptions);
  };

  return (
    <div
      className={`flex h-60 flex-col rounded-sm p-4 ${todo.isDone ? "bg-[#EEEEEE]" : "bg-blue-100"} `}
      key={todo._id}
    >
      <div>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <Edit
              editedTodo={editedTodo}
              setEditedTodo={setEditedTodo}
              handleEditedTodo={handleEditedTodo}
              setShowModal={setShowModal}
            />
          </Modal>
        )}
        <div className="flex items-center gap-4 px-3">
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer hidden"
              checked={editedTodo.isDone}
              onChange={(e) => {
                const updated = { ...editedTodo, isDone: e.target.checked };
                setEditedTodo(updated);
                handleEditedTodo(e, updated);
              }}
            />
            <div className="h-4 w-4 rounded-full border-1 border-gray-500 bg-white transition-colors duration-200 peer-checked:border-1 peer-checked:border-green-600 peer-checked:bg-green-300"></div>
          </label>
          <p
            className={`truncate text-lg font-bold ${todo.isDone && "line-through"}`}
          >
            {editedTodo.title}
          </p>
        </div>
        <p className={`px-4 pt-4 ${todo.isDone && "line-through"}`}>
          {editedTodo.description}
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4">
        <p
          className={`rounded-full border-1 px-4 py-1 text-xs ${todo.priority === "low" && "bg-blue-50 text-blue-500"} ${todo.priority === "medium" && "bg-yellow-50 text-yellow-500"} ${todo.priority === "high" && "bg-red-50 text-red-500"} `}
        >
          priority: <span className="font-semibold"> {todo.priority}</span>
        </p>
        <div className="flex gap-2 text-sm">
          <button
            className="cursor-pointer rounded-xs bg-green-200 px-4 py-1 font-semibold text-green-500 hover:bg-green-300 hover:text-green-600"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Edit
          </button>
          <button
            className="cursor-pointer rounded-xs bg-red-200 px-4 py-1 font-semibold text-red-500 hover:bg-red-300 hover:text-red-600"
            onClick={handleDeleteTodo}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
