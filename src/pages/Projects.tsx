import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore, Project } from '../store/projectStore';
import {
    Plus,
    Search,
    MoreHorizontal,
    Calendar,
    CheckCircle,
    Folder,
    Grid,
    List,
    Star,
    Edit3,
    Trash2,
    Copy,
    Eye,
    X,
    ArrowLeft,
    Clock,
    Users,
    FileText,
    AlertTriangle,
    CheckSquare
} from 'lucide-react';

interface ProjectsProps {
    userName: string;
}

const Projects: React.FC<ProjectsProps> = ({ userName }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [viewingProject, setViewingProject] = useState<Project | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Form state for new/edit project
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        description: '',
        dueDate: '',
        priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
        status: 'Active' as 'Active' | 'On Hold' | 'Completed' | 'At Risk'
    });

    const { projects, addProject, updateProject, deleteProject, toggleStar, updateProjectTask } = useProjectStore();

    // Removed local projects state declaration and initial data


    const statusColors: Record<string, { bg: string; text: string }> = {
        'Active': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
        'On Hold': { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' },
        'Completed': { bg: 'rgba(79, 127, 242, 0.15)', text: 'var(--omnicom-blue)' },
        'At Risk': { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
    };

    const priorityColors: Record<string, string> = {
        'Low': '#6b7280',
        'Medium': '#eab308',
        'High': '#f97316',
        'Critical': '#ef4444'
    };

    const filteredProjects = projects.filter(p => {
        const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.client.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleToggleStar = (id: string) => {
        toggleStar(id);
    };

    const handleView = (project: Project) => {
        setViewingProject(project);
        setActiveMenu(null);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            client: project.client,
            description: project.description,
            dueDate: project.dueDate,
            priority: project.priority,
            status: project.status
        });
        setActiveMenu(null);
    };

    const handleDuplicate = (project: Project) => {
        const newProject: Project = {
            ...project,
            id: Date.now().toString(),
            name: `${project.name} (Copy)`,
            progress: 0,
            status: 'Active',
            starred: false,
            tasks: project.tasks.map(t => ({ ...t, id: `${t.id}-copy`, completed: false })),
            recentActivity: [{ action: 'Project duplicated', user: userName, time: 'Just now' }]
        };
        addProject(newProject);
        setActiveMenu(null);
    };

    const handleDelete = (id: string) => {
        deleteProject(id);
        setShowDeleteConfirm(null);
        setActiveMenu(null);
    };

    const handleSaveEdit = () => {
        if (!editingProject) return;
        updateProject(editingProject.id, {
            name: formData.name,
            client: formData.client,
            description: formData.description,
            dueDate: formData.dueDate,
            priority: formData.priority,
            status: formData.status
        });
        setEditingProject(null);
    };

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        addProject({
            name: formData.name,
            client: formData.client,
            description: formData.description,
            status: 'Active',
            dueDate: formData.dueDate,
            team: [{ name: userName, role: 'Project Lead', avatar: userName.charAt(0) }],
            priority: formData.priority
        });
        setShowNewProjectModal(false);
        setFormData({ name: '', client: '', description: '', dueDate: '', priority: 'Medium', status: 'Active' });
    };

    const toggleTaskComplete = (projectId: string, taskId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return;

        updateProjectTask(projectId, taskId, !task.completed);
        // Also update viewing project if open
        if (viewingProject && viewingProject.id === projectId) {
            const updated = projects.find(p => p.id === projectId);
            if (updated) {
                const updatedTasks = updated.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
                setViewingProject({ ...updated, tasks: updatedTasks });
            }
        }
    };

    return (
        <div style={{ padding: '32px', width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Folder size={28} color="var(--omnicom-blue)" />
                        Projects
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '0.95rem' }}>
                        {projects.length} active projects across your workspace
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNewProjectModal(true)}
                    className="btn-primary"
                    style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={18} /> New Project
                </motion.button>
            </div>

            {/* Filters & Search */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px 12px 44px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            color: 'white',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 'Active', 'On Hold', 'At Risk', 'Completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: filterStatus === status ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.05)',
                                color: filterStatus === status ? 'white' : 'rgba(255,255,255,0.6)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
                    <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Grid size={18} />
                    </button>
                    <button onClick={() => setViewMode('list')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', color: viewMode === 'list' ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Projects Grid/List */}
            <div style={{
                display: viewMode === 'grid' ? 'grid' : 'flex',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : 'none',
                flexDirection: viewMode === 'list' ? 'column' : 'row',
                gap: '20px'
            }}>
                <AnimatePresence>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-dark"
                            onClick={() => handleView(project)}
                            style={{ padding: '24px', borderRadius: '20px', cursor: 'pointer', position: 'relative', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            {/* Header Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleToggleStar(project.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                            <Star size={18} fill={project.starred ? '#eab308' : 'transparent'} color={project.starred ? '#eab308' : 'rgba(255,255,255,0.3)'} />
                                        </motion.button>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: 0 }}>{project.name}</h3>
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>{project.client}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: statusColors[project.status].bg, color: statusColors[project.status].text }}>{project.status}</span>
                                    <div style={{ position: 'relative' }}>
                                        <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === project.id ? null : project.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', color: 'rgba(255,255,255,0.4)' }}>
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <AnimatePresence>
                                            {activeMenu === project.id && (
                                                <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', minWidth: '150px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); handleView(project); }} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                        <Eye size={16} /> View
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(project); }} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                        <Edit3 size={16} /> Edit
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDuplicate(project); }} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                        <Copy size={16} /> Duplicate
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(project.id); setActiveMenu(null); }} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Progress</span>
                                    <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{project.progress}%</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 0.8, delay: index * 0.1 }} style={{ height: '100%', background: project.progress === 100 ? '#22c55e' : 'linear-gradient(90deg, var(--omnicom-blue), var(--omnicom-coral))', borderRadius: '3px' }} />
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                        <Calendar size={14} />
                                        {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                        <CheckCircle size={14} />
                                        {project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks
                                    </div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    {project.team.slice(0, 3).map((member, i) => (
                                        <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: `hsl(${(i * 60) + 200}, 70%, 50%)`, border: '2px solid #0a0a0a', marginLeft: i > 0 ? '-8px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'white' }}>{member.avatar}</div>
                                    ))}
                                    {project.team.length > 3 && (
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: '2px solid #0a0a0a', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>+{project.team.length - 3}</div>
                                    )}
                                </div>
                            </div>

                            {/* Priority Indicator */}
                            <div style={{ position: 'absolute', top: '24px', right: '80px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: priorityColors[project.priority] }} title={`${project.priority} Priority`} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.4)' }}>
                    <Folder size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No projects found</p>
                    <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters or create a new project</p>
                </div>
            )}

            {/* View Project Modal */}
            <AnimatePresence>
                {viewingProject && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingProject(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '40px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: statusColors[viewingProject.status].bg, color: statusColors[viewingProject.status].text }}>{viewingProject.status}</span>
                                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: priorityColors[viewingProject.priority], color: 'white' }}>{viewingProject.priority}</span>
                                    </div>
                                    <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>{viewingProject.name}</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>{viewingProject.client}</p>
                                </div>
                                <button onClick={() => setViewingProject(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '8px' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Description</h4>
                                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{viewingProject.description}</p>
                            </div>

                            {/* Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '8px' }}>Progress</p>
                                    <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{viewingProject.progress}%</p>
                                </div>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '8px' }}>Tasks</p>
                                    <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{viewingProject.tasks.filter(t => t.completed).length}/{viewingProject.tasks.length}</p>
                                </div>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '8px' }}>Team</p>
                                    <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{viewingProject.team.length}</p>
                                </div>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '8px' }}>Due Date</p>
                                    <p style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>{new Date(viewingProject.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Tasks */}
                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckSquare size={16} /> Tasks</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {viewingProject.tasks.map(task => (
                                        <div key={task.id} onClick={() => toggleTaskComplete(viewingProject.id, task.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: task.completed ? 'none' : '2px solid rgba(255,255,255,0.2)', backgroundColor: task.completed ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                                {task.completed && <CheckCircle size={14} color="white" />}
                                            </div>
                                            <span style={{ flex: 1, color: task.completed ? 'rgba(255,255,255,0.4)' : 'white', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{task.assignee}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Team */}
                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Team</h4>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {viewingProject.team.map((member, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `hsl(${(i * 60) + 200}, 70%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{member.avatar}</div>
                                            <div>
                                                <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{member.name}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: 0 }}>{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> Recent Activity</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {viewingProject.recentActivity.map((activity, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--omnicom-blue)' }} />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ color: 'white', fontSize: '0.9rem', margin: 0 }}>{activity.action}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>by {activity.user}</p>
                                            </div>
                                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Project Modal */}
            <AnimatePresence>
                {editingProject && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProject(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ color: 'white', marginBottom: '24px', fontSize: '1.5rem' }}>Edit Project</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Client</label>
                                    <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                            <option value="Active">Active</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="At Risk">At Risk</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
                                        <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Due Date</label>
                                    <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setEditingProject(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem' }}>Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <AlertTriangle size={32} color="#ef4444" />
                            </div>
                            <h2 style={{ color: 'white', marginBottom: '12px', fontSize: '1.3rem' }}>Delete Project?</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>This action cannot be undone. All tasks and data will be permanently deleted.</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Cancel</button>
                                <button onClick={() => handleDelete(showDeleteConfirm)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Project Modal */}
            <AnimatePresence>
                {showNewProjectModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewProjectModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ color: 'white', marginBottom: '24px', fontSize: '1.5rem' }}>Create New Project</h2>
                            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project Name</label>
                                    <input type="text" required placeholder="Enter project name..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Client</label>
                                    <input type="text" required placeholder="Client or department..." value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                                    <textarea placeholder="Project description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
                                        <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Due Date</label>
                                        <input type="date" required value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setShowNewProjectModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem' }}>Create Project</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
