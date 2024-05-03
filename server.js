import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Path to JSON file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom middleware to handle complex logic
server.use((req, res, next) => {
    const db = router.db; // Get lowdb instance

    // Fetch eligible users for a project, excluding those already assigned specific roles
    if (req.method === 'GET' && req.path.includes('/projects/') && req.path.includes('/eligible-users')) {
        const projectId = parseInt(req.path.split('/')[2]); // Extract project ID from URL
        const project = db.get('projects').find({ id: projectId }).value();
        if (project) {
            const allUsers = db.get('users').value();
            const assignedUserIds = Object.values(project.access).flat();
            const eligibleUsers = allUsers.filter(user => !assignedUserIds.includes(user.id));
            res.json(eligibleUsers);
        } else {
            res.status(404).send('Project not found');
        }
    }

    // Fetch eligible users for a task, excluding the current assignee
    else if (req.method === 'GET' && req.path.includes('/tasks/') && req.path.includes('/eligible-users')) {
        const taskId = parseInt(req.path.split('/')[2]); // Extract task ID from URL
        const task = db.get('tasks').find({ id: taskId }).value();
        if (task) {
            const allUsers = db.get('users').value();
            const eligibleUsers = allUsers.filter(user => user.id !== task.assignee.userId);
            res.json(eligibleUsers);
        } else {
            res.status(404).send('Task not found');
        }
    }

    // Add or remove users to/from a project's role
    else if (req.method === 'POST' && req.path.includes('/projects/') && req.path.includes('/access/') || req.method === 'DELETE' && req.path.includes('/projects/') && req.path.includes('/access/')) {
        const projectId = parseInt(req.path.split('/')[2]); // Extract project ID from URL
        const project = db.get('projects').find({ id: projectId }).value();
        if (!project) {
            res.status(404).send('Project not found');
            return;
        }

        if (req.method === 'POST') {
            const role = req.body.role; // Role should be passed in the body
            const userId = req.body.userId; // User ID should be passed in the body
            if (!project.access[role]) {
                project.access[role] = [];
            }
            if (!project.access[role].includes(userId)) {
                project.access[role].push(userId);
                db.get('projects').find({ id: projectId }).assign({ access: project.access }).write();
                res.status(200).json(project);
            } else {
                res.status(400).send('User already added to this role');
            }
        } else if (req.method === 'DELETE') {
            const role = req.path.split('/')[4]; // Role should be extracted from URL
            const userId = parseInt(req.path.split('/')[5]); // User ID should be extracted from URL
            project.access[role] = project.access[role].filter(id => id !== userId);
            db.get('projects').find({ id: projectId }).assign({ access: project.access }).write();
            res.sendStatus(204);
        }
    } else {
        next();
    }
});

// This is to ensure all GET, POST, PUT, DELETE requests not caught by the custom middleware
// are still processed by JSON Server default routes.
server.use(router);

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
