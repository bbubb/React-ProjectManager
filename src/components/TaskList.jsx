import TaskAssignment from "./TaskAssignment";

const TaskList = ({ tasks, removeTask }) => {
  console.log("TaskList - Tasks:", tasks);

  return (
    <div className="text-xl md:text-2xl font-semibold bg-blue-300">
      <ul className="flex flex-col w-max my-8 py-2 px-8 bg-stone-100 text-stone-800 rounded-md">
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-start items-center space-x-8">
            <span className= "place-items-start">{task.description}</span>
            <div className= " snap-end flex flex-row">
            <TaskAssignment taskId={task.id} />
            <button
              className="px-4 py-2 hover:bg-red-700 rounded-md"
              onClick={() => removeTask(task.id)}
            >
              Clear
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
