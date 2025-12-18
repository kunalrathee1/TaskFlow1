import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Board from '../components/Board';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const ProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
        tags: '',
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [projectRes, tasksRes, usersRes] = await Promise.all([
                axiosInstance.get(`/projects/${id}`),
                axiosInstance.get(`/tasks/project/${id}`),
                axiosInstance.get('/auth/users'),
            ]);
            setProject(projectRes.data);
            setTasks(tasksRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/tasks', {
                ...newTask,
                project: id,
                tags: newTask.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
            });
            setShowTaskModal(false);
            setNewTask({
                title: '',
                description: '',
                assignedTo: '',
                priority: 'medium',
                dueDate: '',
                tags: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project? This will also delete all tasks.')) {
            try {
                await axiosInstance.delete(`/projects/${id}`);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/projects/${id}`, project);
            setShowEditModal(false);
            fetchData();
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-slate-600 font-semibold">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Project not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isOwner = project.owner._id === user._id;

    return (
        <div className="min-h-screen py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>

                    <div className="glass-card">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: project.color }}
                                    ></div>
                                    <h1 className="text-4xl font-black text-slate-900">{project.name}</h1>
                                </div>
                                <p className="text-slate-600 text-lg mb-4">{project.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    <span className={`badge badge-${project.status}`}>
                                        {project.status.replace('-', ' ')}
                                    </span>
                                    <span className={`badge badge-${project.priority}`}>
                                        {project.priority} priority
                                    </span>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="btn bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleDeleteProject}
                                        className="btn btn-danger"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Team Members */}
                        <div className="flex items-center space-x-4 pt-4 border-t border-slate-200">
                            <span className="text-sm font-semibold text-slate-700">Team:</span>
                            <div className="flex items-center -space-x-2">
                                <img
                                    src={project.owner.avatar}
                                    alt={project.owner.name}
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                    title={`${project.owner.name} (Owner)`}
                                />
                                {project.members.map((member) => (
                                    <img
                                        key={member._id}
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                        title={member.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="btn btn-primary flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Task</span>
                    </button>
                </div>

                {/* Kanban Board */}
                <Board tasks={tasks} onTaskMove={fetchData} />
            </div>

            {/* Create Task Modal */}
            <Modal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                title="Create New Task"
            >
                <form onSubmit={handleCreateTask} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Task Title
                        </label>
                        <input
                            type="text"
                            required
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="input"
                            placeholder="Task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            required
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="input"
                            rows="4"
                            placeholder="Describe the task..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Assign To
                            </label>
                            <select
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                className="input"
                            >
                                <option value="">Unassigned</option>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                className="input"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={newTask.tags}
                            onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                            className="input"
                            placeholder="frontend, urgent, bug"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button type="submit" className="btn btn-primary flex-1">
                            Create Task
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowTaskModal(false)}
                            className="btn btn-outline flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Project Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Project"
            >
                <form onSubmit={handleUpdateProject} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Project Name
                        </label>
                        <input
                            type="text"
                            required
                            value={project.name}
                            onChange={(e) => setProject({ ...project, name: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            required
                            value={project.description}
                            onChange={(e) => setProject({ ...project, description: e.target.value })}
                            className="input"
                            rows="4"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Status
                            </label>
                            <select
                                value={project.status}
                                onChange={(e) => setProject({ ...project, status: e.target.value })}
                                className="input"
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={project.priority}
                                onChange={(e) => setProject({ ...project, priority: e.target.value })}
                                className="input"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button type="submit" className="btn btn-primary flex-1">
                            Update Project
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="btn btn-outline flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectPage;
