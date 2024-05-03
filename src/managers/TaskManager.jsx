class TaskManager {
  constructor(apiService, projectManager) {
    this.apiService = apiService;
    this.projectManager = projectManager; // Dependency injection of ProjectManager
  }

  async assignUserToTask(projectId, taskId, userId) {
    const project = await this.projectManager.fetchProjectById(projectId);
    const taskIndex = project.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      project.tasks[taskIndex].assignee.userId = userId;
      await this.projectManager.updateProject(projectId, project);
    }
  }

  async getEligibleUsersForTask(project, taskId) {
    console.log("Fetching users for task assignment", project, taskId);
    // const project = await this.projectManager.fetchProjectById(projectId);
    console.log("Project:", project);
    if (!project) {
      console.error("Project not found");
      return [];
    }

    const task = project.tasks.find((t) => t.id === parseInt(taskId));
    console.log("Task:", task, "Task ID:", taskId);
    if (!task) {
      console.error("Task not found");
      return [];
    }

    const allUserRoles = project.access;
    console.log("All user roles:", allUserRoles);
    const eligibleUserIds = [].concat(...Object.values(allUserRoles));
    console.log("Eligible user IDs:", eligibleUserIds);
    const updatedEligibleUserIds = eligibleUserIds.filter(
      (id) => id !== task.assignee.userId,
      console.log("Task assignee ID:", task.assignee.userId)
    );
    console.log("Updated eligible user IDs:", updatedEligibleUserIds);
    // Assuming 'users' array is fetched from somewhere, this should be managed either globally or fetched here
    const eligibleUsers = users.filter((user) =>
      updatedEligibleUserIds.includes(user.id)
    );

    console.log("Eligible users:", eligibleUsers.map((user) => ({
      value: user.id,
      label: user.username,
      isDefault: user.id === task.assignee.userId,
    })));
    return eligibleUsers.map((user) => ({
      value: user.id,
      label: user.username,
      isDefault: user.id === task.assignee.userId,
    }));
  }

  async addTask(projectId, taskDescription) {
    const project = await this.projectManager.fetchProjectById(projectId);
    const newTask = {
      id: Date.now(), // Backend will generate a unique ID : Mocking with timestamp
      description: taskDescription,
      assignee: { userId: null }, // Default no assignee
    };
    project.tasks.push(newTask);
    await this.projectManager.updateProject(projectId, project);
  }

  async removeTask(projectId, taskId) {
    const project = await this.projectManager.fetchProjectById(projectId);
    project.tasks = project.tasks.filter((task) => task.id !== taskId);
    await this.projectManager.updateProject(projectId, project);
  }
}

export default TaskManager;
