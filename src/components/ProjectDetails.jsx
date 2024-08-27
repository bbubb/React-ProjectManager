import { useState } from "react";
import { useProject } from "../contexts/ProjectProvider";
import { useDeleteProject } from "../services/ProjectService";
import ConfirmationModal from "./ConfirmationModal";

const ProjectDetails = ({ selectedProject }) => {
  console.log("ProjectDetails selectedProject:", selectedProject);
  const { handleShowProjectInput, handleSelectProject, refetchProjects } = useProject();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = () => {
    deleteProject(selectedProject.id, {
      onSuccess: () => {
        refetchProjects();
        handleSelectProject(null);
        handleShowProjectInput(false);
      },
    });
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="w-3/4 max-w-4x1space-y-2 flex flex-col">
        <h2 className="text-3xl md:text-4xl text-stone-600 font-extrabold pt-2">
          {selectedProject?.name}
        </h2>
        <p className="text-lx md:text-2xl text-stone-500 font-semibold p-8 whitespace-pre-wrap">
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
      <ConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />
    </>
  );
};

export default ProjectDetails;
