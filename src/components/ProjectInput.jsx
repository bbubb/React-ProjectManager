import { useState } from "react";
import { useProject } from "../contexts/ProjectProvider";
import UserAndRoleAssignment from "./UserAndRoleAssignment";

export default function ProjectInput() {
  const { selectedProject, handleSaveProject, handleCancelEditProject } =
    useProject();

  const [projectDetails, setProjectDetails] = useState({
    name: selectedProject?.name || "",
    description: selectedProject?.description || "",
    date: selectedProject?.date || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleSaveProject({
      ...selectedProject,
      ...projectDetails,
    });
  };

  return (
    // <section className="flex flex-col w-full p-12 items-center">
    <section>
      <div className="w-3/4 max-w-4x1">
        {/* <div> */}
        <div className="text-xl md:text-2xl font-semibold flex justify-end space-x-2 w-full mb-4">
          <button
            className="text-stone-800 px-4 py-2 hover:bg-stone-200 rounded-md"
            onClick={handleCancelEditProject}
          >
            Cancel
          </button>
          <button
            className="text-stone-100 bg-stone-800 rounded-md py-2 px-4 hover:bg-stone-600 hover:text-stone-800"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
        <div className="space-y-2 text-2xl md:text-3xl">
          <input
            className="w-full bg-stone-200 rounded-md text-stone-500 font-semibold border-b-2 border-stone-300 focus:border-stone-600 outline-none p-2 placeholder-stone-500"
            value={projectDetails.name}
            onChange={handleChange}
            placeholder="Project Name"
          />
          <textarea
            className="w-full bg-stone-200 rounded-md text-stone-500 font-semibold border-b-2 border-stone-300 focus:border-stone-600 outline-none p-2 placeholder-stone-500"
            value={projectDetails.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            type="date"
            className=" min-w-max max-w-sm rounded-md bg-stone-200 text-stone-500 font-semibold border-b-2 border-stone-300 focus:border-stone-600 outline-none p-2"
            value={projectDetails.date}
            onChange={handleChange}
          />
        </div>
        {selectedProject && <UserAndRoleAssignment />}
      </div>
    </section>
  );
}
