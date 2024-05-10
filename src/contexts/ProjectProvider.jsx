import React, { createContext, useContext, useState, useEffect } from "react";
import * as ProjectService from "../services/ProjectService";
import { usePermission } from "../services/PermissionService";
import { useAuth } from "./AuthProvider";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [projectPermissions, setProjectPermissions] = useState({});
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

  const handleSelectProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project);
  };

  const handleShowProjectInput = (show) => setShowProjectInput(show);

  const value = {
    projects,
    permissions,
    selectedProject,
    showProjectInput,
    handleSelectProject,
    handleShowProjectInput,
    loadingProjects,
    projectPermissions,
    isError,
    error,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);

export default ProjectProvider;