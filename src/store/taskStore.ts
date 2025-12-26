// Task Store - Shared state for tasks across the application
import { create } from 'zustand';

export interface Task {
    id: string;
    title: string;
    description: string;
    project: string;
    assignee: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'To Do' | 'In Progress' | 'Review' | 'Done';
    tags: string[];
    createdAt: string;
    createdBy?: 'user' | 'voice-flow'; // Track how task was created
}

interface TaskState {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    assignTask: (id: string, assignee: string) => void;
    updateStatus: (id: string, status: Task['status']) => void;
    getTasksByProject: (project: string) => Task[];
    getTasksByAssignee: (assignee: string) => Task[];
}

// Initial sample tasks
const initialTasks: Task[] = [
    {
        id: 't1',
        title: 'Review Creative Assets',
        description: 'Review the latest creative assets for the Pepsi Summer campaign',
        project: 'Pepsi Summer 2025',
        assignee: 'Alex Morgan',
        dueDate: '2025-12-28',
        priority: 'High',
        status: 'In Progress',
        tags: ['creative', 'review'],
        createdAt: '2025-12-20',
    },
    {
        id: 't2',
        title: 'Finalize Media Plan',
        description: 'Complete the media allocation plan for Q1',
        project: 'Nike Q1 Campaign',
        assignee: 'Sarah Chen',
        dueDate: '2025-12-30',
        priority: 'Critical',
        status: 'To Do',
        tags: ['media', 'planning'],
        createdAt: '2025-12-21',
    },
    {
        id: 't3',
        title: 'Update Brand Guidelines',
        description: 'Update the digital brand guidelines with new colors',
        project: 'General',
        assignee: 'Alex Morgan',
        dueDate: '2025-12-31',
        priority: 'Medium',
        status: 'To Do',
        tags: ['brand', 'documentation'],
        createdAt: '2025-12-22',
    },
];

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: initialTasks,

    addTask: (taskData) => {
        const newTask: Task = {
            ...taskData,
            id: `t${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return newTask;
    },

    updateTask: (id, updates) => {
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, ...updates } : t
            ),
        }));
    },

    deleteTask: (id) => {
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
        }));
    },

    assignTask: (id, assignee) => {
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, assignee } : t
            ),
        }));
    },

    updateStatus: (id, status) => {
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, status } : t
            ),
        }));
    },

    getTasksByProject: (project) => {
        return get().tasks.filter((t) =>
            t.project.toLowerCase().includes(project.toLowerCase())
        );
    },

    getTasksByAssignee: (assignee) => {
        return get().tasks.filter((t) =>
            t.assignee.toLowerCase().includes(assignee.toLowerCase())
        );
    },
}));

export default useTaskStore;
