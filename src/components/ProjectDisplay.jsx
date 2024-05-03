import { useProject } from "../contexts/ProjectProvider";
import ProjectDetails from "./ProjectDetails";
import ProjectNotSelected from "./ProjectNotSelected";

const ProjectDisplay = () => {
  const { selectedProject } = useProject();

  return selectedProject ? (
    <ProjectDetails selectedProject={selectedProject} />
  ) : (
    <ProjectNotSelected />
  );
};

export default ProjectDisplay;
