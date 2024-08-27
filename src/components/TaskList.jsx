import TaskAssignment from "./TaskAssignment";

const TaskList = ({ tasks, onRemoveTask }) => {
  console.log("TaskList - Tasks:", tasks);

  const handleRemoveTask = (taskId) => {
    onRemoveTask(taskId);
  };

  return (
    <div className="text-xl md:text-2xl font-semibold">
      <ul className="flex flex-col w-max my-8 py-2 px-8 bg-stone-100 text-stone-800 rounded-md">
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-start items-center space-x-8 my-1">
            <span className="place-items-start">{task.description}</span>
            <div className=" snap-end flex flex-row">
              <TaskAssignment taskId={task.id} />
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 mx-1 rounded "
                onClick={() => handleRemoveTask(task.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
