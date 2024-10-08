import { useQueryClient } from "react-query";
import { useProject } from "../contexts/ProjectProvider";
import {
  useAddTaskToProject,
  useRemoveTaskFromProject,
} from "../services/ProjectService";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

const Task = () => {
  const { selectedProject, refetchProjects, handleSelectProject } = useProject();
  const queryClient = useQueryClient();
  const { mutate: addTask } = useAddTaskToProject();
  const { mutate: removeTask } = useRemoveTaskFromProject();
  console.log("Selected project tasks:", selectedProject?.tasks);

  const handleAddTask = (taskDescription) => {
    addTask(
      { projectId: selectedProject.id, taskDescription },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["project", selectedProject.id]);
          refetchProjects();
          handleSelectProject(selectedProject.id);
          console.log("Task added to project:", selectedProject.id);
        },
      }
    );
  };

  const handleRemoveTask = (taskId) => {
    removeTask(
      { projectId: selectedProject.id, taskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["project", selectedProject.id]);
          refetchProjects();
          handleSelectProject(selectedProject.id);
          console.log("Task removed from project:", selectedProject.id);
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