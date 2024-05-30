import { useProject } from "../contexts/ProjectProvider";
import TaskList from "./TaskList";
import TaskInput from "./TaskInput";
import { useQueryClient } from "react-query";
import {
  useAddTaskToProject,
  useRemoveTaskFromProject,
} from "../services/ProjectService";

const Task = () => {
  const { selectedProject, refetchProjects } = useProject();
  const queryClient = useQueryClient();
  const { mutate: addTask } = useAddTaskToProject();
  const { mutate: removeTask } = useRemoveTaskFromProject();
  console.log("Selected project tasks:", selectedProject?.tasks);

  const handleAddTask = (taskDescription) => {
    addTask(
      { projectId: selectedProject.id, taskDescription },
      {
        onSuccess: () => {
          refetchProjects();
          queryClient.invalidateQueries(["project", selectedProject.id])
        },
      }
    );
  };

  const handleRemoveTask = (taskId) => {
    removeTask(
      { projectId: selectedProject.id, taskId },
      {
        onSuccess: () => {
          refetchProjects();
          queryClient.invalidateQueries(["project", selectedProject.id])
        },
      }
    );
  };

  if (!selectedProject) return null;

  return (
    <div className="w-3/4 max-w-4x1">
      <TaskInput onAddTask={handleAddTask} />
      {selectedProject?.tasks.length > 0 && (
        <TaskList
          tasks={selectedProject.tasks}
          onRemoveTask={handleRemoveTask}
        />
      )}
    </div>
  );
};

export default Task;