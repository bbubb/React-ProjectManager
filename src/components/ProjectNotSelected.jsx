import noProjectImg from "../assets/no-projects.png";
import { useProject } from "../contexts/ProjectProvider";

const ProjectNotSelected = () => {
  const { handleShowProjectInput } = useProject();

  const handleCreateNewProject = () => {
    handleShowProjectInput(true);
  };

  return (
    <div className="w-3/4 max-w-4xl flex flex-col items-center">
      <img src={noProjectImg} alt="No Projects" className="w-1/2" />
      <h2 className="text-3xl md:text-4xl text-stone-600 font-extrabold pt-2">
        No Project Selected
      </h2>
      <p className="text-xl md:text-2xl text-stone-500 font-semibold p-8">
        Select a project or get started with a new one
      </p>
      <button
        className="max-w-xs min-w-max px-4 py-2 bg-stone-800 text-stone-100 rounded-md hover:bg-stone-600 focus:bg-stone-900 focus:text-stone-200 font-semibold"
        onClick={handleCreateNewProject}
      >
        Create New Project
      </button>
    </div>
  );
};

export default ProjectNotSelected;