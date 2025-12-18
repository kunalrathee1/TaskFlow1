import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.user._id }, { members: req.user._id }],
        })
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has access to this project
        const hasAccess =
            project.owner._id.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member._id.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to view this project' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
    try {
        const { name, description, members, status, priority, startDate, endDate, color } = req.body;

        const project = await Project.create({
            name,
            description,
            owner: req.user._id,
            members: members || [],
            status: status || 'planning',
            priority: priority || 'medium',
            startDate: startDate || Date.now(),
            endDate,
            color: color || '#6366f1',
        });

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        res.status(201).json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        const { name, description, members, status, priority, startDate, endDate, color } = req.body;

        project.name = name || project.name;
        project.description = description || project.description;
        project.members = members !== undefined ? members : project.members;
        project.status = status || project.status;
        project.priority = priority || project.priority;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;
        project.color = color || project.color;

        const updatedProject = await project.save();

        const populatedProject = await Project.findById(updatedProject._id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        res.json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        // Delete all tasks associated with this project
        await Task.deleteMany({ project: req.params.id });

        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: 'Project and associated tasks removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Private
export const getProjectStats = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has access
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some(
                (member) => member.toString() === req.user._id.toString()
            );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Not authorized to view this project' });
        }

        const tasks = await Task.find({ project: req.params.id });

        const stats = {
            total: tasks.length,
            todo: tasks.filter((t) => t.status === 'todo').length,
            inProgress: tasks.filter((t) => t.status === 'in-progress').length,
            review: tasks.filter((t) => t.status === 'review').length,
            done: tasks.filter((t) => t.status === 'done').length,
            overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
