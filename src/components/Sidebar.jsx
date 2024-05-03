import { useProject } from "../contexts/ProjectProvider";
import SidebarButton from "./SidebarButton";
import SidebarProjectList from "./SidebarProjectList";

function Sidebar() {
  const { projects } = useProject();
  console.log("Sidebar - Projects:", projects);

  return (
    <aside className="flex flex-col w-1/3 max-w-96 px-8 py-16 bg-stone-900 text-stone-50  rounded-r-xl">
      <h2 className="mb-8 font-bold uppercase text-center text-2xl md:text-4xl truncate text-stone-200">
        Projects
      </h2>
      <SidebarButton message="+ Add Project" />
      <SidebarProjectList projects={projects} />
    </aside>
  );
}

export default Sidebar;
