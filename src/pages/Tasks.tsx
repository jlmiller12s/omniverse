import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, Task } from '../store/taskStore';
import {
    CheckSquare,
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    Flag,
    MoreHorizontal,
    CheckCircle,
    Circle,
    AlertCircle,
    Edit3,
    Trash2,
    X,
    ChevronDown,
    Users,
    Folder,
    Bell,
    ArrowRight
} from 'lucide-react';

// Task interface imported from taskStore

interface TasksProps {
    userName: string;
    onNotification?: (notification: { title: string; message: string; type: 'info' | 'success' | 'warning' }) => void;
}

const Tasks: React.FC<TasksProps> = ({ userName, onNotification }) => {
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterPriority, setFilterPriority] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState<Task | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);

    const teamMembers = [
        { id: '1', name: 'Alex Morgan', role: 'Project Lead', avatar: 'A' },
        { id: '2', name: 'Sarah Chen', role: 'Creative Director', avatar: 'S' },
        { id: '3', name: 'James Wilson', role: 'Strategy', avatar: 'J' },
        { id: '4', name: 'Mike Rodriguez', role: 'Technical Lead', avatar: 'M' },
        { id: '5', name: 'Lisa Thompson', role: 'HR Specialist', avatar: 'L' }
    ];

    // Use shared task store (includes tasks created via Voice Flow)
    const tasks = useTaskStore((state) => state.tasks);
    const addTaskToStore = useTaskStore((state) => state.addTask);
    const updateTaskInStore = useTaskStore((state) => state.updateTask);
    const deleteTaskFromStore = useTaskStore((state) => state.deleteTask);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        project: '',
        assignee: userName,
        dueDate: '',
        priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
        tags: ''
    });

    const priorityColors: Record<string, { bg: string; text: string }> = {
        'Low': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
        'Medium': { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' },
        'High': { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' },
        'Critical': { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
    };

    const statusColors: Record<string, { bg: string; text: string }> = {
        'To Do': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
        'In Progress': { bg: 'rgba(79, 127, 242, 0.15)', text: 'var(--omnicom-blue)' },
        'Review': { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7' },
        'Done': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUser = task.assignee === userName;
        return matchesStatus && matchesPriority && matchesSearch && matchesUser;
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        const task = addTaskToStore({
            title: newTask.title,
            description: newTask.description,
            project: newTask.project || 'General',
            assignee: newTask.assignee,
            dueDate: newTask.dueDate,
            priority: newTask.priority,
            status: 'To Do',
            tags: newTask.tags.split(',').map(t => t.trim()).filter(t => t),
        });
        setShowNewTaskModal(false);
        setNewTask({ title: '', description: '', project: '', assignee: userName, dueDate: '', priority: 'Medium', tags: '' });

        // Trigger notification
        if (onNotification) {
            onNotification({
                title: 'Task Created',
                message: `"${task.title}" has been assigned to ${task.assignee}`,
                type: 'success'
            });
        }
    };

    const handleAssignTask = (taskId: string, assigneeName: string) => {
        updateTaskInStore(taskId, { assignee: assigneeName });
        setShowAssignModal(null);

        if (onNotification) {
            const task = tasks.find(t => t.id === taskId);
            onNotification({
                title: 'Task Assigned',
                message: `"${task?.title}" has been assigned to ${assigneeName}`,
                type: 'info'
            });
        }
    };

    const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
        updateTaskInStore(taskId, { status: newStatus });
        setActiveMenu(null);
    };

    const deleteTask = (taskId: string) => {
        deleteTaskFromStore(taskId);
        setActiveMenu(null);
    };

    const tutorialSteps = [
        {
            title: 'Welcome to Task Management',
            content: 'This is your personal task dashboard. Here you can see all tasks assigned to you, create new tasks, and assign tasks to team members.'
        },
        {
            title: 'Creating a New Task',
            content: 'Click the "+ New Task" button to create a new task. Fill in the title, description, project, due date, and priority. You can also assign it to yourself or a team member.'
        },
        {
            title: 'Assigning Tasks',
            content: 'To assign a task to someone, click the three-dot menu on any task card and select "Assign". Choose a team member from the list and they will receive a notification.'
        },
        {
            title: 'Filtering & Searching',
            content: 'Use the filters at the top to filter by status or priority. The search bar lets you quickly find tasks by title or project name.'
        },
        {
            title: 'Notifications',
            content: 'When you create or assign a task, a notification will appear in the notification bell at the top of the screen. Team members will also receive notifications for tasks assigned to them.'
        }
    ];

    return (
        <div style={{ padding: '32px', width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckSquare size={28} color="var(--omnicom-blue)" />
                        My Tasks
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '0.95rem' }}>
                        {filteredTasks.length} tasks assigned to you
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTutorial(true)}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: 'transparent',
                            color: 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Bell size={18} /> How to Assign Tasks
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowNewTaskModal(true)}
                        className="btn-primary"
                        style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> New Task
                    </motion.button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 'To Do', 'In Progress', 'Review', 'Done'].map(status => (
                        <button key={status} onClick={() => setFilterStatus(status)} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', backgroundColor: filterStatus === status ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.05)', color: filterStatus === status ? 'white' : 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                            {status}
                        </button>
                    ))}
                </div>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.85rem', outline: 'none' }}>
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
            </div>

            {/* Task Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'To Do', count: tasks.filter(t => t.assignee === userName && t.status === 'To Do').length, color: '#6b7280' },
                    { label: 'In Progress', count: tasks.filter(t => t.assignee === userName && t.status === 'In Progress').length, color: 'var(--omnicom-blue)' },
                    { label: 'Review', count: tasks.filter(t => t.assignee === userName && t.status === 'Review').length, color: '#a855f7' },
                    { label: 'Done', count: tasks.filter(t => t.assignee === userName && t.status === 'Done').length, color: '#22c55e' }
                ].map(stat => (
                    <div key={stat.label} className="glass-dark" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>{stat.label}</p>
                        <p style={{ color: stat.color, fontSize: '2rem', fontWeight: 700, margin: '8px 0 0' }}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Tasks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                    {filteredTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-dark"
                            style={{ padding: '20px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: activeMenu === task.id ? 50 : 1 }}
                        >
                            {/* Checkbox */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateTaskStatus(task.id, task.status === 'Done' ? 'To Do' : 'Done')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                {task.status === 'Done' ? (
                                    <CheckCircle size={24} color="#22c55e" />
                                ) : (
                                    <Circle size={24} color="rgba(255,255,255,0.3)" />
                                )}
                            </motion.button>

                            {/* Task Content */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: task.status === 'Done' ? 'rgba(255,255,255,0.4)' : 'white', margin: 0, textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>
                                        {task.title}
                                    </h3>
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: priorityColors[task.priority].bg, color: priorityColors[task.priority].text }}>
                                        {task.priority}
                                    </span>
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: statusColors[task.status].bg, color: statusColors[task.status].text }}>
                                        {task.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Folder size={14} /> {task.project}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    {task.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {task.tags.map(tag => (
                                                <span key={tag} style={{ padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.75rem' }}>{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ position: 'relative' }}>
                                <button onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: 'rgba(255,255,255,0.4)' }}>
                                    <MoreHorizontal size={20} />
                                </button>
                                <AnimatePresence>
                                    {activeMenu === task.id && (
                                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', minWidth: '180px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                            <button onClick={() => { setShowAssignModal(task); setActiveMenu(null); }} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <Users size={16} /> Assign to...
                                            </button>
                                            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                                            {['To Do', 'In Progress', 'Review', 'Done'].map(status => (
                                                <button key={status} onClick={() => updateTaskStatus(task.id, status as Task['status'])} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderRadius: '8px', backgroundColor: task.status === status ? 'rgba(79, 127, 242, 0.1)' : 'transparent', color: task.status === status ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }} onMouseEnter={(e) => { if (task.status !== status) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }} onMouseLeave={(e) => { if (task.status !== status) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                                    {status === 'Done' ? <CheckCircle size={16} /> : <Circle size={16} />} {status}
                                                </button>
                                            ))}
                                            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                                            <button onClick={() => deleteTask(task.id)} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.4)' }}>
                    <CheckSquare size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No tasks found</p>
                    <p style={{ fontSize: '0.9rem' }}>Create a new task or adjust your filters</p>
                </div>
            )}

            {/* New Task Modal */}
            <AnimatePresence>
                {showNewTaskModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewTaskModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ color: 'white', marginBottom: '24px', fontSize: '1.5rem' }}>Create New Task</h2>
                            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Task Title *</label>
                                    <input type="text" required placeholder="What needs to be done?" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                                    <textarea placeholder="Add details..." value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project</label>
                                        <input type="text" placeholder="Project name..." value={newTask.project} onChange={(e) => setNewTask({ ...newTask, project: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Assign To</label>
                                        <select value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                            {teamMembers.map(m => (<option key={m.id} value={m.name}>{m.name}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Due Date *</label>
                                        <input type="date" required value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
                                        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Tags (comma separated)</label>
                                    <input type="text" placeholder="Design, Review, Marketing..." value={newTask.tags} onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setShowNewTaskModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem' }}>Create Task</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assign Task Modal */}
            <AnimatePresence>
                {showAssignModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAssignModal(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ color: 'white', marginBottom: '8px', fontSize: '1.3rem' }}>Assign Task</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px', fontSize: '0.9rem' }}>"{showAssignModal.title}"</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {teamMembers.map(member => (
                                    <motion.button
                                        key={member.id}
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        onClick={() => handleAssignTask(showAssignModal.id, member.name)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            border: showAssignModal.assignee === member.name ? '1px solid var(--omnicom-blue)' : '1px solid rgba(255,255,255,0.05)',
                                            backgroundColor: showAssignModal.assignee === member.name ? 'rgba(79, 127, 242, 0.1)' : 'rgba(255,255,255,0.02)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--omnicom-blue), #3a6cd9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>{member.avatar}</div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ color: 'white', margin: 0, fontWeight: 600 }}>{member.name}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.8rem' }}>{member.role}</p>
                                        </div>
                                        {showAssignModal.assignee === member.name && <CheckCircle size={20} color="var(--omnicom-blue)" />}
                                    </motion.button>
                                ))}
                            </div>
                            <button onClick={() => setShowAssignModal(null)} style={{ width: '100%', marginTop: '20px', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem' }}>Cancel</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tutorial Modal */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTutorial(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem' }}>📚 Task Assignment Tutorial</h2>
                                <button onClick={() => setShowTutorial(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><X size={24} /></button>
                            </div>

                            {/* Progress Dots */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
                                {tutorialSteps.map((_, i) => (
                                    <div key={i} onClick={() => setTutorialStep(i)} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: i === tutorialStep ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s' }} />
                                ))}
                            </div>

                            <div style={{ minHeight: '150px' }}>
                                <h3 style={{ color: 'var(--omnicom-blue)', fontSize: '1.1rem', marginBottom: '12px' }}>
                                    Step {tutorialStep + 1}: {tutorialSteps[tutorialStep].title}
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                                    {tutorialSteps[tutorialStep].content}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button disabled={tutorialStep === 0} onClick={() => setTutorialStep(tutorialStep - 1)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: tutorialStep === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', cursor: tutorialStep === 0 ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>Previous</button>
                                {tutorialStep < tutorialSteps.length - 1 ? (
                                    <button onClick={() => setTutorialStep(tutorialStep + 1)} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Next <ArrowRight size={18} /></button>
                                ) : (
                                    <button onClick={() => setShowTutorial(false)} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem' }}>Got it!</button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tasks;
