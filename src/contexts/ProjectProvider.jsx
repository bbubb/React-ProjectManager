import React, { createContext, useContext, useState, useEffect } from 'react';
import * as ProjectService from '../services/ProjectService';
import { useFetchProjectEligibleUsers, useFetchTaskEligibleUsers } from '../services/UserService';
import { usePermission } from '../services/PermissionService';
import { useAuth } from './AuthProvider'; // Assuming AuthProvider gives user context

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectInput, setShowProjectInput] = useState(false);
    const [error, setError] = useState('');

    // Fetch projects when the component mounts or user changes
    const { data: fetchedProjects, isError, error: fetchError } = ProjectService.useFetchProjectsByUserRole(user?.id);

    useEffect(() => {
        if (isError) {
            setError(fetchError?.message || 'Failed to fetch projects.');
        }
    }, [isError, fetchError]);

    useEffect(() => {
        if (fetchedProjects) {
            setProjects(fetchedProjects);
            if (!selectedProject && fetchedProjects.length > 0) {
                setSelectedProject(fetchedProjects[0]); // Automatically select the first project on load
            }
        }
    }, [fetchedProjects, selectedProject]);

    const permissions = usePermission(selectedProject?.id);

    const handleSelectProject = (project) => {
        setSelectedProject(project);
    };

    const handleShowProjectInput = (show) => {
        setShowProjectInput(show);
    };

    // Implementing all CRUD operations from ProjectService
    const handleAddProject = async (projectData) => {
        await ProjectService.useAddProject().mutateAsync(projectData, {
            onSuccess: (newProject) => {
                setProjects(prev => [...prev, newProject]);
                setSelectedProject(newProject); // Optionally select the new project
                setShowProjectInput(false);
            },
            onError: (err) => setError('Failed to add project: ' + err.message)
        });
    };

    const handleUpdateProject = async (projectId, projectData) => {
        await ProjectService.useUpdateProject(projectId, projectData).mutateAsync(null, {
            onSuccess: (updatedProject) => {
                setProjects(prev => prev.map(project => project.id === projectId ? updatedProject : project));
                setSelectedProject(updatedProject);
            },
            onError: (err) => setError('Failed to update project: ' + err.message)
        });
    };

    const handleDeleteProject = async (projectId) => {
        await ProjectService.useDeleteProject(projectId).mutateAsync(null, {
            onSuccess: () => {
                setProjects(prev => prev.filter(project => project.id !== projectId));
                setSelectedProject(null); // Clear selection if the deleted project was selected
            },
            onError: (err) => setError('Failed to delete project: ' + err.message)
        });
    };

    // Additional task-related operations
    const handleAddTaskToProject = async (projectId, taskData) => {
        await ProjectService.useAddTaskToProject(projectId, taskData).mutateAsync(null, {
            onSuccess: () => setError(''),
            onError: (err) => setError('Failed to add task: ' + err.message)
        });
    };

    // Including other functions as necessary...
    // Plus, integrate user and task services functionalities where applicable

    const value = {
        projects,
        selectedProject,
        permissions,
        loadingProjects: isError,
        error,
        handleSelectProject,
        handleShowProjectInput,
        handleAddProject,
        handleUpdateProject,
        handleDeleteProject,
        handleAddTaskToProject,
        // More handlers as added...
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);

export default ProjectProvider;


// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthProvider";
// import ApiService from "../services/ApiService";
// import ProjectManager from "../managers/ProjectManager";
// import TaskManager from "../managers/TaskManager";
// import PermissionService from "../services/PermissionService";

// const ProjectContext = createContext();

// export const ProjectProvider = ({ children }) => {
//   const { user } = useAuth();
//   const apiService = new ApiService("http://localhost:3001");
//   const projectManager = new ProjectManager(apiService);
//   const taskManager = new TaskManager(apiService, projectManager);
//   const permissionService = new PermissionService(apiService, user?.id);
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showProjectInput, setShowProjectInput] = useState(false);
//   const [currentProjectPermissions, setCurrentProjectPermissions] = useState(
//     {}
//   );
//   const [permissions, setPermissions] = useState({});

//   useEffect(() => {
//     async function loadInitialData() {
//       if (user) {
//         try {
//           const fetchedProjects = await projectManager.fetchProjects();
//           // const loadedPermissions = 
//           await permissionService.loadPermissions(user.id);
//           setProjects(fetchedProjects);
//           // setPermissions(loadedPermissions);
//         } catch (error) {
//           console.error("Failed to fetch projects or load permissions:", error);
//           setProjects([]);
//           // setPermissions({});
//           setSelectedProject(null);
//         }
//       } else {
//         setProjects([]);
//         // setPermissions({});
//         setSelectedProject(null);
//         setShowProjectInput(false);
//       }
//     }
//     loadInitialData();
//   }, [user]);

//   const selectProject = (project) => {
//     setSelectedProject(project);
//     // const scopedPermissions = permissions[project?.id] || {};
//     // setCurrentProjectPermissions(scopedPermissions);
//   };

//   const fetchProjectById = async (projectId = selectedProject?.id) => {
//     try {
//       return await projectManager.fetchProjectById(projects, projectId);
//     } catch (error) {
//       console.error("Failed to fetch project by ID from PP:", error);
//       throw error;
//     }
//   };

//   const addProject = async (projectData) => {
//     if (permissionService.canCreateNewProject()) {
//       const updatedProjects = await projectManager.addProject(projectData);
//       setProjects(updatedProjects);
//       setSelectedProject(updatedProjects.find((p) => p.id === projectData.id)); // Optionally select the new project
//       setShowProjectInput(false);
//     }
//   };

//   const updateProject = async (
//     projectId = selectedProject?.id,
//     projectData
//   ) => {
//     if (permissionService.canEdit(projectId)) {
//       const updatedProjects = await projectManager.updateProject(
//         projectId,
//         projectData
//       );
//       setProjects(updatedProjects);
//       setSelectedProject(updatedProjects.find((p) => p.id === projectId));
//       setShowProjectInput(false);
//     }
//   };

//   const removeProject = async (projectId = selectedProject?.id) => {
//     if (permissionService.canDelete(projectId)) {
//       const updatedProjects = await projectManager.removeProject(projectId);
//       setProjects(updatedProjects);
//       setSelectedProject(null);
//       setShowProjectInput(false);
//     }
//   };

//   //   const getEligibleUsersForTask = async (
//   //     projectId = selectedProject?.id,
//   //     taskId
//   //   ) => {
//   //     console.log("projectId", projectId);
//   //     console.log("taskId", taskId);
//   //     console.log("selectedProject", selectedProject);
//   //     console.log("selectedProject?.tasks", selectedProject?.tasks);

//   //     if (selectedProject && permissionService.canView(projectId)) {
//   //       return await taskManager.getEligibleUsersForTask(projectId, taskId);
//   //     } else {
//   //       throw new Error("No project selected or insufficient permissions");
//   //     }
//   //   };

//   const getEligibleUsersForTask = async (projectId, taskId) => {
//     console.log("selectedProject", selectedProject);
//     if (!selectedProject) {
//       // !permissionService.permissions[selectedProject.id].canView) {
//       throw new Error("No project selected");
//     }
//     console.log("selectedProject.id", selectedProject.id);
//     console.log("taskId", taskId);
//     // permissionService.permissions[selectedProject.id];
//     // console.log(
//     //   `Permissions for project ${selectedProject.id}:`,
//     //   permissionService.permissions[selectedProject.id]
//     // );
//     // if (!permissionService.canView(selectedProject.id)) {
//     //   const errMsg = `Insufficient permissions to view tasks for project ${
//     //     selectedProject.id
//     //   }. Permissions: ${JSON
//     //     .stringify
//     //     // permissionService.permissions[selectedProject.id]
//     //     ()}`;
//     //   console.error(errMsg);
//     //   throw new Error("Insufficient permissions");
//     // }

//     return taskManager.getEligibleUsersForTask(selectedProject, taskId);
//   };

//   const assignUserToTask = async (
//     projectId = selectedProject?.id,
//     taskId,
//     userId
//   ) => {
//     if (permissionService.canEdit(projectId)) {
//       await taskManager.assignUserToTask(projectId, taskId, userId);
//     }
//   };

//   const addTask = async (projectId = selectedProject?.id, taskDescription) => {
//     if (permissionService.canEdit(projectId)) {
//       await taskManager.addTask(projectId, taskDescription);
//     }
//   };

//   const removeTask = async (projectId = selectedProject?.id, taskId) => {
//     if (permissionService.canEdit(projectId)) {
//       await taskManager.removeTask(projectId, taskId);
//     }
//   };

//   const handleShowProjectInput = (show) => {
//     setShowProjectInput(show);
//   };

//   return (
//     <ProjectContext.Provider
//       value={{
//         projects,
//         selectProject,
//         selectedProject,
//         setSelectedProject,
//         showProjectInput,
//         setShowProjectInput,
//         handleShowProjectInput,
//         fetchProjectById,
//         addProject,
//         updateProject,
//         removeProject,
//         assignUserToTask,
//         addTask,
//         removeTask,
//         getEligibleUsersForTask,
//         currentProjectPermissions
//       }}
//     >
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProject = () => useContext(ProjectContext);

// export default ProjectProvider;

// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import { useAuth } from './AuthProvider';
// // import PermissionService from '../services/PermissionService';
// // import ProjectManager from '../managers/ProjectManager';
// // import TaskManager from '../managers/TaskManager'; // If using TaskManager

// // const ProjectContext = createContext();

// // export const ProjectProvider = ({ children }) => {
// //     const { user } = useAuth();
// //     const [projects, setProjects] = useState([]);
// //     const [selectedProject, setSelectedProject] = useState(null);

// //     const permissionService = PermissionService.getInstance();
// //     const projectManager = new ProjectManager();
// //     const taskManager = new TaskManager(); // If using TaskManager

// //     useEffect(() => {
// //         if (user) {
// //             projectManager.fetchProjects().then(fetchedProjects => {
// //                 setProjects(fetchedProjects);
// //                 if (fetchedProjects.length > 0) {
// //                     setSelectedProject(fetchedProjects[0]);
// //                     permissionService.loadPermissions(user, fetchedProjects);
// //                 }
// //             }).catch(error => {
// //                 console.error("Failed to fetch projects:", error);
// //                 setProjects([]);
// //                 setSelectedProject(null);
// //             });
// //         } else {
// //             setProjects([]);
// //             setSelectedProject(null);
// //         }
// //     }, [user]);

// //     useEffect(() => {
// //         if (selectedProject) {
// //             permissionService.loadPermissions(user, [selectedProject]);
// //         }
// //     }, [selectedProject, user]);

// //     const handleProjectUpdate = async (projectId, projectData) => {
// //         if (permissionService.canEdit(projectId)) {
// //             const updatedProjects = await projectManager.updateProject(projectId, projectData);
// //             setProjects(updatedProjects);
// //             return updatedProjects;
// //         } else {
// //             throw new Error("Unauthorized to edit project");
// //         }
// //     };

// //     const handleProjectCreation = async (projectData) => {
// //         if (permissionService.canCreate()) {
// //             const updatedProjects = await projectManager.createProject(projectData);
// //             setProjects(updatedProjects);
// //             return updatedProjects;
// //         } else {
// //             throw new Error("Unauthorized to create project");
// //         }
// //     };

// //     const handleProjectRemoval = async (projectId) => {
// //         if (permissionService.canDelete(projectId)) {
// //             const updatedProjects = await projectManager.removeProject(projectId);
// //             setProjects(updatedProjects);
// //             return updatedProjects;
// //         } else {
// //             throw new Error("Unauthorized to delete project");
// //         }
// //     };

// //     const handleTaskAssignment = async (taskId, userId) => {
// //         if (selectedProject && permissionService.canAssignTask(selectedProject.id)) {
// //             await taskManager.assignUserToTask(selectedProject.id, taskId, userId); // Assuming TaskManager handles this
// //             // Optionally fetch projects again if needed or manage state update
// //             return "Task assigned successfully";
// //         } else {
// //             throw new Error("Unauthorized to assign task");
// //         }
// //     };

// //     const getEligibleUsersForTasks = (taskId) => {
// //         if (selectedProject && permissionService.canView(selectedProject.id)) {
// //             return taskManager.getEligibleUsersForTasks(taskId, selectedProject.id); // Assuming TaskManager handles user filtering
// //         } else {
// //             return [];
// //         }
// //     };

// //     return (
// //         <ProjectContext.Provider value={{
// //             projects,
// //             selectedProject,
// //             setSelectedProject,
// //             handleProjectUpdate,
// //             handleProjectCreation,
// //             handleProjectRemoval,
// //             handleTaskAssignment,
// //             getEligibleUsersForTasks,
// //             selectProject: setSelectedProject // Exposing method to change selected project
// //         }}>
// //             {children}
// //         </ProjectContext.Provider>
// //     );
// // };

// // export const useProject = () => useContext(ProjectContext);

// // export default ProjectProvider;

// // // import React, { createContext, useContext, useState, useEffect } from 'react';
// // // import { useAuth } from './AuthProvider';
// // // import PermissionService from '../services/PermissionService';
// // // import ProjectManager from '../managers/ProjectManager';

// // // const ProjectContext = createContext();

// // // export const ProjectProvider = ({ children }) => {
// // //     const { user } = useAuth();
// // //     const [projects, setProjects] = useState([]);
// // //     const [selectedProject, setSelectedProject] = useState(null);

// // //     const permissionService = PermissionService.getInstance();
// // //     const projectManager = new ProjectManager(permissionService);

// // //     const selectProject = (project) => {
// // //         setSelectedProject(project);
// // //       };

// // //     // Fetch projects when the user changes
// // //     useEffect(() => {
// // //         const fetchAndSetProjects = async () => {
// // //             try {
// // //                 const fetchedProjects = await projectManager.fetchProjects();
// // //                 setProjects(fetchedProjects);
// // //                 if (fetchedProjects.length > 0) {
// // //                     setSelectedProject(fetchedProjects[0]);
// // //                     permissionService.loadPermissions(user, fetchedProjects);
// // //                 }
// // //             } catch (error) {
// // //                 console.error("Failed to fetch projects:", error);
// // //                 setProjects([]);
// // //                 setSelectedProject(null);
// // //             }
// // //         };

// // //         if (user) {
// // //             fetchAndSetProjects();
// // //         } else {
// // //             setProjects([]);
// // //             setSelectedProject(null);
// // //         }
// // //     }, [user]);

// // //     // Manage selected project changes
// // //     useEffect(() => {
// // //         if (selectedProject) {
// // //             permissionService.loadPermissions(user, [selectedProject]);
// // //         }
// // //     }, [selectedProject, user]);

// // //     const handleAddRoleToUser = async (userId, role) => {
// // //         if (selectedProject && permissionService.canAddProjectRole(selectedProject.id)) {
// // //             const updatedAccess = {...selectedProject.access, [role]: [...selectedProject.access[role] || [], userId]};
// // //             return projectManager.updateProject(selectedProject.id, {...selectedProject, access: updatedAccess})
// // //                 .then(setProjects)
// // //                 .catch(error => console.error("Failed to update project access:", error));
// // //         } else {
// // //             console.error("Unauthorized to add role");
// // //         }
// // //     };

// // //     const handleProjectUpdate = (projectId, projectData) => {
// // //         if (permissionService.canEdit(projectId)) {
// // //             return projectManager.updateProject(projectId, projectData)
// // //                 .then(updatedProjects => setProjects(updatedProjects));
// // //         } else {
// // //             console.error("Unauthorized to edit project");
// // //             return Promise.reject("Unauthorized");
// // //         }
// // //     };

// // //     const handleProjectCreation = (projectData) => {
// // //         if (permissionService.canCreate()) {
// // //             return projectManager.createProject(projectData)
// // //                 .then(updatedProjects => setProjects(updatedProjects));
// // //         } else {
// // //             console.error("Unauthorized to create project");
// // //             return Promise.reject("Unauthorized");
// // //         }
// // //     };

// // //     const handleProjectRemoval = (projectId) => {
// // //         if (permissionService.canDelete(projectId)) {
// // //             return projectManager.removeProject(projectId)
// // //                 .then(updatedProjects => setProjects(updatedProjects));
// // //         } else {
// // //             console.error("Unauthorized to delete project");
// // //             return Promise.reject("Unauthorized");
// // //         }
// // //     };

// // //     const handleTaskAssignment = (taskId, userId) => {
// // //         if (selectedProject && permissionService.canAssignTask(selectedProject.id)) {
// // //             const task = selectedProject.tasks.find(t => t.id === taskId);
// // //             if (task) {
// // //                 const updatedTasks = selectedProject.tasks.map(t => t.id === taskId ? {...t, assignee: { userId }} : t);
// // //                 return projectManager.updateProject(selectedProject.id, {...selectedProject, tasks: updatedTasks})
// // //                     .then(setProjects)
// // //                     .catch(error => console.error("Failed to update task:", error));
// // //             }
// // //         } else {
// // //             console.error("Unauthorized to assign task");
// // //         }
// // //     };

// // //     return (
// // //         <ProjectContext.Provider value={{
// // //             projects,
// // //             setProjects,
// // //             selectProject,
// // //             selectedProject,
// // //             setSelectedProject,
// // //             handleProjectUpdate,
// // //             handleProjectCreation,
// // //             handleProjectRemoval,
// // //             handleTaskAssignment
// // //         }}>
// // //             {children}
// // //         </ProjectContext.Provider>
// // //     );
// // // };

// // // export const useProject = () => useContext(ProjectContext);

// // // export default ProjectProvider;
