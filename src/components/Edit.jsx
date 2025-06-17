import { useState } from "react";

function Edit({ editedTodo, handleEditedTodo, setShowModal }) {
  const [overrideEdited, setOverrideEdited] = useState(editedTodo);

  return (
    <article className="w-fit rounded-md p-4">
      <form className="flex w-100 flex-col justify-center gap-4 rounded-md border-1 border-[#CCCCCC] p-8">
        <p className="text-lg font-bold text-[#111111ee]">Update a Todo</p>
        <input
          className="rounded-md border-1 border-[#CCCCCC] px-4 py-2"
          type="text"
          placeholder="Title"
          value={overrideEdited.title}
          onChange={(e) => {
            setOverrideEdited((prev) => ({ ...prev, title: e.target.value }));
          }}
        />
        <textarea
          className="max-h-60 min-h-40 rounded-md border-1 border-[#CCCCCC] px-4 py-2"
          type="text"
          placeholder="Description"
          value={overrideEdited.description}
          onChange={(e) => {
            setOverrideEdited((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
        />
        <select
          value={overrideEdited.priority}
          onChange={(e) =>
            setOverrideEdited((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="first rounded-md border-1 border-[#CCCCCC] px-4 py-2"
        >
          <option value="" disabled className="text-gray-400">
            Priority...
          </option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <div className="flex justify-between gap-2">
          <button
            className="w-full cursor-pointer border-b-1 border-red-500 py-2 text-sm font-semibold text-red-500 uppercase transition hover:rounded-md hover:bg-red-500 hover:text-white"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button
            className="w-full cursor-pointer border-b-1 border-blue-500 py-2 text-sm font-semibold text-blue-500 uppercase transition hover:rounded-md hover:bg-blue-500 hover:text-white"
            role="button"
            onClick={(e) => handleEditedTodo(e, overrideEdited)}
          >
            Update Todo
          </button>
        </div>
      </form>
    </article>
  );
}

export default Edit;
