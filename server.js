import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  const db = router.db;
  const { method, path } = req;

  console.log(`General Middleware Check: ${req.method} ${req.url}`);
  console.log(`Incoming request: ${req.method} ${req.path}`);
  console.log(`Path segments:`, req.path.split("/"));

  // GET Fetching users by project
  if (method === "GET" && path.match(/\/projects\/\d+\/users/)) {
    const projectId = parseInt(path.split("/")[2], 10);
    const project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const allUsers = db.get("users").value();
    const projectUsers = Object.values(project.access).flat();

    let allProjectUsers = allUsers
      .filter((user) => projectUsers.includes(user.id))
      .map((user) => ({
        id: user.id,
        username: user.username,
        role: Object.keys(project.access).find((role) =>
          project.access[role].includes(user.id)
        ),
      }));
    res.json({ allProjectUsers });
    return;
  }

  // POST Adding a new user
  if (method === "POST" && path === "/users") {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    const user = db.get("users").find({ username }).value();
    if (user) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    const newUser = db.get("users").insert({ username }).write();
    res.json({ message: "User added successfully", user: newUser });
    return;
  }

  // PUT Assigning tasks to users
  if (
    method === "PUT" &&
    /\/projects\/(\d+)\/tasks\/(\d+)\/assign/.test(path)
  ) {
    const [, projectId, taskId] = path.match(
      /\/projects\/(\d+)\/tasks\/(\d+)\/assign/
    );
    const userId = req.body.userId ? parseInt(req.body.userId) : null;
    const project = db
      .get("projects")
      .find({ id: Number(projectId) })
      .value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const taskIndex = project.tasks.findIndex((t) => t.id === Number(taskId));
    if (taskIndex === -1) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    project.tasks[taskIndex].assignee = userId
      ? { userId: Number(userId) }
      : { userId: null };
    db.get("projects")
      .find({ id: Number(projectId) })
      .assign({ tasks: project.tasks })
      .write();
    res.json({ message: "Task assigned successfully", project });
    return;
  }

  // GET Removing task assignment
  if (method === "GET" && path.includes("/projects-by-user/")) {
    const userId = parseInt(req.path.split("/")[2]);
    console.log(`Fetching projects for user ID: ${userId}`);
    const projects = db.get("projects").value();
    const accessibleProjects = projects.filter((project) =>
      Object.values(project.access).some((role) => role.includes(userId))
    );
    console.log(`Accessible projects: ${JSON.stringify(accessibleProjects)}`);
    if (accessibleProjects.length > 0) {
      res.json(accessibleProjects);
    } else {
      res.status(404).json({ error: "No projects found for this user" });
    }
    return;
  }

  // GET Fetching eligible users for a task
  if (
    method === "GET" &&
    path.match(/\/projects\/\d+\/tasks\/\d+\/eligible-users/)
  ) {
    const projectId = parseInt(path.split("/")[2], 10);
    const taskId = parseInt(path.split("/")[4], 10);
    const project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const allUsers = db.get("users").value();
    const projectUsers = Object.values(project.access).flat();

    let eligibleUsers = allUsers.filter((user) =>
      projectUsers.includes(user.id)
    );
    console.log(
      `Eligible users: ${JSON.stringify(
        eligibleUsers
      )} and assignee: ${JSON.stringify(task.assignee)}`
    );
    res.json({ eligibleUsers, assignee: task.assignee });
    return;
  }

  // GET Fetching eligible users not in the project with optional search query
  if (method === "GET" && path.match(/\/users\/search/)) {
    const projectId = parseInt(req.query.projectId, 10);
    const query = req.query.query
      ? req.query.query
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
      : "";

    console.log(`Received projectId: ${projectId}`);
    console.log(`Received search query: ${query}`);

    const project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const allUsers = db.get("users").value();
    const projectUsers = Object.values(project.access).flat();

    console.log(`Project users: ${JSON.stringify(projectUsers)}`);

    let eligibleUsers = allUsers
      .filter((user) => !projectUsers.includes(user.id))
      .map(({ id, username }) => ({ id, username }));

    console.log(
      `Eligible users before filtering by query: ${JSON.stringify(
        eligibleUsers
      )}`
    );

    if (query) {
      eligibleUsers = eligibleUsers.filter((user) =>
        user.username.toLowerCase().includes(query)
      );
    }

    console.log(
      `Eligible users after filtering by query: ${JSON.stringify(
        eligibleUsers
      )}`
    );

    res.json({ eligibleUsers });
    return;
  }

  // POST Adding a user to a project
  if (method === "POST" && path.match(/^\/projects\/(\d+)\/access\/(\w+)$/)) {
    const projectId = parseInt(path.split("/")[2], 10);
    const role = path.split("/")[4];
    const userId = parseInt(req.body.userId);
    const project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    if (!project.access[role]) {
      res.status(400).json({ error: "Role does not exist" });
      return;
    }

    if (project.access[role].includes(userId)) {
      res.status(400).json({ error: "User already has access" });
      return;
    }

    project.access[role].push(userId);
    db.get("projects")
      .find({ id: projectId })
      .assign({ access: project.access })
      .write();
    console.log(`User added to project: ${JSON.stringify(project)}`);
    res.json({ message: "User added successfully", project });
    return;
  }

  // DELETE Removing a user from a project access
  if (method === "DELETE" && path.match(/^\/projects\/(\d+)\/access\/(\d+)$/)) {
    const projectId = parseInt(path.split("/")[2], 10);
    const userId = parseInt(path.split("/")[4], 10);
    const project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    let found = false; // Flag to check if the user was found in any role
    Object.keys(project.access).forEach((role) => {
      if (project.access[role].includes(userId)) {
        project.access[role] = project.access[role].filter(
          (id) => id !== userId
        );
        found = true;
      }
    });

    if (!found) {
      res
        .status(400)
        .json({ error: "User does not have access to this project" });
      return;
    }

    db.get("projects")
      .find({ id: projectId })
      .assign({ access: project.access })
      .write();
    res.json({ message: "User removed successfully from all roles", project });
    return;
  }

  // POST Create a new project
  if (method === "POST" && path === "/projects") {
    const { name, description, date, userChanges, globalUserId } = req.body;

    const access = {
      admin: [],
      editor: [],
      reader: [],
    };

    // Process added users
    userChanges.addedUsers.forEach((user) => {
      if (!access[user.role]) {
        access[user.role] = [];
      }
      access[user.role].push(user.userId);
    });

    const newProject = db
      .get("projects")
      .insert({
        name,
        description,
        date,
        access: {
          ...access,
          admin: access.admin
            ? [...access.admin, globalUserId]
            : [globalUserId],
        },
        tasks: [],
      })
      .write();

    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
    return;
  }

  // PUT endpoint for updating an existing project
  if (method === "PUT" && path.match(/^\/projects\/(\d+)$/)) {
    const projectId = parseInt(path.split("/")[2], 10);
    const { name, description, date, userChanges } = req.body;
    let project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update project details
    project.name = name;
    project.description = description;
    project.date = date;

    // Process user changes to update access
    const access = project.access || {
      admin: [],
      editor: [],
      reader: [],
    };

    // Process added users
    userChanges.addedUsers.forEach((user) => {
      if (!access[user.role]) {
        access[user.role] = [];
      }
      if (!access[user.role].includes(user.userId)) {
        access[user.role].push(user.userId);
      }
    });

    // Process removed users
    userChanges.removedUsers.forEach((user) => {
      Object.keys(access).forEach((role) => {
        access[role] = access[role].filter((id) => id !== user.userId);
      });
    });

    project.access = access;

    db.get("projects").find({ id: projectId }).assign(project).write();

    res.json({ message: "Project updated successfully", project });
    return;
  }

  // DELETE remove a project
  if (method === "DELETE" && path.match(/^\/projects\/\d+$/)) {
    const projectId = parseInt(path.split("/")[2], 10);
    const project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    db.get("projects").remove({ id: projectId }).write();
    res.json({ message: "Project removed successfully" });
    return;
  }

  // POST Adding a task to a project
  if (method === "POST" && path.match(/^\/projects\/\d+\/tasks$/)) {
    const projectId = parseInt(path.split("/")[2], 10);
    const { description } = req.body;

    const project = db.get("projects").find({ id: projectId }).value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    console.log(
      `Adding task to project: ${projectId} with description: ${description}`
    );
    const newTask = db
      .get("projects")
      .find({ id: projectId })
      .get("tasks")
      .insert({
        description,
        assignee: {
          userId: null,
        },
      })
      .write();

    res.status(201).json({ message: "Task added successfully", task: newTask });
    return;
  }

  // DELETE Removing a task from a project
  if (method === "DELETE" && path.match(/^\/projects\/\d+\/tasks\/\d+$/)) {
    const [, projectId, taskId] = path.match(/\/projects\/(\d+)\/tasks\/(\d+)/);
    const project = db
      .get("projects")
      .find({ id: Number(projectId) })
      .value();

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const taskIndex = project.tasks.findIndex((t) => t.id === Number(taskId));
    if (taskIndex === -1) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    project.tasks.splice(taskIndex, 1);
    db.get("projects")
      .find({ id: Number(projectId) })
      .assign({ tasks: project.tasks })
      .write();
    res.json({ message: "Task removed successfully", project });
    return;
  }

  console.log(`Final catch-all middleware: ${req.method} ${req.path}`);
  next();
});

server.use(router);

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
