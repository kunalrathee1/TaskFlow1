import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
    const navigate = useNavigate();

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'badge-low',
            medium: 'badge-medium',
            high: 'badge-high',
            urgent: 'badge-urgent',
        };
        return colors[priority] || 'badge-low';
    };

    const getStatusColor = (status) => {
        const colors = {
            'todo': 'badge-todo',
            'in-progress': 'badge-in-progress',
            'review': 'badge-review',
            'done': 'badge-done',
        };
        return colors[status] || 'badge-todo';
    };

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isOverdue = () => {
        if (!task.dueDate || task.status === 'done') return false;
        return new Date(task.dueDate) < new Date();
    };

    return (
        <div
            className="kanban-card group"
            onClick={() => navigate(`/tasks/${task._id}`)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 flex-1 pr-2">
                    {task.title}
                </h3>
                <span className={`badge ${getPriorityColor(task.priority)} text-xs`}>
                    {task.priority}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {task.description}
            </p>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                    {task.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                            +{task.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                {/* Assignee */}
                <div className="flex items-center space-x-2">
                    {task.assignedTo ? (
                        <>
                            <img
                                src={task.assignedTo.avatar}
                                alt={task.assignedTo.name}
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                title={task.assignedTo.name}
                            />
                            <span className="text-xs text-slate-600">{task.assignedTo.name}</span>
                        </>
                    ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                    )}
                </div>

                {/* Due Date */}
                {task.dueDate && (
                    <div className={`flex items-center space-x-1 text-xs ${isOverdue() ? 'text-red-600 font-semibold' : 'text-slate-500'
                        }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(task.dueDate)}</span>
                    </div>
                )}
            </div>

            {/* Comments Count */}
            {task.comments && task.comments.length > 0 && (
                <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
