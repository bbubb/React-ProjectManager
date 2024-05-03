// ProjectManager.js
class ProjectManager {
  constructor(apiService) {
    this.apiService = apiService;
    this.projects = [];
  }

  async fetchProjects() {
    try {
      return await this.apiService.get("/projects");
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      throw error; // Rethrowing the error to be handled by the caller
    }
  }

  async fetchProjectById(projects, projectId) {
    if (!projects || !projectId)
      throw new Error("No projects or project ID provided");

    const cachedProject = projects.find((p) => p.id === parseInt(projectId));
    if (cachedProject) return cachedProject;

    try {
      const fetchedProject = await this.apiService.get(
        `/projects/${projectId}`
      );
      return fetchedProject;
    } catch (error) {
      console.error("Error fetching project by ID:", error);
      throw error;
    }
  }

  async fetchProjectsByUserRole(userId) {
    try {
      return await this.apiService.get(
        "/projects",
        (project) =>
          project.access.admin.includes(userId) ||
          project.access.editor.includes(userId) ||
          project.access.reader.includes(userId)
      );
    } catch (error) {
      console.error("Error fetching projects by user role:", error.message);
      throw error;
    }
  }

  async fetchUsersNotInProject(projectId) {
    const allUsers = await this.apiService.get("/users");
    const project = await this.fetchProjectById(projectId);
    const projectUserIds = [].concat(...Object.values(project.access));
    return allUsers.filter((user) => !projectUserIds.includes(user.id));
  }

  async addProject(projectData) {
    try {
      return await this.apiService.post("/projects", projectData);
    } catch (error) {
      console.error("Error adding project:", error.message);
      throw error;
    }
  }

  async updateProject(projectId, projectData) {
    try {
      return await this.apiService.put(`/projects/${projectId}`, projectData);
    } catch (error) {
      console.error("Error updating project:", error.message);
      throw error;
    }
  }

  async removeProject(projectId) {
    try {
      return await this.apiService.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error removing project:", error.message);
      throw error;
    }
  }
}

export default ProjectManager;

// import TaskManager from "./TaskManager";

// export default function ProjectManager() {
//   const baseUrl = "http://localhost:3001/projects";

//   // Fetch all projects from the backend
//   const fetchProjects = async () => {
//     try {
//       const response = await fetch(baseUrl);
//       if (!response.ok)
//         throw new Error(`Failed to fetch projects: ${response.status}`);

//       // Check if the response is JSON
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new TypeError("Oops, we haven't got JSON!");
//       }

//       return await response.json(); // Return the loaded projects directly
//     } catch (error) {
//       console.error("Error fetching projects:", error.message);
//       return []; // Return an empty array in case of error
//     }
//   };

//   // Add a new project
//   const addProject = async (projectData) => {
//     try {
//       const response = await fetch(baseUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(projectData),
//       });
//       if (!response.ok)
//         throw new Error(`Failed to add project: ${response.status}`);
//       return await fetchProjects(); // Return updated list of projects
//     } catch (error) {
//       console.error("Error adding project:", error);
//       return [];
//     }
//   };

//   // Update an existing project
//   const updateProject = async (projectId, projectData) => {
//     try {
//       const response = await fetch(`${baseUrl}/${projectId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(projectData),
//       });
//       if (!response.ok)
//         throw new Error(`Failed to update project: ${response.status}`);
//       return await fetchProjects(); // Return updated list of projects
//     } catch (error) {
//       console.error("Error updating project:", error);
//       return [];
//     }
//   };

//   // Remove a project
//   const removeProject = async (projectId) => {
//     try {
//       const response = await fetch(`${baseUrl}/${projectId}`, {
//         method: "DELETE",
//       });
//       if (!response.ok)
//         throw new Error(`Failed to remove project: ${response.status}`);
//       return await fetchProjects(); // Return updated list of projects
//     } catch (error) {
//       console.error("Error removing project:", error);
//       return [];
//     }
//   };

//   return {
//     fetchProjects,
//     addProject,
//     updateProject,
//     removeProject,
//   };
// }

// class ProjectManager {
//   constructor() {
//     this.projects = [];
//     this.selectedProject = null;
//   }

//   async fetchProjects() {
//     try {
//       const response = await fetch("http://localhost:3001/projects");
//       if (!response.ok) {
//         throw new Error(`Failed to fetch projects: ${response.status}`);
//       }
//       this.projects = await response.json();
//       return this.projects;
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       this.projects = [];
//     }
//   }

//   selectProject(project) {
//     this.selectedProject = project;
//   }

//   async updateProject(project) {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/projects/${project.id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(project),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`Failed to update project: ${response.status}`);
//       }
//       return this.fetchProjects(); // Refresh the list
//     } catch (error) {
//       console.error("Error updating project:", error);
//     }
//   }

//   async createOrUpdateProject(project) {
//     const method = project.id ? "PUT" : "POST";
//     const url = project.id
//       ? `http://localhost:3001/projects/${project.id}`
//       : `http://localhost:3001/projects`;
//     try {
//       const response = await fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(project),
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to save project: ${response.status}`);
//       }
//       return this.fetchProjects(); // Refresh the list
//     } catch (error) {
//       console.error("Error saving project:", error);
//     }
//   }

//   async removeProject(projectId) {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/projects/${projectId}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`Failed to remove project: ${response.status}`);
//       }
//       return this.fetchProjects(); // Refresh the list
//     } catch (error) {
//       console.error("Error removing project:", error);
//     }
//   }
// }

// export default ProjectManager;
