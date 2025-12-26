// Workflow Type Definitions for Enterprise Scalability

export type WorkflowType =
    | 'Creative'
    | 'IT'
    | 'HR'
    | 'Compliance'
    | 'Orchestration'
    | 'Sales'
    | 'Automation'
    | 'Project';

export type WorkflowStatus =
    | 'Draft'
    | 'Pending'
    | 'In Progress'
    | 'Under Review'
    | 'Approved'
    | 'Completed'
    | 'Archived';

export type WorkflowPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface WorkflowTemplate {
    type: WorkflowType;
    title: string;
    description: string;
    icon: string;
    fields: WorkflowField[];
}

export interface WorkflowField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'select' | 'number';
    required: boolean;
    options?: string[];
}

export interface Workflow {
    id: string;
    tenantId: string;
    type: WorkflowType;
    title: string;
    client: string;
    status: WorkflowStatus;
    priority: WorkflowPriority;
    content: string;
    metadata: Record<string, unknown>;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkflowFormData {
    title: string;
    client: string;
    detail1: string;
    detail2: string;
    deadline: string;
    priority: string;
}

export interface WorkflowFilters {
    status?: WorkflowStatus;
    type?: WorkflowType;
    priority?: WorkflowPriority;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface WorkflowListOptions {
    page: number;
    limit: number;
    sortBy: keyof Workflow;
    sortOrder: 'asc' | 'desc';
    filters?: WorkflowFilters;
}
