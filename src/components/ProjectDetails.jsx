import { useProject } from "../contexts/ProjectProvider";
import { useDeleteProject } from "../services/ProjectService";

const ProjectDetails = ({ selectedProject }) => {
  const { handleShowProjectInput } = useProject();
  const {
    mutate: deleteProject,
    isLoading: deletingProject,
    isError: deleteError,
    error: deleteErrorDetails,
   } = useDeleteProject();

  const handleEditProject = () => {
    handleShowProjectInput(true);
  };

  const handleRemoveProject = () => {
    deleteProject(selectedProject.id);
  };

  return (
    <>
      <div className="w-3/4 max-w-4x1space-y-2 flex flex-col">
        <h2 className="text-3xl md:text-4xl text-stone-600 font-extrabold pt-2">
          {selectedProject?.name}
        </h2>
        <p className="text-lx md:text-2xl text-stone-500 font-semibold p-8">
          {selectedProject?.description}
        </p>
        <span className=" text-lg md:text-lx font-semibold text-stone-400">
          {selectedProject?.date}
        </span>
      </div>
      <div className="flex flex-row space-x-2 pt-4">
        <>
          <button
            className="text-stone-100 bg-stone-800 rounded-md py-2 px-4 hover:bg-stone-600 hover:text-stone-800"
            onClick={handleEditProject}
          >
            Edit
          </button>
          <button
            className="px-4 py-2  hover:bg-red-700 rounded-md"
            onClick={handleRemoveProject}
          >
            Remove
          </button>
        </>
      </div>
    </>
  );
};

export default ProjectDetails;
