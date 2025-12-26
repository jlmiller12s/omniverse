// React Query Hooks for Workflows
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService } from '../services';
import { useWorkflowStore } from '../store';
import type { Workflow, WorkflowFormData, WorkflowListOptions } from '../types';

// Query Keys
export const workflowKeys = {
    all: ['workflows'] as const,
    lists: () => [...workflowKeys.all, 'list'] as const,
    list: (options: Partial<WorkflowListOptions>) => [...workflowKeys.lists(), options] as const,
    details: () => [...workflowKeys.all, 'detail'] as const,
    detail: (id: string) => [...workflowKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated workflows
 */
export function useWorkflows(options?: Partial<WorkflowListOptions>) {
    const setWorkflows = useWorkflowStore((state) => state.setWorkflows);

    const query = useQuery({
        queryKey: workflowKeys.list(options || {}),
        queryFn: () => workflowService.getAll(options),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    useEffect(() => {
        if (query.data) {
            setWorkflows(query.data.items);
        }
    }, [query.data, setWorkflows]);

    return query;
}

/**
 * Hook to fetch a single workflow
 */
export function useWorkflow(id: string) {
    const selectWorkflow = useWorkflowStore((state) => state.selectWorkflow);

    const query = useQuery({
        queryKey: workflowKeys.detail(id),
        queryFn: () => workflowService.getById(id),
        enabled: !!id,
    });

    useEffect(() => {
        if (query.data) {
            selectWorkflow(query.data);
        }
    }, [query.data, selectWorkflow]);

    return query;
}

/**
 * Hook to create a new workflow
 */
export function useCreateWorkflow() {
    const queryClient = useQueryClient();
    const addWorkflow = useWorkflowStore((state) => state.addWorkflow);

    return useMutation({
        mutationFn: (data: WorkflowFormData & { type: string }) =>
            workflowService.create(data),
        onSuccess: (newWorkflow) => {
            addWorkflow(newWorkflow);
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
        },
    });
}

/**
 * Hook to update a workflow
 */
export function useUpdateWorkflow() {
    const queryClient = useQueryClient();
    const updateWorkflow = useWorkflowStore((state) => state.updateWorkflow);

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Workflow> }) =>
            workflowService.update(id, data),
        onSuccess: (updatedWorkflow) => {
            updateWorkflow(updatedWorkflow.id, updatedWorkflow);
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(updatedWorkflow.id) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
        },
    });
}

/**
 * Hook to delete a workflow
 */
export function useDeleteWorkflow() {
    const queryClient = useQueryClient();
    const deleteWorkflow = useWorkflowStore((state) => state.deleteWorkflow);

    return useMutation({
        mutationFn: (id: string) => workflowService.delete(id),
        onSuccess: (_, deletedId) => {
            deleteWorkflow(deletedId);
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
        },
    });
}

/**
 * Hook to duplicate a workflow
 */
export function useDuplicateWorkflow() {
    const queryClient = useQueryClient();
    const addWorkflow = useWorkflowStore((state) => state.addWorkflow);

    return useMutation({
        mutationFn: (id: string) => workflowService.duplicate(id),
        onSuccess: (duplicatedWorkflow) => {
            addWorkflow(duplicatedWorkflow);
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
        },
    });
}

/**
 * Hook to archive a workflow
 */
export function useArchiveWorkflow() {
    const queryClient = useQueryClient();
    const updateWorkflow = useWorkflowStore((state) => state.updateWorkflow);

    return useMutation({
        mutationFn: (id: string) => workflowService.archive(id),
        onSuccess: (archivedWorkflow) => {
            updateWorkflow(archivedWorkflow.id, archivedWorkflow);
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
        },
    });
}
