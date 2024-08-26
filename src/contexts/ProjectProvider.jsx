import React, { createContext, useContext, useState, useEffect } from "react";
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
    refetch: refetchProjects,
    isLoading: loadingProjects,
    isError,
    error,
  } = ProjectService.useFetchProjectsByUserRole(user?.id);

  const permissions = usePermission(selectedProject?.id);

  useEffect(() => {
    if (projects && selectedProject) {
      const updatedProject = projects.find((p) => p.id === selectedProject.id);
      setSelectedProject(updatedProject);
    }
  }, [projects]);

  const handleSelectProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    console.log(
      "ProjectProvider handleSelectProject project:",
      project,
      " projectId:",
      projectId
    );
    setSelectedProject(project);
    handleShowProjectInput(false);
  };

  const handleShowProjectInput = (show) => setShowProjectInput(show);

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
    refetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);

export default ProjectProvider;
