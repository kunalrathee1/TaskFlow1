import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const TaskPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [comment, setComment] = useState('');
    const [editedTask, setEditedTask] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [taskRes, usersRes] = await Promise.all([
                axiosInstance.get(`/tasks/${id}`),
                axiosInstance.get('/auth/users'),
            ]);
            setTask(taskRes.data);
            setEditedTask(taskRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/tasks/${id}`, editedTask);
            setEditing(false);
            fetchData();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await axiosInstance.patch(`/tasks/${id}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await axiosInstance.post(`/tasks/${id}/comments`, { text: comment });
            setComment('');
            fetchData();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteTask = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axiosInstance.delete(`/tasks/${id}`);
                navigate(`/projects/${task.project._id}`);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No deadline';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-slate-600 font-semibold">Loading task...</p>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Task not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

    return (
        <div className="min-h-screen py-8">
            <div className="container-custom max-w-5xl">
                {/* Header */}
                <button
                    onClick={() => navigate(`/projects/${task.project._id}`)}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {task.project.name}
                </button>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Task Details */}
                        <div className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={editedTask.title}
                                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                            className="input text-2xl font-bold mb-4"
                                        />
                                    ) : (
                                        <h1 className="text-3xl font-black text-slate-900 mb-4">{task.title}</h1>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    {editing ? (
                                        <>
                                            <button onClick={handleUpdateTask} className="btn btn-success">
                                                Save
                                            </button>
                                            <button onClick={() => setEditing(false)} className="btn btn-outline">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditing(true)} className="btn bg-slate-100 text-slate-700 hover:bg-slate-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button onClick={handleDeleteTask} className="btn btn-danger">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {editing ? (
                                <textarea
                                    value={editedTask.description}
                                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                    className="input mb-4"
                                    rows="6"
                                />
                            ) : (
                                <p className="text-slate-700 leading-relaxed mb-6">{task.description}</p>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {task.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg font-medium"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Status Buttons */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                                {['todo', 'in-progress', 'review', 'done'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${task.status === status
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {status.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="card">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Comments</h2>

                            {/* Add Comment Form */}
                            <form onSubmit={handleAddComment} className="mb-6">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={user?.avatar}
                                        alt={user?.name}
                                        className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md"
                                    />
                                    <div className="flex-1">
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="input"
                                            rows="3"
                                            placeholder="Add a comment..."
                                        />
                                        <button
                                            type="submit"
                                            disabled={!comment.trim()}
                                            className="btn btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {task.comments && task.comments.length > 0 ? (
                                    task.comments.map((c) => (
                                        <div key={c._id} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                                            <img
                                                src={c.user.avatar}
                                                alt={c.user.name}
                                                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-slate-900">{c.user.name}</span>
                                                    <span className="text-xs text-slate-500">{formatRelativeTime(c.createdAt)}</span>
                                                </div>
                                                <p className="text-slate-700">{c.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        <p className="font-medium">No comments yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Task Info */}
                        <div className="card">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Task Details</h3>

                            <div className="space-y-4">
                                {/* Status */}
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 block mb-2">Status</span>
                                    <span className={`badge badge-${task.status}`}>
                                        {task.status.replace('-', ' ')}
                                    </span>
                                </div>

                                {/* Priority */}
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 block mb-2">Priority</span>
                                    <span className={`badge badge-${task.priority}`}>
                                        {task.priority}
                                    </span>
                                </div>

                                {/* Assigned To */}
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 block mb-2">Assigned To</span>
                                    {task.assignedTo ? (
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={task.assignedTo.avatar}
                                                alt={task.assignedTo.name}
                                                className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-md"
                                            />
                                            <span className="text-slate-900 font-medium">{task.assignedTo.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Unassigned</span>
                                    )}
                                </div>

                                {/* Created By */}
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 block mb-2">Created By</span>
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={task.createdBy.avatar}
                                            alt={task.createdBy.name}
                                            className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-md"
                                        />
                                        <span className="text-slate-900 font-medium">{task.createdBy.name}</span>
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 block mb-2">Due Date</span>
                                    <div className={`flex items-center space-x-2 ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-700'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDate(task.dueDate)}</span>
                                    </div>
                                    {isOverdue && (
                                        <span className="text-xs text-red-600 font-semibold mt-1 block">⚠️ Overdue</span>
                                    )}
                                </div>

                                {/* Created At */}
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 block mb-2">Created</span>
                                    <span className="text-slate-700">{formatDate(task.createdAt)}</span>
                                </div>

                                {/* Updated At */}
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 block mb-2">Last Updated</span>
                                    <span className="text-slate-700">{formatRelativeTime(task.updatedAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Link */}
                        <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            <h3 className="text-lg font-bold mb-2">Project</h3>
                            <p className="text-blue-100 mb-4">{task.project.name}</p>
                            <button
                                onClick={() => navigate(`/projects/${task.project._id}`)}
                                className="btn bg-white text-blue-600 hover:bg-blue-50 w-full"
                            >
                                View Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskPage;
