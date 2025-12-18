import TaskCard from './TaskCard';

const Board = ({ tasks, onTaskMove, onTaskClick }) => {
    const columns = [
        { id: 'todo', title: 'To Do', color: 'border-slate-400' },
        { id: 'in-progress', title: 'In Progress', color: 'border-blue-400' },
        { id: 'review', title: 'Review', color: 'border-amber-400' },
        { id: 'done', title: 'Done', color: 'border-green-400' },
    ];

    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    const getColumnIcon = (status) => {
        const icons = {
            'todo': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            'in-progress': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            'review': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            'done': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        };
        return icons[status];
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => {
                const columnTasks = getTasksByStatus(column.id);
                return (
                    <div key={column.id} className="flex flex-col">
                        {/* Column Header */}
                        <div className={`flex items-center justify-between mb-4 pb-3 border-b-4 ${column.color}`}>
                            <div className="flex items-center space-x-2">
                                <div className="text-slate-700">
                                    {getColumnIcon(column.id)}
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg">{column.title}</h3>
                            </div>
                            <span className="bg-slate-200 text-slate-700 font-bold text-sm px-3 py-1 rounded-full">
                                {columnTasks.length}
                            </span>
                        </div>

                        {/* Column Content */}
                        <div className="kanban-column flex-1 custom-scrollbar overflow-y-auto">
                            {columnTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-sm font-medium">No tasks</p>
                                </div>
                            ) : (
                                columnTasks.map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onStatusChange={onTaskMove}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Board;
