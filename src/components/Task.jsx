import { useProject } from "../contexts/ProjectProvider";
import TaskList from "./TaskList";
import TaskInput from "./TaskInput";

function Task() {
  const { selectedProject, handleAddTask, handleRemoveTask } = useProject();
  console.log("Selected project tasks:", selectedProject?.tasks);

  return (
    <div className="w-3/4 max-w-4x1">
      <TaskInput onAddTask={handleAddTask} />
      {selectedProject?.tasks.length > 0 && (
        <TaskList tasks={selectedProject.tasks} removeTask={handleRemoveTask} />
      )}
    </div>
  );
}

export default Task;
