// PermissionService.js
import { useFetchProjectById } from "./ProjectService";
import { useAuth } from "../contexts/AuthProvider";

export const usePermission = (projectId) => {
  const { user } = useAuth();
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useFetchProjectById(projectId);

  const checkPermission = (role) => {
    if (isLoading || isError || !project) return false;
    return project?.access[role]?.includes(user?.id);
  };

  return {
    canEdit: checkPermission("editor") || checkPermission("admin"),
    canView:
      checkPermission("reader") ||
      checkPermission("editor") ||
      checkPermission("admin"),
    canDelete: checkPermission("admin"),
    canAssign: checkPermission("admin"),
    isLoading,
    isError,
    error,
  };
};

// // PermissionService.js
// class PermissionService {
//   constructor(apiService) {
//     this.apiService = apiService;
//     this.permissions = {}; // stores permissions in the format projectId: { canEdit: bool, canDelete: bool, canView: bool }
//   }

//   // Load permissions for all projects where the user has some role
//   async loadPermissions(userId) {
//     try {
//       console.log("Loading permissions for user:", userId);
//       const allProjects = await this.apiService.get("/projects");
//       console.log("All projects loaded for permission calculation:", allProjects);
//       this.permissions = allProjects.reduce((acc, project) => {
//         const roles = project.access;
//         console.log("Roles for project:", project.id, roles);
//         const userRoles = Object.entries(roles).reduce(
//           (roleAcc, [role, userIds]) => {
//             if (userIds.map(Number).includes(Number(userId))) {
//               console.log("User has role:", role);
//               console.log("User IDs for role:", userIds);
//               roleAcc[role] = true;
//             }
//             console.log("Role permissions:", roleAcc);
//             return roleAcc;
//           },
//           {}
//         );

//         acc[project.id] = this.calculatePermissions(userRoles);
//         return acc;
//       }, {});
//       console.log("Permissions after loading:", this.permissions)
//     } catch (error) {
//       console.error("Error loading permissions:", error);
//       throw error;
//     }
//   }

//   // Helper to determine permissions based on user roles
//   calculatePermissions(roles) {
//     const permissions = {
//       isAdmin: roles.admin || false,
//       isEditor: roles.editor || false,
//       isReader: roles.reader || false,
//       canEdit: roles.admin || roles.editor || false,
//       canDelete: roles.admin || false,
//       canView: roles.admin || roles.editor || roles.reader || false,
//     };
//     console.log("Calculated permissions:", permissions);
//     return permissions;
//   }

//   canEdit(projectId) {
//     return this.permissions[projectId]?.canEdit || false;
//   }

//   canDelete(projectId) {
//     return this.permissions[projectId]?.canDelete || false;
//   }

//   canView(projectId) {
//     return this.permissions[projectId]?.canView || false;
//   }

//   // canCreateNewProject() {
//   //   return !!this.currentUser; // Assuming currentUser is set upon successful login
//   // }
// }

// export default PermissionService;

// class PermissionService {
//   static instance = null;

//   static getInstance() {
//     if (!PermissionService.instance) {
//       PermissionService.instance = new PermissionService();
//     }
//     return PermissionService.instance;
//   }

//   constructor() {
//     this.permissions = {};
//   }

//   loadPermissions(user, projects) {
//     if (!user || !user.id) {
//       console.error("Invalid user data: ", user);
//       return;
//     }
//     this.permissions = projects.reduce((acc, project) => {
//       const userRoles = Object.keys(project.access).filter((role) =>
//         project.access[role].includes(parseInt(user.id))
//       );
//       acc[project.id] = {
//         isAdmin: userRoles.includes("admin"),
//         isEditor: userRoles.includes("editor"),
//         isReader: userRoles.includes("reader")
//       };
//       return acc;
//     }, {});
//   }

//   canAddProjectRole(projectId) {
//     const perms = this.permissions[projectId];
//     return perms ? (perms.isAdmin || perms.isEditor) : false;
//   }

//   canAssignTask(projectId) {
//     const perms = this.permissions[projectId];
//     return perms ? (perms.isAdmin || perms.isEditor) : false;
//   }

//   canAddTask(projectId) {
//     const perms = this.permissions[projectId];
//     return perms ? (perms.isAdmin || perms.isEditor) : false;
//   }

//   canCreate() {
//     // Assuming canCreate means creating projects and doesn't depend on specific projects
//     // This might need user's global role checks if applicable
//     return true;
//   }

//   canEdit(projectId) {
//     const perms = this.permissions[projectId];
//     return perms ? (perms.isAdmin || perms.isEditor) : false;
//   }

//   canDelete(projectId) {
//     const perms = this.permissions[projectId];
//     return perms ? perms.isAdmin : false;
//   }

//   canView(projectId) {
//     const perms = this.permissions[projectId];
//     return perms ? (perms.isAdmin || perms.isEditor || perms.isReader) : false;
//   }
// }

// export default PermissionService;
