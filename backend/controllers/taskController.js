import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
export const getTasksByProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has access to this project
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
        }

        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('comments.user', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks assigned to logged in user
// @route   GET /api/tasks/my-tasks
// @access  Private
export const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('project', 'name color')
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name color')
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('comments.user', 'name email avatar');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to this task's project
        const project = await Project.findById(task.project._id);
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to view this task' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, status, priority, dueDate, tags } = req.body;

        // Check if project exists and user has access
        const projectDoc = await Project.findById(project);

        if (!projectDoc) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const hasAccess =
            projectDoc.owner.toString() === req.user._id.toString() ||
            projectDoc.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy: req.user._id,
            status: status || 'todo',
            priority: priority || 'medium',
            dueDate,
            tags: tags || [],
        });

        const populatedTask = await Task.findById(task._id)
            .populate('project', 'name color')
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to this task's project
        const project = await Project.findById(task.project);
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const { title, description, assignedTo, status, priority, dueDate, tags } = req.body;

        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
        task.tags = tags !== undefined ? tags : task.tags;

        const updatedTask = await task.save();

        const populatedTask = await Task.findById(updatedTask._id)
            .populate('project', 'name color')
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('comments.user', 'name email avatar');

        res.json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to this task's project
        const project = await Project.findById(task.project);
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to this task's project
        const project = await Project.findById(task.project);
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to comment on this task' });
        }

        const comment = {
            user: req.user._id,
            text,
        };

        task.comments.push(comment);
        await task.save();

        const populatedTask = await Task.findById(task._id)
            .populate('project', 'name color')
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('comments.user', 'name email avatar');

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to this task's project
        const project = await Project.findById(task.project);
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        await task.save();

        const populatedTask = await Task.findById(task._id)
            .populate('project', 'name color')
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('comments.user', 'name email avatar');

        res.json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
