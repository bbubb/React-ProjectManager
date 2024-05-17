import React, { createContext, useContext, useState } from "react";
import * as ProjectService from "../services/ProjectService";
import { usePermission } from "../services/PermissionService";
import { useAuth } from "./AuthProvider";
import { useQueryClient } from "react-query";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [projectPermissions, setProjectPermissions] = useState({});
  const queryClient = useQueryClient();
  const {
    data: projects,
    isLoading: loadingProjects,
    isError,
    error,
  } = ProjectService.useFetchProjectsByUserRole(user?.id);

  const permissions = usePermission(selectedProject?.id);

  // Automatically select the first project when projects are loaded
  // useEffect(() => {
  //   if (projects && projects.length > && !selectedProject) {
  //     setSelectedProject(projects[0]);
  //   }
  // }, [projects, selectedProject]);

  const handleSelectProject = (project) => {
    // const project = projects.find((p) => p.id === projectId);
    console.log("ProjectProvider handleSelectProject project:", project);
    setSelectedProject(project);
    handleShowProjectInput(false);
  };

  const handleShowProjectInput = (show) => setShowProjectInput(show);

  const refreshProjects = () => {
    queryClient.invalidateQueries("projects-by-user", user.id);
  }

  const value = {
    projects,
    permissions,
    selectedProject,
    setSelectedProject,
    showProjectInput,
    handleSelectProject,
    handleShowProjectInput,
    loadingProjects,
    projectPermissions,
    isError,
    error,
    refreshProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);

export default ProjectProvider;