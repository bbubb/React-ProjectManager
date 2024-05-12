import { useState, useEffect } from "react";
import { useProject } from "../contexts/ProjectProvider";
import { useSaveProject } from "../services/ProjectService";
import ProjectAddUser from "./ProjectAddUser";
import ProjectRemoveUser from "./ProjectRemoveUser";

export default function ProjectInput() {
  const { selectedProject } = useProject();
  const saveProject = useSaveProject();

  const [projectDetails, setProjectDetails] = useState({
    name: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    if (selectedProject) {
      setProjectDetails({
        name: selectedProject.name,
        description: selectedProject.description,
        date: selectedProject.date,
      });
    } else {
      setProjectDetails({
        name: "",
        description: "",
        date: "",
      });
    }
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    saveProject.mutate({ ...selectedProject, ...projectDetails });
  };

  const handleCancel = () => {
    setProjectDetails({
      name: selectedProject?.name || "",
      description: selectedProject?.description || "",
      date: selectedProject?.date || "",
    });
    ProjectAddUser({handleCancel});
  };

  return (
    <section className="w-3/4 max-w-4xl">
      <div className="text-xl md:text-2xl font-semibold flex justify-end space-x-2 w-full mb-4">
        <button
          className="bg-stone-300 hover:bg-red-500 rounded-md font-semibold px-4 py-2 focus:bg-red-800 text-stone-800 focus:text-stone-50"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="text-stone-100 bg-stone-800 rounded-md py-2 px-4 hover:bg-stone-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <input
        className="w-full bg-stone-200 rounded-md text-stone-500"
        value={projectDetails.name}
        onChange={handleChange}
        placeholder="Project Name"
      />
      <textarea
        className="w-full bg-stone-200 rounded-md text-stone-500"
        value={projectDetails.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="date"
        className="min-w-max max-w-sm rounded-md bg-stone-200 text-stone-500"
        value={projectDetails.date}
        onChange={handleChange}
      />
      {selectedProject && (
        <div className="flex flex-row justify-between mt-12 space-x-2 w-full font-semibold text-sm md:text-base">
          <ProjectAddUser key={`add-user-${selectedProject?.id}`} /> 
          <ProjectRemoveUser key={`remove-user-${selectedProject?.id}`} />
        </div>
      )}
    </section>
  );
}
