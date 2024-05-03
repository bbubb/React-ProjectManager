class ProjectRoleManager {
  constructor(project, users, updateProjectCallback) {
    this.project = project;
    this.users = users; // Assumed to be passed from a higher-level component or context
    this.updateProjectCallback = updateProjectCallback; // Callback to update project in the state
  }

  // Adds a role to a user within the project
  addRoleToUser(userId, role) {
    if (!this.project.access[role].includes(userId)) {
      this.project.access[role].push(userId);
      this.updateProject(); // Directly update the project after role modification
    }
  }

  // Removes a user from a role
  removeRoleFromUser(userId, role) {
    if (this.project.access[role].includes(userId)) {
      this.project.access[role] = this.project.access[role].filter(id => id !== userId);
      this.updateProject(); // Directly update the project after role modification
    }
  }

  // Invokes the callback to update the project in the global state or API
  updateProject() {
    this.updateProjectCallback(this.project);
  }
}

export default ProjectRoleManager;
