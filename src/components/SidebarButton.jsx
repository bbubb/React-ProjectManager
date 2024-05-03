import { useProject } from "../contexts/ProjectProvider";

const ButtonSidebar = ({ message }) => {
    const { handleNewProject } = useProject();

  return (
    <button
      onClick={handleNewProject}
      className=" mx-auto max-w-56 px-4 md:px-8 py-2 text-center text-xl md:text-2xl truncate rounded-md bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-100"
    >
      {message}
    </button>
  );
}

export default ButtonSidebar;