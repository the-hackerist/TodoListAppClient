function Add({ todo, setTodo, handleAddTodo, setShowModal }) {
  return (
    <article className="w-fit rounded-md p-4">
      <form className="flex w-100 flex-col justify-center gap-4 rounded-md border-1 border-[#CCCCCC] p-8">
        <p className="text-lg font-bold text-[#111111ee]">Add a Todo</p>
        <input
          className="rounded-md border-1 border-[#CCCCCC] px-4 py-2"
          type="text"
          placeholder="Title"
          value={todo.title}
          onChange={(e) => {
            setTodo((prev) => ({ ...prev, title: e.target.value }));
          }}
        />
        <textarea
          className="max-h-60 min-h-40 rounded-md border-1 border-[#CCCCCC] px-4 py-2"
          type="text"
          placeholder="Description"
          value={todo.description}
          onChange={(e) => {
            setTodo((prev) => ({ ...prev, description: e.target.value }));
          }}
        />

        <select
          value={todo.priority}
          onChange={(e) =>
            setTodo((prev) => ({ ...prev, priority: e.target.value }))
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
            onClick={() => {
              setShowModal(false);
              setTodo({ title: "", description: "", priority: "" });
            }}
          >
            Cancel
          </button>

          <button
            className="w-full cursor-pointer border-b-1 border-blue-500 py-2 text-sm font-semibold text-blue-500 uppercase transition hover:rounded-md hover:bg-blue-500 hover:text-white"
            role="button"
            onClick={handleAddTodo}
          >
            Add Todo
          </button>
        </div>
      </form>
    </article>
  );
}

export default Add;
