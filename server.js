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

  // Assigning tasks to users
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

  console.log(`Final catch-all middleware: ${req.method} ${req.path}`);
  next();
});

server.use(router);

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
