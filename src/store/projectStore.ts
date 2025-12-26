import { create } from 'zustand';

export interface Project {
    id: string;
    name: string;
    client: string;
    description: string;
    status: 'Active' | 'On Hold' | 'Completed' | 'At Risk';
    progress: number;
    dueDate: string;
    startDate: string;
    team: { name: string; role: string; avatar: string }[];
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    tasks: { id: string; title: string; completed: boolean; assignee: string }[];
    recentActivity: { action: string; user: string; time: string }[];
    starred: boolean;
}

interface ProjectState {
    projects: Project[];
    addProject: (project: Omit<Project, 'id' | 'startDate' | 'progress' | 'recentActivity' | 'starred' | 'tasks'>) => Project;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    toggleStar: (id: string) => void;
    addTaskToProject: (projectId: string, task: { id: string; title: string; assignee: string }) => void;
    updateProjectTask: (projectId: string, taskId: string, completed: boolean) => void;
}

const initialProjects: Project[] = [
    {
        id: '1',
        name: 'Q1 Brand Refresh Campaign',
        client: 'PepsiCo',
        description: 'Complete brand refresh for PepsiCo\'s Q1 campaign targeting Gen Z consumers. Includes new visual identity, social media strategy, and influencer partnerships.',
        status: 'Active',
        progress: 65,
        dueDate: '2025-01-15',
        startDate: '2024-11-01',
        team: [
            { name: 'Alex Morgan', role: 'Project Lead', avatar: 'A' },
            { name: 'Sarah Chen', role: 'Creative Director', avatar: 'S' },
            { name: 'James Wilson', role: 'Strategy', avatar: 'J' }
        ],
        priority: 'High',
        tasks: [
            { id: 't1', title: 'Finalize brand guidelines', completed: true, assignee: 'Sarah C.' },
            { id: 't2', title: 'Create social media templates', completed: true, assignee: 'Alex M.' },
            { id: 't3', title: 'Influencer outreach', completed: false, assignee: 'James W.' },
            { id: 't4', title: 'Launch campaign landing page', completed: false, assignee: 'Sarah C.' },
            { id: 't5', title: 'Performance tracking setup', completed: false, assignee: 'Alex M.' }
        ],
        recentActivity: [
            { action: 'Updated brand guidelines document', user: 'Sarah Chen', time: '2 hours ago' },
            { action: 'Completed social media templates', user: 'Alex Morgan', time: '5 hours ago' },
            { action: 'Added 3 new tasks', user: 'James Wilson', time: '1 day ago' }
        ],
        starred: true
    },
    {
        id: '2',
        name: 'Vision Pro Launch Strategy',
        client: 'Apple Inc.',
        description: 'Strategic launch plan for Apple Vision Pro in enterprise markets. Focus on B2B adoption, developer relations, and corporate partnership opportunities.',
        status: 'Active',
        progress: 42,
        dueDate: '2025-02-28',
        startDate: '2024-12-01',
        team: [
            { name: 'Sarah Chen', role: 'Project Lead', avatar: 'S' },
            { name: 'Mike Rodriguez', role: 'Technical Lead', avatar: 'M' }
        ],
        priority: 'Critical',
        tasks: [
            { id: 't6', title: 'Market analysis report', completed: true, assignee: 'Sarah C.' },
            { id: 't7', title: 'Developer partnership deck', completed: true, assignee: 'Mike R.' },
            { id: 't8', title: 'Enterprise demo setup', completed: false, assignee: 'Mike R.' },
            { id: 't9', title: 'Launch event planning', completed: false, assignee: 'Sarah C.' }
        ],
        recentActivity: [
            { action: 'Completed market analysis', user: 'Sarah Chen', time: '3 hours ago' },
            { action: 'Updated project timeline', user: 'Mike Rodriguez', time: '1 day ago' }
        ],
        starred: true
    },
    {
        id: '3',
        name: 'Annual Compliance Audit',
        client: 'Internal',
        description: 'Annual compliance audit for regulatory requirements including GDPR, SOC 2, and industry-specific regulations.',
        status: 'On Hold',
        progress: 20,
        dueDate: '2025-03-01',
        startDate: '2024-10-15',
        team: [
            { name: 'James Wilson', role: 'Compliance Lead', avatar: 'J' }
        ],
        priority: 'Medium',
        tasks: [
            { id: 't10', title: 'Document collection', completed: true, assignee: 'James W.' },
            { id: 't11', title: 'Initial audit review', completed: false, assignee: 'James W.' },
            { id: 't12', title: 'Stakeholder interviews', completed: false, assignee: 'James W.' }
        ],
        recentActivity: [
            { action: 'Project put on hold', user: 'James Wilson', time: '2 days ago' },
            { action: 'Completed document collection', user: 'James Wilson', time: '1 week ago' }
        ],
        starred: false
    },
    {
        id: '4',
        name: 'Employee Onboarding System',
        client: 'HR Department',
        description: 'New employee onboarding workflow automation including documentation, training schedules, and equipment provisioning.',
        status: 'Completed',
        progress: 100,
        dueDate: '2024-12-10',
        startDate: '2024-09-01',
        team: [
            { name: 'Alex Morgan', role: 'Project Lead', avatar: 'A' },
            { name: 'Lisa Thompson', role: 'HR Specialist', avatar: 'L' }
        ],
        priority: 'Low',
        tasks: [
            { id: 't13', title: 'Define onboarding workflow', completed: true, assignee: 'Lisa T.' },
            { id: 't14', title: 'Create training materials', completed: true, assignee: 'Alex M.' },
            { id: 't15', title: 'System integration', completed: true, assignee: 'Alex M.' },
            { id: 't16', title: 'User testing', completed: true, assignee: 'Lisa T.' }
        ],
        recentActivity: [
            { action: 'Project marked as complete', user: 'Alex Morgan', time: '1 week ago' },
            { action: 'Final testing completed', user: 'Lisa Thompson', time: '1 week ago' }
        ],
        starred: false
    },
    {
        id: '5',
        name: 'Global Sales Pipeline',
        client: 'Sales Team',
        description: 'Overhaul of the global sales pipeline with new CRM integration, reporting dashboards, and automated lead scoring.',
        status: 'At Risk',
        progress: 35,
        dueDate: '2025-01-05',
        startDate: '2024-10-01',
        team: [
            { name: 'Mike Rodriguez', role: 'Technical Lead', avatar: 'M' },
            { name: 'Sarah Chen', role: 'Project Manager', avatar: 'S' },
            { name: 'James Wilson', role: 'Sales Ops', avatar: 'J' }
        ],
        priority: 'High',
        tasks: [
            { id: 't17', title: 'CRM migration plan', completed: true, assignee: 'Mike R.' },
            { id: 't18', title: 'Data cleanup', completed: true, assignee: 'James W.' },
            { id: 't19', title: 'Dashboard prototypes', completed: false, assignee: 'Sarah C.' },
            { id: 't20', title: 'Lead scoring algorithm', completed: false, assignee: 'Mike R.' },
            { id: 't21', title: 'User training', completed: false, assignee: 'James W.' }
        ],
        recentActivity: [
            { action: 'Flagged as at risk due to timeline', user: 'Sarah Chen', time: '1 day ago' },
            { action: 'Completed data cleanup', user: 'James Wilson', time: '2 days ago' }
        ],
        starred: false
    }
];

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: initialProjects,

    addProject: (projectData) => {
        const newProject: Project = {
            ...projectData,
            id: Date.now().toString(),
            startDate: new Date().toISOString().split('T')[0],
            progress: 0,
            starred: false,
            tasks: [],
            recentActivity: [{ action: 'Project created', user: 'Unknown', time: 'Just now' }] // User name to be handled by controller
        };
        set((state) => ({ projects: [newProject, ...state.projects] }));
        return newProject;
    },

    updateProject: (id, updates) => {
        set((state) => ({
            projects: state.projects.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            ),
        }));
    },

    deleteProject: (id) => {
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
        }));
    },

    toggleStar: (id) => {
        set((state) => ({
            projects: state.projects.map((p) =>
                p.id === id ? { ...p, starred: !p.starred } : p
            ),
        }));
    },

    addTaskToProject: (projectId, task) => {
        set((state) => ({
            projects: state.projects.map((p) =>
                p.id === projectId
                    ? { ...p, tasks: [...p.tasks, { ...task, completed: false }] }
                    : p
            ),
        }));
    },

    updateProjectTask: (projectId, taskId, completed) => {
        set((state) => ({
            projects: state.projects.map((p) => {
                if (p.id === projectId) {
                    const updatedTasks = p.tasks.map(t =>
                        t.id === taskId ? { ...t, completed } : t
                    );
                    // Recalculate progress
                    const completedCount = updatedTasks.filter(t => t.completed).length;
                    const progress = Math.round((completedCount / updatedTasks.length) * 100) || 0;
                    return { ...p, tasks: updatedTasks, progress };
                }
                return p;
            }),
        }));
    }
}));
