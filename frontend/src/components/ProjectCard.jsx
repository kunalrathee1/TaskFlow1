import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ProjectCard = ({ project, onDelete }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [project._id]);

    const fetchStats = async () => {
        try {
            const { data } = await axiosInstance.get(`/projects/${project._id}/stats`);
            setStats(data);
        } catch (error) {
            console.error('Error fetching project stats:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            planning: 'bg-slate-100 text-slate-700 border-slate-300',
            active: 'bg-green-100 text-green-700 border-green-300',
            'on-hold': 'bg-yellow-100 text-yellow-700 border-yellow-300',
            completed: 'bg-blue-100 text-blue-700 border-blue-300',
            archived: 'bg-gray-100 text-gray-700 border-gray-300',
        };
        return colors[status] || colors.planning;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'badge-low',
            medium: 'badge-medium',
            high: 'badge-high',
            urgent: 'badge-urgent',
        };
        return colors[priority] || 'badge-low';
    };

    const calculateProgress = () => {
        if (!stats || stats.total === 0) return 0;
        return Math.round((stats.done / stats.total) * 100);
    };

    const formatDate = (date) => {
        if (!date) return 'No deadline';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div
            className="card card-hover cursor-pointer group"
            onClick={() => navigate(`/projects/${project._id}`)}
            style={{ borderLeft: `4px solid ${project.color || '#6366f1'}` }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                        {project.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge border ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                </span>
                <span className={`badge ${getPriorityColor(project.priority)}`}>
                    {project.priority} priority
                </span>
            </div>

            {/* Progress Bar */}
            {stats && stats.total > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-700">Progress</span>
                        <span className="text-xs font-bold text-blue-600">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{stats.total}</div>
                        <div className="text-xs text-slate-600">Total</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{stats.inProgress}</div>
                        <div className="text-xs text-slate-600">Active</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{stats.done}</div>
                        <div className="text-xs text-slate-600">Done</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
                        <div className="text-xs text-slate-600">Overdue</div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                {/* Team Members */}
                <div className="flex items-center">
                    <div className="flex -space-x-2">
                        {project.owner && (
                            <img
                                src={project.owner.avatar}
                                alt={project.owner.name}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                title={`${project.owner.name} (Owner)`}
                            />
                        )}
                        {project.members && project.members.slice(0, 3).map((member) => (
                            <img
                                key={member._id}
                                src={member.avatar}
                                alt={member.name}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                title={member.name}
                            />
                        ))}
                    </div>
                    {project.members && project.members.length > 3 && (
                        <span className="ml-2 text-xs text-slate-600 font-semibold">
                            +{project.members.length - 3} more
                        </span>
                    )}
                </div>

                {/* Due Date */}
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(project.endDate)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
