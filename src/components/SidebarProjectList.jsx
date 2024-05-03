import React from "react";
import { useProject } from "../contexts/ProjectProvider";

const SidebarProjectList = ({ projects = [] }) => {
  const { handleSelectProject } = useProject();

  return (
    <div>
      <ul className="mx-auto max-w-56 px-4 md:px-8 py-2 text-center text-xl md:text-2xl truncate rounded-md ">
        {projects.map((project, index) => (
          <li key={index} className="flex justify-center items-center my-4 mx-2">
            <button
              onClick={() => handleSelectProject(project)}
              className="rounded-md text-stone-400 focus:bg-stone-300 focus:text-stone-800 hover:text-stone-100 px-4 py-2 min-w-xs font-bold"
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarProjectList;
