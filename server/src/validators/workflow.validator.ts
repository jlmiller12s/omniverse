// Workflow Validators
import { z } from 'zod';

export const createWorkflowSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['CREATIVE', 'IT', 'HR', 'COMPLIANCE', 'ORCHESTRATION', 'SALES', 'AUTOMATION', 'PROJECT']),
    client: z.string().optional(),
    content: z.string().default(''),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    metadata: z.record(z.unknown()).optional(),
});

export const updateWorkflowSchema = z.object({
    title: z.string().min(1).optional(),
    status: z.enum(['DRAFT', 'PENDING', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'COMPLETED', 'ARCHIVED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    content: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});
