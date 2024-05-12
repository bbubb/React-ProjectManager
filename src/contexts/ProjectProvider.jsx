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
    handleShowProjectInput(false);
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


// import React, { createContext, useContext, useState, useEffect } from "react";
// import * as ProjectService from "../services/ProjectService";
// import { usePermission } from "../services/PermissionService";
// import { useAuth } from "./AuthProvider";

// const ProjectContext = createContext();

// export const ProjectProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showProjectInput, setShowProjectInput] = useState(false);
//   const {
//     data: projects,
//     isLoading: loadingProjects,
//     isError: errorLoadingProjects,
//     refetch: refetchProjects,
//   } = ProjectService.useFetchProjectsByUserRole(user?.id);

//   const { permissions, loading: loadingPermissions } = usePermission(
//     selectedProject?.id
//   );

//   const addUserToProject = ProjectService.useAddUserToProject({
//     onSuccess: () => refetchProjects(),
//   });
//   const removeUserFromProject = ProjectService.useRemoveUserFromProject({
//     onSuccess: () => refetchProjects(),
//   });

//   const handleSelectProject = (projectId) => {
//     const project = projects.find((p) => p.id === projectId);
//     setSelectedProject(project);
//     setShowProjectInput(false);
//   };

//   const handleShowProjectInput = (show) => {
//     setShowProjectInput(show);
//   };

//   const fetchProjectDetails = async (projectId) => {
//     try {
//       const updatedProject = await ProjectService.fetchProjectById(projectId);
//       setSelectedProject(updatedProject);
//     } catch (error) {
//       console.error("Failed to fetch project details:", error);
//     }
//   };

//   const handleAddUser = async ({ projectId, userId, role }) => {
//     await addUserToProject.mutateAsync({
//       projectId: projectId,
//       userId: userId,
//       role: role,
//     });
//     fetchProjectDetails(projectId);
//   };

//   const handleRemoveUser = async ({ projectId, userId }) => {
//     await removeUserFromProject.mutateAsync({ projectId, userId });
//     fetchProjectDetails(projectId);
//   };

//   const contextValue = {
//     selectedProject,
//     projects,
//     showProjectInput,
//     permissions,
//     loadingProjects,
//     loadingPermissions,
//     errorLoadingProjects,
//     handleSelectProject,
//     handleShowProjectInput,
//     handleAddUser,
//     handleRemoveUser,
//   };

//   return (
//     <ProjectContext.Provider value={contextValue}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProject = () => useContext(ProjectContext);

// export default ProjectProvider;
