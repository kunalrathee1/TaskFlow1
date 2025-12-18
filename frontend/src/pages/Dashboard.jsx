import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import ProjectCard from '../components/ProjectCard';
import Chart from '../components/Chart';
import Modal from '../components/Modal';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        priority: 'medium',
        color: '#6366f1',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, tasksRes] = await Promise.all([
                axiosInstance.get('/projects'),
                axiosInstance.get('/tasks/my-tasks'),
            ]);
            setProjects(projectsRes.data);
            setMyTasks(tasksRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/projects', newProject);
            setShowProjectModal(false);
            setNewProject({ name: '', description: '', priority: 'medium', color: '#6366f1' });
            fetchData();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const getTaskStats = () => {
        return {
            total: myTasks.length,
            todo: myTasks.filter((t) => t.status === 'todo').length,
            inProgress: myTasks.filter((t) => t.status === 'in-progress').length,
            review: myTasks.filter((t) => t.status === 'review').length,
            done: myTasks.filter((t) => t.status === 'done').length,
            overdue: myTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
        };
    };

    const stats = getTaskStats();

    const chartData = [
        { name: 'To Do', value: stats.todo },
        { name: 'In Progress', value: stats.inProgress },
        { name: 'Review', value: stats.review },
        { name: 'Done', value: stats.done },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-slate-600 font-semibold">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8 animate-slide-down">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-slate-600 text-lg">Here's what's happening with your projects today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-semibold mb-1">Total Tasks</p>
                                <p className="text-4xl font-black">{stats.total}</p>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-amber-500 to-orange-600 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-semibold mb-1">In Progress</p>
                                <p className="text-4xl font-black">{stats.inProgress}</p>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-semibold mb-1">Completed</p>
                                <p className="text-4xl font-black">{stats.done}</p>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-red-500 to-rose-600 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-semibold mb-1">Overdue</p>
                                <p className="text-4xl font-black">{stats.overdue}</p>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                {stats.total > 0 && (
                    <div className="mb-8">
                        <Chart data={chartData} type="pie" title="Task Distribution" />
                    </div>
                )}

                {/* Projects Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-black text-slate-900">Your Projects</h2>
                        <button
                            onClick={() => setShowProjectModal(true)}
                            className="btn btn-primary flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Project</span>
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <div className="card text-center py-12">
                            <svg className="w-20 h-20 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
                            <p className="text-slate-600 mb-4">Create your first project to get started</p>
                            <button onClick={() => setShowProjectModal(true)} className="btn btn-primary">
                                Create Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard key={project._id} project={project} onDelete={fetchData} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Tasks */}
                {myTasks.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Your Recent Tasks</h2>
                        <div className="card">
                            <div className="space-y-3">
                                {myTasks.slice(0, 5).map((task) => (
                                    <Link
                                        key={task._id}
                                        to={`/tasks/${task._id}`}
                                        className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors duration-200 border border-slate-200"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-1">{task.title}</h4>
                                            <p className="text-sm text-slate-600">{task.project?.name}</p>
                                        </div>
                                        <span className={`badge badge-${task.status}`}>
                                            {task.status.replace('-', ' ')}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            <Modal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                title="Create New Project"
            >
                <form onSubmit={handleCreateProject} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Project Name
                        </label>
                        <input
                            type="text"
                            required
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            className="input"
                            placeholder="My Awesome Project"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            required
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="input"
                            rows="4"
                            placeholder="Describe your project..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Priority
                        </label>
                        <select
                            value={newProject.priority}
                            onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                            className="input"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Color
                        </label>
                        <div className="flex space-x-2">
                            {['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setNewProject({ ...newProject, color })}
                                    className={`w-10 h-10 rounded-lg transition-transform duration-200 ${newProject.color === color ? 'ring-4 ring-offset-2 ring-blue-500 scale-110' : ''
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button type="submit" className="btn btn-primary flex-1">
                            Create Project
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowProjectModal(false)}
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

export default Dashboard;
