import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Briefcase,
    CheckSquare,
    LayoutDashboard,
    Users,
    Zap,
    Plus,
    Compass,
    Bell,
    Archive,
    ArrowRight,
    Check,
    LogOut,
    Sparkles,
    ChevronDown,
    Info,
    AlertTriangle,
    CheckCircle,
    FileText,
    Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import WorkflowForge, { WorkflowType } from './pages/WorkflowForge';
import WorkflowRegistry, { WorkflowRecord } from './pages/WorkflowRegistry';
import TeamsPermissions, { User } from './pages/TeamsPermissions';
import Projects from './pages/Projects';
import Planning from './pages/Planning';
import Tasks from './pages/Tasks';
import SOWGenerator from './pages/SOWGenerator';
import Login from './pages/Login';
import OnboardingTutorial, { TutorialStep } from './components/OnboardingTutorial';

import VoiceFlowAgent from './components/VoiceFlowAgent';
import { useTaskStore } from './store/taskStore';
import { useProjectStore } from './store/projectStore';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type Persona = 'Executive' | 'Campaign Manager' | 'Task Owner' | 'Approver' | 'Project Owner';
type View = 'dashboard' | 'projects' | 'planning' | 'tasks' | 'sow' | 'briefs' | 'archive' | 'teams' | 'forge' | 'registry';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning';
    read: boolean;
    actionUrl?: View; // Navigation target when clicked
}

const App: React.FC = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name: string, role: string } | null>(null);
    const [currentPersona, setCurrentPersona] = useState<Persona>('Executive');

    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [clearingNotifications, setClearingNotifications] = useState(false);
    const [isVoiceFlowOpen, setIsVoiceFlowOpen] = useState(false);

    // Task and Project stores for Voice Flow integration
    const addTask = useTaskStore((state) => state.addTask);
    const { projects, addProject, updateProject } = useProjectStore();

    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', title: 'Workflow Approved', message: 'Pepsi Summer Refresh has been signed off.', time: '2m ago', type: 'success', read: false, actionUrl: 'registry' },
        { id: '2', title: 'System Alert', message: 'API latency increasing in EMEA region.', time: '15m ago', type: 'warning', read: false, actionUrl: 'dashboard' },
        { id: '3', title: 'New Stakeholder', message: 'Sarah Chen added to Project Vision.', time: '1h ago', type: 'info', read: true, actionUrl: 'teams' },
    ]);
    const [showTutorial, setShowTutorial] = useState(() => {
        return localStorage.getItem('tutorial_completed') !== 'true';
    });

    const tutorialSteps: TutorialStep[] = [
        {
            targetId: 'center',
            title: 'Welcome to Omniverse',
            content: 'Your central hub for autonomous business workflows. Let us show you around the new universal engine.',
            position: 'center'
        },
        {
            targetId: 'sidebar-nav',
            title: 'Intelligent Navigation',
            content: 'Access the Workflow Forge to create new processes, or browse the Registry to audit existing ones.',
            position: 'right'
        },
        {
            targetId: 'quick-workflows-area',
            title: 'Quick Actions',
            content: 'Need to start an IT incident or HR onboarding? Use these pre-built templates for 1-click execution.',
            position: 'top'
        },
        {
            targetId: 'ai-assistant-orb',
            title: 'AI Assistant',
            content: 'The orb is always watching. Ask it to generate reports, find workflows, or automate repetitive tasks.',
            position: 'left'
        }
    ];

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        localStorage.setItem('tutorial_completed', 'true');
    };

    // Central State
    const [briefs, setBriefs] = useState<WorkflowRecord[]>([
        { id: '1', campaignName: 'Pepsi Summer Refresh', client: 'PepsiCo', date: '2025-12-15', status: 'Approved', content: 'Initial strategy for Pepsi Summer Refresh...', type: 'Creative' },
        { id: '2', campaignName: 'Apple Vision Pro Release', client: 'Apple', date: '2025-12-10', status: 'Sent', content: 'Launch plan for Apple Vision Pro...', type: 'Creative' }
    ]);

    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'Alex Morgan', email: 'alex@omnicom.com', role: 'Executive', status: 'Active' },
        { id: '2', name: 'Sarah Chen', email: 'sarah.c@omnicom.com', role: 'Project Owner', status: 'Active' },
        { id: '3', name: 'James Wilson', email: 'james.w@omnicom.com', role: 'Approver', status: 'Pending' }
    ]);

    const personas: Persona[] = ['Executive', 'Campaign Manager', 'Project Owner', 'Task Owner', 'Approver'];

    const handleLogin = (userData: { name: string, role: string }) => {
        setUser(userData);
        setCurrentPersona(userData.role as Persona);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setCurrentView('dashboard');
    };

    useGSAP(() => {
        if (isAuthenticated && document.querySelector(".view-container")) {
            gsap.fromTo(".view-container",
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out", clearProps: "all" }
            );
        }
    }, { dependencies: [currentView, isAuthenticated] });

    const handleSaveBrief = (newWorkflow: { campaignName: string, client: string, content: string, type: WorkflowType }) => {
        const id = (briefs.length + 1).toString();
        const date = new Date().toISOString().split('T')[0];
        setBriefs([{ ...newWorkflow, id, date, status: 'Draft' }, ...briefs]);
        setToast(`Workflow "${newWorkflow.campaignName}" initiated.`);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddUser = (userData: Omit<User, 'id'>) => {
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            ...userData
        };
        setUsers([...users, newUser]);
        setToast(`User ${userData.name} added to workspace.`);
        setTimeout(() => setToast(null), 3000);
    };

    const handleRemoveUser = (id: string) => {
        const userToRemove = users.find(u => u.id === id);
        setUsers(users.filter(u => u.id !== id));
        if (userToRemove) {
            setToast(`User ${userToRemove.name} removed from workspace.`);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleUpdateUser = (id: string, updates: Partial<User>) => {
        setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (

        <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: 'var(--text-primary)', position: 'relative' }}>
            {/* Background Atmosphere */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% -20%, #1a1a1a 0%, #050505 100%)', pointerEvents: 'none', zIndex: -1 }} />
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="glass-dark"
                style={{
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid var(--border-subtle)'
                }}
            >
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: 'var(--omnicom-coral)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>O</div>
                    {isSidebarOpen && <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'white', letterSpacing: '-0.5px' }}>Omniverse</h1>}
                </div>

                <nav id="sidebar-nav" style={{ flex: 1, padding: '12px' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                            active={currentView === 'dashboard'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('dashboard')}
                        />
                        <NavItem
                            id="workflow-forge-link"
                            icon={<Zap size={20} />}
                            label="Workflow Forge"
                            active={currentView === 'forge'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('forge')}
                        />
                        <NavItem
                            id="workflow-registry-link"
                            icon={<Archive size={20} />}
                            label="Workflow Registry"
                            active={currentView === 'registry'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('registry')}
                        />
                        <NavItem
                            icon={<Briefcase size={20} />}
                            label="Projects"
                            active={currentView === 'projects'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('projects')}
                        />
                        <NavItem
                            icon={<BarChart3 size={20} />}
                            label="Planning"
                            active={currentView === 'planning'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('planning')}
                        />
                        <NavItem
                            icon={<CheckSquare size={20} />}
                            label="My Tasks"
                            active={currentView === 'tasks'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('tasks')}
                        />
                        <NavItem
                            icon={<Users size={20} />}
                            label="Teams & Roles"
                            active={currentView === 'teams'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('teams')}
                        />
                        <NavItem
                            icon={<FileText size={20} />}
                            label="SOW Generator"
                            active={currentView === 'sow'}
                            isOpen={isSidebarOpen}
                            onClick={() => setCurrentView('sow')}
                        />
                    </ul>

                    {/* Voice Flow Button */}
                    <div style={{ marginTop: '16px', padding: '8px' }}>
                        <motion.button
                            onClick={() => setIsVoiceFlowOpen(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: isSidebarOpen ? '14px 16px' : '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--omnicom-coral) 0%, #ff6b5b 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(234, 88, 77, 0.3)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                            }}
                        >
                            <Mic size={20} />
                            {isSidebarOpen && 'Voice Flow'}
                        </motion.button>
                    </div>
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--omnicom-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.name.charAt(0)}
                        </div>
                        {isSidebarOpen && (
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', margin: 0, whiteSpace: 'nowrap' }}>{user?.name}</p>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{currentPersona}</p>
                            </div>
                        )}
                    </div>
                    {isSidebarOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                            <button
                                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    fontFamily: 'var(--font-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span>{currentPersona}</span>
                                <motion.div animate={{ rotate: isPersonaMenuOpen ? 180 : 0 }}>
                                    <ChevronDown size={16} style={{ opacity: 0.5 }} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isPersonaMenuOpen && (
                                    <>
                                        <div
                                            style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                                            onClick={() => setIsPersonaMenuOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '100%',
                                                left: 0,
                                                right: 0,
                                                marginBottom: '12px',
                                                backgroundColor: '#1a1a1a',
                                                borderRadius: '16px',
                                                border: '1px solid var(--border-subtle)',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                padding: '8px',
                                                zIndex: 110,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {personas.map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => {
                                                        setCurrentPersona(p);
                                                        setIsPersonaMenuOpen(false);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        backgroundColor: currentPersona === p ? 'rgba(79, 127, 242, 0.1)' : 'transparent',
                                                        color: currentPersona === p ? 'var(--omnicom-blue)' : 'white',
                                                        textAlign: 'left',
                                                        fontSize: '0.85rem',
                                                        fontWeight: currentPersona === p ? 600 : 400,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (currentPersona !== p) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (currentPersona !== p) e.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => setShowTutorial(true)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                            >
                                <Sparkles size={18} />
                                {isSidebarOpen && <span>Tutorial</span>}
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '8px' }}
                            >
                                <LogOut size={18} />
                                {isSidebarOpen && <span>Log Out</span>}
                            </button>
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <header style={{
                    height: 'var(--header-height)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: 'white' }}>
                            Welcome back, <span className="serif" style={{ color: 'var(--omnicom-coral)' }}>{user?.name.split(' ')[0]}</span>
                        </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: isNotificationMenuOpen ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: isNotificationMenuOpen ? 'rgba(79, 127, 242, 0.1)' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isNotificationMenuOpen) e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isNotificationMenuOpen) e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                                }}
                            >
                                <Bell size={20} />
                                {notifications.some(n => !n.read) && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 6,
                                        width: '8px',
                                        height: '8px',
                                        background: 'var(--omnicom-coral)',
                                        borderRadius: '50%',
                                        border: '2px solid var(--bg-surface)'
                                    }}></div>
                                )}
                            </button>

                            {/* Voice Flow Header Button */}
                            <motion.button
                                onClick={() => setIsVoiceFlowOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'linear-gradient(135deg, var(--omnicom-coral) 0%, #ff6b5b 100%)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    boxShadow: '0 4px 12px rgba(234, 88, 77, 0.3)',
                                }}
                                title="Voice Flow - Control with your voice"
                            >
                                <Mic size={20} />
                            </motion.button>

                            <AnimatePresence>
                                {isNotificationMenuOpen && (
                                    <>
                                        <div
                                            style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                                            onClick={() => setIsNotificationMenuOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                marginTop: '12px',
                                                width: '320px',
                                                backgroundColor: '#1a1a1a',
                                                borderRadius: '20px',
                                                border: '1px solid var(--border-subtle)',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                zIndex: 110,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>Notifications</h3>
                                                <button
                                                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                                                    style={{ fontSize: '0.75rem', color: 'var(--omnicom-blue)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Mark all read
                                                </button>
                                            </div>
                                            <div style={{ maxHeight: '400px', overflowY: 'auto', overflow: 'hidden' }}>
                                                {notifications.length === 0 && !clearingNotifications ? (
                                                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                                                        <Bell size={32} style={{ marginBottom: '12px', opacity: 0.2 }} />
                                                        <p>No new notifications</p>
                                                    </div>
                                                ) : (
                                                    <AnimatePresence mode="popLayout">
                                                        {notifications.map((n, index) => (
                                                            <motion.div
                                                                key={n.id}
                                                                initial={{ opacity: 1, x: 0 }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    x: 320,
                                                                    transition: {
                                                                        duration: 0.3,
                                                                        delay: index * 0.1,
                                                                        ease: [0.4, 0, 0.2, 1]
                                                                    }
                                                                }}
                                                                style={{
                                                                    padding: '16px 20px',
                                                                    borderBottom: '1px solid var(--border-subtle)',
                                                                    backgroundColor: n.read ? 'transparent' : 'rgba(79, 127, 242, 0.08)',
                                                                    borderLeft: n.read ? 'none' : '2px solid var(--omnicom-blue)',
                                                                    cursor: 'pointer',
                                                                    transition: 'background-color 0.2s, border-left 0.2s'
                                                                }}
                                                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                                                onClick={() => {
                                                                    // Mark as read
                                                                    setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                                                                    // Navigate if actionUrl exists
                                                                    if (n.actionUrl) {
                                                                        setCurrentView(n.actionUrl);
                                                                        setIsNotificationMenuOpen(false);
                                                                    }
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                                    <div style={{
                                                                        color: n.type === 'success' ? '#10b981' : n.type === 'warning' ? '#f59e0b' : 'var(--omnicom-blue)'
                                                                    }}>
                                                                        {n.type === 'success' ? <CheckCircle size={18} /> : n.type === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>{n.title}</span>
                                                                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{n.time}</span>
                                                                        </div>
                                                                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                                                                    </div>
                                                                    {n.actionUrl && (
                                                                        <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                                                            <ArrowRight size={14} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                )}
                                            </div>
                                            {notifications.length > 0 && (
                                                <motion.button
                                                    whileHover={{ color: 'rgba(255,255,255,0.7)' }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        // Remove notifications one by one with visible stagger
                                                        const notificationIds = notifications.map(n => n.id);
                                                        notificationIds.forEach((id, index) => {
                                                            setTimeout(() => {
                                                                setNotifications(prev => prev.filter(n => n.id !== id));
                                                            }, index * 150); // 150ms delay between each removal
                                                        });
                                                    }}
                                                    style={{ width: '100%', padding: '12px', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none', borderTop: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                                                >
                                                    Clear all notifications
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setCurrentView('forge')}>
                            <Plus size={18} /> New Workflow
                        </button>
                    </div>
                </header>

                <div className="view-container" style={{ padding: '32px', flex: 1, opacity: 0 }}>
                    <AnimatePresence mode="wait">
                        <div key={currentView + currentPersona}>
                            {currentView === 'dashboard' && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                        <DashboardCard title="Active Campaigns" value={currentPersona === 'Executive' ? "48" : "12"} change="+2 from last week" />
                                        <DashboardCard title="Budget Utilization" value={currentPersona === 'Executive' ? "$4.2M" : "$1.2M"} change="84% of total" />
                                        <DashboardCard title="Upcoming Deadlines" value={currentPersona === 'Approver' ? "8" : "4"} color="var(--omnicom-coral)" />
                                    </div>

                                    <div style={{ marginTop: '40px' }}>
                                        <h3 style={{ marginBottom: '32px', fontSize: '1.2rem', color: 'white' }}>Quick Workflows</h3>
                                        <div id="quick-workflows-area" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                            <WorkflowTemplateCard icon={<Zap size={20} />} title="Creative Brief" onClick={() => setCurrentView('forge')} />
                                            <WorkflowTemplateCard icon={<Bell size={20} />} title="IT Incident" onClick={() => setCurrentView('forge')} />
                                            <WorkflowTemplateCard icon={<Plus size={20} />} title="HR Onboarding" onClick={() => setCurrentView('forge')} />
                                            <WorkflowTemplateCard icon={<Compass size={20} />} title="Lead Intake" onClick={() => setCurrentView('forge')} />
                                        </div>
                                    </div>

                                    <div className="glass-dark" style={{ marginTop: '32px', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                        <h3 style={{ marginBottom: '24px', color: 'white' }}>AI Insights</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                                            Based on your <span className="serif" style={{ color: 'var(--omnicom-blue)' }}>current workspace</span>, {
                                                currentPersona === 'Executive' ? "global performance is tracking 12% above quarterly targets." :
                                                    currentPersona === 'Task Owner' ? "you have 3 high-priority tasks due today in the Pepsi Co project." :
                                                        currentPersona === 'Approver' ? "there are 5 creative assets awaiting your approval for the Apple campaign." :
                                                            "the Apple Q1 Campaign is ahead of schedule."
                                            }
                                            Would you like me to {currentPersona === 'Executive' ? "prepare the leadership summary?" : "generate the market brief?"}
                                        </p>
                                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                                            <button className="btn-primary" onClick={() => setCurrentView('forge')}>
                                                {currentPersona === 'Executive' ? "Draft Summary" : "Generate Workflow"}
                                            </button>
                                            <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 24px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setCurrentView('registry')}>
                                                View Registry <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {currentView === 'forge' && <WorkflowForge onSaveBrief={handleSaveBrief} onBack={() => setCurrentView('dashboard')} />}

                            {currentView === 'registry' && <WorkflowRegistry briefs={briefs} onViewBrief={(b) => console.log('Viewing workflow:', b)} />}

                            {currentView === 'teams' && <TeamsPermissions users={users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onRemoveUser={handleRemoveUser} />}

                            {currentView === 'projects' && <Projects userName={user?.name || 'User'} />}

                            {currentView === 'planning' && <Planning />}

                            {currentView === 'tasks' && (
                                <Tasks
                                    userName={user?.name || 'User'}
                                    onNotification={(n) => {
                                        setNotifications([{
                                            id: Date.now().toString(),
                                            title: n.title,
                                            message: n.message,
                                            time: 'Just now',
                                            type: n.type,
                                            read: false
                                        }, ...notifications]);
                                        setToast(`${n.title}: ${n.message}`);
                                    }}
                                />
                            )}

                            {currentView === 'sow' && <SOWGenerator />}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Notification Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        style={{
                            position: 'fixed',
                            bottom: '40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'white',
                            color: 'black',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            fontWeight: 600
                        }}
                    >
                        <Check size={18} color="#10b981" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <OnboardingTutorial
                steps={tutorialSteps}
                isVisible={showTutorial}
                onComplete={handleTutorialComplete}
            />
            <AINavigationOrb onOpenVoiceFlow={() => setIsVoiceFlowOpen(true)} />

            {/* Voice Flow Agent Modal */}
            <VoiceFlowAgent
                isOpen={isVoiceFlowOpen}
                onClose={() => setIsVoiceFlowOpen(false)}
                onNavigate={(destination) => {
                    setCurrentView(destination as View);
                }}
                onCreateBrief={(data) => {
                    // Create new brief record
                    const newBrief: WorkflowRecord = {
                        id: Date.now().toString(),
                        campaignName: data.title,
                        client: data.client || 'Unknown Client',
                        date: new Date().toISOString().split('T')[0],
                        status: 'Draft',
                        content: data.description || `Generated brief for ${data.title}`,
                        type: 'Creative'
                    };

                    // Add to state so it appears in Registry
                    setBriefs([newBrief, ...briefs]);

                    // Add notification and navigate to forge
                    setNotifications([{
                        id: Date.now().toString(),
                        title: 'Brief Created',
                        message: `Created brief: ${data.title}`,
                        time: 'Just now',
                        type: 'success',
                        read: false,
                        actionUrl: 'registry'
                    }, ...notifications]);
                    setToast(`Brief "${data.title}" created via Voice Flow`);
                    setTimeout(() => setToast(null), 3000);
                    setCurrentView('registry');
                    setTimeout(() => setToast(null), 3000);
                    setCurrentView('registry');
                }}
                onCreateProject={(data) => {
                    const newProject = addProject({
                        name: data.name,
                        client: data.client || 'Internal',
                        description: data.description || 'Created via Voice Flow',
                        status: 'Active',
                        priority: (data.priority as any) || 'Medium',
                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
                        team: [{ name: user?.name || 'User', role: 'Project Lead', avatar: (user?.name || 'U').charAt(0) }]
                    });

                    setNotifications([{
                        id: Date.now().toString(),
                        title: 'Project Created',
                        message: `Created project: ${newProject.name}`,
                        time: 'Just now',
                        type: 'success',
                        read: false,
                        actionUrl: 'projects'
                    }, ...notifications]);
                    setToast(`Project "${newProject.name}" created`);
                    setTimeout(() => setToast(null), 3000);
                    setCurrentView('projects');
                }}
                onCreateTask={(data) => {
                    // Actually create the task in the store
                    const newTask = addTask({
                        title: data.title,
                        description: `Created via Voice Flow`,
                        project: data.project || 'General',
                        assignee: data.assignee || user?.name || 'Unassigned',
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
                        priority: (data.priority as 'Low' | 'Medium' | 'High' | 'Critical') || 'Medium',
                        status: 'To Do',
                        tags: ['voice-flow'],
                        createdBy: 'voice-flow',
                    });

                    setNotifications([{
                        id: Date.now().toString(),
                        title: 'Task Created',
                        message: `Created task: ${newTask.title}${data.assignee ? ` (assigned to ${data.assignee})` : ''}`,
                        time: 'Just now',
                        type: 'success',
                        read: false,
                        actionUrl: 'tasks'
                    }, ...notifications]);
                    setToast(`Task "${newTask.title}" created via Voice Flow`);
                    setTimeout(() => setToast(null), 3000);
                    setCurrentView('tasks');
                }}
                onGenerateSOW={(data) => {
                    setNotifications([{
                        id: Date.now().toString(),
                        title: 'SOW Generation Started',
                        message: `Generating SOW for ${data.projectName}`,
                        time: 'Just now',
                        type: 'info',
                        read: false,
                        actionUrl: 'sow'
                    }, ...notifications]);
                    setToast(`SOW generation started for "${data.projectName}"`);
                    setTimeout(() => setToast(null), 3000);
                    setCurrentView('sow');
                }}
                onUpdateStatus={(data) => {
                    // Find project by fuzzy name matching
                    const targetProject = projects.find(p =>
                        p.name.toLowerCase().includes(data.projectName.toLowerCase()) ||
                        data.projectName.toLowerCase().includes(p.name.toLowerCase())
                    );

                    if (targetProject) {
                        updateProject(targetProject.id, { status: data.newStatus as any });

                        setNotifications([{
                            id: Date.now().toString(),
                            title: 'Status Updated',
                            message: `Updated ${targetProject.name} to ${data.newStatus}`,
                            time: 'Just now',
                            type: 'info',
                            read: false,
                        }, ...notifications]);
                        setToast(`Project "${targetProject.name}" marked as ${data.newStatus}`);
                        setTimeout(() => setToast(null), 3000);
                    } else {
                        // If no project found, show error toast
                        setToast(`Could not find project matching "${data.projectName}"`);
                        setTimeout(() => setToast(null), 3000);
                    }
                }}
            />
        </div>

    );
};

const NavItem: React.FC<{ id?: string, icon: React.ReactNode, label: string, active?: boolean, isOpen: boolean, onClick?: () => void }> = ({ id, icon, label, active, isOpen, onClick }) => (
    <li
        id={id}
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            backgroundColor: active ? 'rgba(79, 127, 242, 0.1)' : 'transparent',
            color: active ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s ease',
            position: 'relative'
        }}
    >
        {active && (
            <motion.div
                layoutId="active-pill"
                style={{
                    position: 'absolute',
                    left: 0,
                    width: '3px',
                    height: '20px',
                    backgroundColor: 'var(--omnicom-blue)',
                    borderRadius: '0 4px 4px 0'
                }}
            />
        )}
        {icon}
        {isOpen && <span style={{ fontWeight: active ? 600 : 400, fontSize: '0.9rem' }}>{label}</span>}
    </li>
);

const DashboardCard: React.FC<{ title: string, value: string, change?: string, color?: string }> = ({ title, value, change, color }) => (
    <div className="glass-dark" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
        <h3 style={{ fontSize: '2.2rem', margin: 0, color: color || 'white', letterSpacing: '-1px' }}>{value}</h3>
        {change && <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowRight size={12} style={{ transform: 'rotate(-45deg)' }} /> {change}
        </p>}
    </div>
);

const WorkflowTemplateCard: React.FC<{ icon: React.ReactNode, title: string, onClick: () => void }> = ({ icon, title, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{
            padding: '32px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'border-color 0.2s',
            color: 'white'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--omnicom-blue)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    >
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79, 127, 242, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--omnicom-blue)' }}>
            {icon}
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
    </motion.button>
);

const AINavigationOrb: React.FC<{ onOpenVoiceFlow: () => void }> = ({ onOpenVoiceFlow }) => (
    <motion.div
        id="ai-assistant-orb"
        drag
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenVoiceFlow}
        style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--omnicom-coral) 0%, #ff6b5b 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(234, 88, 77, 0.4)',
            cursor: 'grab',
            zIndex: 100
        }}
        title="Voice Flow - Control with your voice"
    >
        <Mic size={24} />
    </motion.div>
);

export default App;
