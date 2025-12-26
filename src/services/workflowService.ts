// Workflow API Service
import apiClient from './apiClient';
import type {
    Workflow,
    WorkflowFormData,
    WorkflowListOptions,
    ApiResponse,
    PaginatedResult,
} from '../types';

const WORKFLOWS_ENDPOINT = '/workflows';

export const workflowService = {
    /**
     * Get paginated list of workflows
     */
    async getAll(options?: Partial<WorkflowListOptions>): Promise<PaginatedResult<Workflow>> {
        const params = new URLSearchParams();

        if (options?.page) params.append('page', String(options.page));
        if (options?.limit) params.append('limit', String(options.limit));
        if (options?.sortBy) params.append('sortBy', options.sortBy);
        if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
        if (options?.filters?.status) params.append('status', options.filters.status);
        if (options?.filters?.type) params.append('type', options.filters.type);
        if (options?.filters?.search) params.append('search', options.filters.search);

        const response = await apiClient.get<ApiResponse<PaginatedResult<Workflow>>>(
            `${WORKFLOWS_ENDPOINT}?${params.toString()}`
        );
        return response.data.data;
    },

    /**
     * Get a single workflow by ID
     */
    async getById(id: string): Promise<Workflow> {
        const response = await apiClient.get<ApiResponse<Workflow>>(
            `${WORKFLOWS_ENDPOINT}/${id}`
        );
        return response.data.data;
    },

    /**
     * Create a new workflow
     */
    async create(data: WorkflowFormData & { type: string }): Promise<Workflow> {
        const response = await apiClient.post<ApiResponse<Workflow>>(
            WORKFLOWS_ENDPOINT,
            data
        );
        return response.data.data;
    },

    /**
     * Update an existing workflow
     */
    async update(id: string, data: Partial<Workflow>): Promise<Workflow> {
        const response = await apiClient.patch<ApiResponse<Workflow>>(
            `${WORKFLOWS_ENDPOINT}/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete a workflow (soft delete)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`${WORKFLOWS_ENDPOINT}/${id}`);
    },

    /**
     * Duplicate a workflow
     */
    async duplicate(id: string): Promise<Workflow> {
        const response = await apiClient.post<ApiResponse<Workflow>>(
            `${WORKFLOWS_ENDPOINT}/${id}/duplicate`
        );
        return response.data.data;
    },

    /**
     * Archive a workflow
     */
    async archive(id: string): Promise<Workflow> {
        const response = await apiClient.patch<ApiResponse<Workflow>>(
            `${WORKFLOWS_ENDPOINT}/${id}/archive`
        );
        return response.data.data;
    },

    /**
     * Export workflow to PDF
     */
    async exportToPdf(id: string): Promise<Blob> {
        const response = await apiClient.get(`${WORKFLOWS_ENDPOINT}/${id}/export/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },

    /**
     * Share workflow with users
     */
    async share(id: string, userIds: string[]): Promise<void> {
        await apiClient.post(`${WORKFLOWS_ENDPOINT}/${id}/share`, { userIds });
    },
};

export default workflowService;
