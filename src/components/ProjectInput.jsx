import { useProjectEdit } from "../contexts/ProjectEditProvider";
import ProjectSelectUsers from "./ProjectSelectUsers";

const ProjectInput = () => {
  const {
    projectDetails,
    projectUsersList,
    eligibleUsersList,
    userChanges,
    loadingProjectUsers,
    loadingEligibleUsers,
    handleDetailChanges,
    addUserToProject,
    removeUserFromProject,
    handleSaveProject,
    handleCancelProject,
    setSearchQuery,
  } = useProjectEdit();

  return (
    <section className="w-3/4 max-w-4xl">
      <div className="text-xl md:text-2xl font-semibold flex justify-end space-x-2 w-full mb-4">
        <button
          className="bg-stone-300 hover:bg-red-500 rounded-md font-semibold px-4 py-2 focus:bg-red-800 text-stone-800 focus:text-stone-50"
          onClick={handleCancelProject}
        >
          Cancel
        </button>
        <button
          className="text-stone-100 bg-stone-800 rounded-md py-2 px-4 hover:bg-stone-600"
          onClick={handleSaveProject}
        >
          Save
        </button>
      </div>
      <input
        className="w-full bg-stone-200 rounded-md text-stone-500"
        value={projectDetails.name}
        onChange={handleDetailChanges}
        name="name"
        placeholder="Project Name"
      />
      <textarea
        className="w-full bg-stone-200 rounded-md text-stone-500"
        value={projectDetails.description}
        onChange={handleDetailChanges}
        name="description"
        placeholder="Description"
      />
      <input
        type="date"
        className="min-w-max max-w-sm rounded-md bg-stone-200 text-stone-500"
        value={projectDetails.date}
        onChange={handleDetailChanges}
        name="date"
      />
      {projectUsersList && eligibleUsersList && (
        <ProjectSelectUsers
          projectUsersList={projectUsersList}
          eligibleUsersList={eligibleUsersList}
          userChanges={userChanges}
          addUserToProject={addUserToProject}
          removeUserFromProject={removeUserFromProject}
          loadingProjectUsers={loadingProjectUsers}
          loadingEligibleUsers={loadingEligibleUsers}
          setSearchQuery={setSearchQuery}
        />
      )}
    </section>
  );
};

export default ProjectInput;
