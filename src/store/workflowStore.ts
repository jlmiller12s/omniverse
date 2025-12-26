// Workflow State Store with Zustand
import { create } from 'zustand';
import type { Workflow, WorkflowFilters, WorkflowType } from '../types';

interface WorkflowState {
    workflows: Workflow[];
    selectedWorkflow: Workflow | null;
    filters: WorkflowFilters;
    isLoading: boolean;
    error: string | null;
}

interface WorkflowActions {
    setWorkflows: (workflows: Workflow[]) => void;
    addWorkflow: (workflow: Workflow) => void;
    updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
    deleteWorkflow: (id: string) => void;
    selectWorkflow: (workflow: Workflow | null) => void;
    setFilters: (filters: Partial<WorkflowFilters>) => void;
    clearFilters: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

type WorkflowStore = WorkflowState & WorkflowActions;

const initialFilters: WorkflowFilters = {};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
    workflows: [],
    selectedWorkflow: null,
    filters: initialFilters,
    isLoading: false,
    error: null,

    setWorkflows: (workflows) =>
        set({ workflows, isLoading: false, error: null }),

    addWorkflow: (workflow) =>
        set((state) => ({
            workflows: [workflow, ...state.workflows],
        })),

    updateWorkflow: (id, updates) =>
        set((state) => ({
            workflows: state.workflows.map((w) =>
                w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
            ),
            selectedWorkflow:
                state.selectedWorkflow?.id === id
                    ? { ...state.selectedWorkflow, ...updates }
                    : state.selectedWorkflow,
        })),

    deleteWorkflow: (id) =>
        set((state) => ({
            workflows: state.workflows.filter((w) => w.id !== id),
            selectedWorkflow: state.selectedWorkflow?.id === id ? null : state.selectedWorkflow,
        })),

    selectWorkflow: (workflow) =>
        set({ selectedWorkflow: workflow }),

    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        })),

    clearFilters: () =>
        set({ filters: initialFilters }),

    setLoading: (isLoading) =>
        set({ isLoading }),

    setError: (error) =>
        set({ error, isLoading: false }),
}));

// Selectors
export const selectWorkflows = (state: WorkflowStore) => state.workflows;
export const selectSelectedWorkflow = (state: WorkflowStore) => state.selectedWorkflow;
export const selectWorkflowsByType = (type: WorkflowType) => (state: WorkflowStore) =>
    state.workflows.filter((w) => w.type === type);
export const selectWorkflowsCount = (state: WorkflowStore) => state.workflows.length;
