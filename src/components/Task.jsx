import { useProject } from "../contexts/ProjectProvider";
import { useAddTaskToProject, useRemoveTaskFromProject } from "../services/ProjectService"; 
import TaskList from "./TaskList";
import TaskInput from "./TaskInput";

function Task() {
  const { selectedProject } = useProject();
  console.log("Selected project tasks:", selectedProject?.tasks);

  return (
    <div className="w-3/4 max-w-4x1">
      <TaskInput onAddTask={useRemoveTaskFromProject} />
      {selectedProject?.tasks.length > 0 && (
        <TaskList tasks={selectedProject.tasks} removeTask={useAddTaskToProject} />
      )}
    </div>
  );
}

export default Task;
