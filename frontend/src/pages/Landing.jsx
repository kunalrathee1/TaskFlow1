import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            title: 'Task Management',
            description: 'Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Team Collaboration',
            description: 'Work together seamlessly. Add team members, assign tasks, and communicate through comments.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Analytics & Insights',
            description: 'Visualize your progress with beautiful charts and comprehensive project statistics.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Deadline Tracking',
            description: 'Never miss a deadline. Get visual indicators for overdue tasks and upcoming due dates.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
            title: 'Real-time Comments',
            description: 'Discuss tasks directly within the platform. Keep all communication in one place.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
            title: 'Kanban Boards',
            description: 'Organize tasks visually with drag-and-drop Kanban boards. See your workflow at a glance.',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>

                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="animate-slide-up">
                            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                                Manage Projects Like a{' '}
                                <span className="gradient-text">Pro</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                TaskFlow helps teams organize, track, and collaborate on projects efficiently.
                                From planning to completion, manage everything in one beautiful platform.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {isAuthenticated ? (
                                    <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-4">
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/signup" className="btn btn-primary text-lg px-8 py-4">
                                            Get Started Free
                                        </Link>
                                        <Link to="/login" className="btn btn-outline text-lg px-8 py-4">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12">
                                <div>
                                    <div className="text-3xl font-bold gradient-text">10K+</div>
                                    <div className="text-sm text-slate-600 mt-1">Active Users</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold gradient-text">50K+</div>
                                    <div className="text-sm text-slate-600 mt-1">Projects</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold gradient-text">99.9%</div>
                                    <div className="text-sm text-slate-600 mt-1">Uptime</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Hero Image */}
                        <div className="relative animate-fade-in">
                            <div className="glass-card p-8">
                                <div className="space-y-4">
                                    {/* Mock Task Cards */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">Design Homepage</span>
                                            <span className="bg-white/20 px-2 py-1 rounded text-xs">High</span>
                                        </div>
                                        <div className="text-sm opacity-90">Due: Tomorrow</div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">API Integration</span>
                                            <span className="bg-white/20 px-2 py-1 rounded text-xs">Medium</span>
                                        </div>
                                        <div className="text-sm opacity-90">In Progress</div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">Code Review</span>
                                            <span className="bg-white/20 px-2 py-1 rounded text-xs">Low</span>
                                        </div>
                                        <div className="text-sm opacity-90">Completed ✓</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Powerful features to help your team stay organized and productive
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card card-hover group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl lg:text-5xl font-black mb-6">
                        Ready to Transform Your Workflow?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of teams already using TaskFlow to manage their projects efficiently
                    </p>
                    {!isAuthenticated && (
                        <Link to="/signup" className="btn bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 inline-block">
                            Start Free Today
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Landing;
