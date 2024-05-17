import ProjectInput from "./ProjectInput";
import ProjectDisplay from "./ProjectDisplay";
import { useProject } from "../contexts/ProjectProvider";
import Task from "./Task";
import ProjectEditProvider from "../contexts/ProjectEditProvider";

const Project = () => {
  const { showProjectInput } = useProject();
  return (
    <>
      <section className="flex flex-col w-full p-12 items-center bg-green-200">
        <div className="w-3/4 max-w-4x1">
          {showProjectInput ? (
            <ProjectEditProvider>
              <ProjectInput />
            </ProjectEditProvider>
          ) : (
            <ProjectDisplay />
          )}
        </div>
        <hr className="my-8 rounded border-0 h-1 bg-stone-400 mx-8 w-3/4 max-w-4x1" />
      </section>
      <section className="flex flex-col w-full p-12 items-center bg-purple-200">
        {showProjectInput ? null : <Task />}
      </section>
    </>
  );
};

export default Project;
