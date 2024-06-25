import { useRef } from "react";

const TaskInput = ({ onAddTask }) => {
  const inputRef = useRef();

  const handleAddTaskEvent = () => {
    const newTaskDescription = inputRef.current.value;
    if (newTaskDescription) {
      onAddTask(newTaskDescription);
      inputRef.current.value = ""; // clear input field after adding task
    }
  };

  // if (!selectedProject) return null;

  return (
    <div className=" w-3/4 max-w-4x1 bg-cyan-300">
      <h2 className="text-2xl md:text-3xl text-stone-600 font-extrabold pb-2">
        Tasks 
        {/* for {selectedProject.name} */}
      </h2>
      <div className="flex justify-start w-2/5 text-xl md:text-2xl">
        <input
          ref={inputRef}
          className="w-full min-w-max bg-stone-200 rounded-md text-stone-600 font-semibold p-2 outline-blue-500"
          placeholder="Enter new task"
        />
        <button
          onClick={handleAddTaskEvent}
          className="mx-2 px-4 text-stone-600 font-semibold min-w-fit rounded-md hover:bg-stone-400 focus:bg-stone-900 focus:text-stone-200"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskInput;