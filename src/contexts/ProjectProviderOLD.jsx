import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import PermissionService from "../services/PermissionService";
import ProjectManager from "../managers/ProjectManager";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const permissionService = PermissionService.getInstance();
  const projectManager = new ProjectManager();

  const selectProject = (project) => {
    setSelectedProject(project);
  };



  // Fetch projects when the user changes
  useEffect(() => {
    if (user) {
      projectManager.fetchProjects()
        .then(fetchedProjects => {
          setProjects(fetchedProjects);
          permissionService.loadPermissions(user, fetchedProjects);
          if (fetchProjects && fetchedProjects.length > 0) {
            setSelectedProject(fetchedProjects[0]); // Select first project by default
          }
        })
        .catch(error => console.error("Failed to fetch projects:", error));
    } else {
      setProjects([]);
      setSelectedProject(null);
    }
  }, [user]);

  // Manage selected project changes
  useEffect(() => {
    if (selectedProject) {
      permissionService.loadPermissions([selectedProject]); // Update permissions for only the selected project
    }
  }, [selectedProject]);

  return (
    <ProjectContext.Provider value={{
      projects,
      selectProject,
      selectedProject,
      setProjects,
      setSelectedProject,
      fetchProjects: projectManager.fetchProjects,
      createProject: projectManager.createProject,
      updateProject: projectManager.updateProject,
      deleteProject: projectManager.deleteProject,
      canEdit: projectId => permissionService.canEdit(projectId),
      canDelete: projectId => permissionService.canDelete(projectId),
      canCreate: () => permissionService.canCreate(),
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);

export default ProjectProvider;

// import { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthProvider";
// import PermissionService from "../services/PermissionService";

// const ProjectContext = createContext(null);

// export const ProjectProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showProjectInput, setShowProjectInput] = useState(false);
//   const permissionService = PermissionService.getInstance(user);

//   useEffect(() => {
//     if (user) {
//       fetchProjects().then((loadedProjects) => {
//         setProjects(loadedProjects);
//         permissionService.loadPermissions(loadedProjects);
//       });
//     } else {
//       setProjects([]);
//       setSelectedProject(null);
//       setShowProjectInput(false);
//     }
//   }, [user]);

//   const fetchProjects = async () => {
//     const response = await fetch("http://localhost:3001/projects");
//     if (!response.ok) {
//       throw new Error(`Failed to fetch projects: ${response.status}`);
//     }
//     return response.json();
//   };

//   const selectProject = (project) => {
//     setSelectedProject(project);
//   };

//   const getAssignableUsersForProject = () => {
//     return users.filter(
//       (user) => !Object.values(selectedProject.access).flat().includes(user.id)
//     );
//   };

//   const getAssignableUsersForTasks = () => {
//     return (
//       users.filter(
//         (user) =>
//         Object.values(selectedProject.access).flat().includes(user.id)
//       ) &&
//       users.filter(
//         (user) =>
//           !selectedProject.tasks
//             .map((task) => task.assignee.userId)
//             .includes(user.id)
//       )
//     );
//   };

//   const handleAddRoleToUser = async (userId, role) => {
//     if (selectedProject && !selectedProject.access[role].includes(userId)) {
//       selectedProject.access[role].push(userId);
//       await updateProjectAccess(selectedProject.id, selectedProject.access);
//     }
//   };

//   const updateProjectAccess = async (access) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/projects/${selectedProject.id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...selectedProject, access }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`Failed to update project access: ${response.status}`);
//       }
//       fetchProjects();
//     } catch (error) {
//       console.error("Error updating project access:", error);
//     }
//   };

//   const handleAddTask = (newTaskDescription) => {
//     const newTask = {
//       id: Math.random(), // Simple unique ID generation for example purposes
//       description: newTaskDescription,
//       assignee: { userId: null } // Default no assignee
//     };
//     const updatedTasks = [...selectedProject.tasks, newTask];
//     updateProject = { ...selectedProject, tasks: updatedTasks };
//   };

//   const updateProject = async (projectId, updatedProject) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/projects/${projectId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedProject),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`Failed to update project: ${response.status}`);
//       }
//       fetchProjects();
//     } catch (error) {
//       console.error("Error updating project:", error);
//     }
//   };

//   const handleAssignTask = async (taskId, userId) => {
//     const task = selectedProject.tasks.find(t => t.id === taskId);
//     if (task && permissionService.canEdit(selectedProject.id)) {
//       task.assignee.userId = userId;
//       await updateTask(task);
//     }
//   };

//   const updateTask = async (task) => {
//     const updatedTasks = selectedProject.tasks.map(t =>
//       t.id === task.id ? { ...t, assignee: { userId: task.assignee.userId }} : t
//     );
//     try {
//       const response = await fetch(
//         `http://localhost:3001/projects/${selectedProject.id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...selectedProject, tasks: updatedTasks }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`Failed to update task: ${response.status}`);
//       }
//       fetchProjects();
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   const handleNewProject = () => {
//     if (permissionService.canCreate()) {
//       setSelectedProject({ name: "", description: "", date: "" }); // setting up a blank project
//       setShowProjectInput(true);
//     }
//   };

//   const handleEditProject = (setSelectedProject) => {
//     if (permissionService.canEdit(setSelectedProject.id)) {
//       setSelectedProject(setSelectedProject);
//       setShowProjectInput(true);
//     }
//   };

//   const handleCancelEditProject = () => {
//     setSelectedProject(null);
//     setShowProjectInput(false);
//   };

//   const handleSaveProject = async (projectData) => {
//     if (
//       !permissionService.canEdit(projectData.id) &&
//       !permissionService.canCreate()
//     ) {
//       console.error("User does not have permission to save project");
//       return;
//     }
//     const method = projectData.id ? "PUT" : "POST";
//     const endpoint = projectData.id
//       ? `http://localhost:3001/projects/${projectData.id}`
//       : "http://localhost:3001/projects";
//     try {
//       const response = await fetch(endpoint, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(projectData),
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to save project: ${response.status}`);
//       }
//       fetchProjects();
//       setSelectedProject(projectData); // Update or set the new project as selected
//       setShowProjectInput(false);
//     } catch (error) {
//       console.error("Error saving project:", error);
//     }
//   };

//   const handleRemoveProject = async (projectId) => {
//     if (!permissionService.canDelete(projectId)) {
//       console.error("User does not have permission to remove project");
//       return;
//     }
//     try {
//       const response = await fetch(
//         `http://localhost:3001/projects/${projectId}`,
//         { method: "DELETE" }
//       );
//       if (!response.ok) {
//         throw new Error(`Failed to remove project: ${response.status}`);
//       }
//       fetchProjects();
//       setSelectedProject(null);
//       setShowProjectInput(false);
//     } catch (error) {
//       console.error("Error removing project:", error);
//     }
//   };

//   return (
//     <ProjectContext.Provider
//       value={{
//         projects,
//         selectedProject,
//         showProjectInput,
//         selectProject,
//         getAssignableUsersForProject,
//         handleAddRoleToUser,
//         updateProjectAccess,
//         getAssignableUsersForTasks,
//         handleAddTask,
//         handleAssignTask,
//         updateTask,
//         handleNewProject,
//         handleEditProject,
//         handleSaveProject,
//         handleRemoveProject,
//         handleCancelEditProject,
//         canAddProjectRole: (projectId) =>
//           permissionService.canAddProjectRole(projectId),
//         canEdit: (projectId) => permissionService.canEdit(projectId),
//         canDelete: (projectId) => permissionService.canDelete(projectId),
//         canView: (projectId) => permissionService.canView(projectId),
//       }}
//     >
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProject = () => useContext(ProjectContext);

// export default ProjectProvider;
