// Workflow Controller
import { Request, Response, NextFunction } from 'express';
import { workflowService } from '../services/workflow.service';
import { ApiResponse } from '../utils/ApiResponse';

export const workflowController = {
    /**
     * Get all workflows with pagination and filtering
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
            const tenantId = req.tenantId!;

            const result = await workflowService.findAll(tenantId, {
                page: Number(page),
                limit: Number(limit),
                sortBy: String(sortBy),
                sortOrder: sortOrder as 'asc' | 'desc',
                filters,
            });

            res.json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get a single workflow by ID
     */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId!;

            const workflow = await workflowService.findById(id, tenantId);

            if (!workflow) {
                return res.status(404).json(ApiResponse.error('Workflow not found', 'NOT_FOUND'));
            }

            res.json(ApiResponse.success(workflow));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Create a new workflow
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const tenantId = req.tenantId!;
            const userId = req.userId!;

            const workflow = await workflowService.create({
                ...req.body,
                tenantId,
                createdById: userId,
            });

            res.status(201).json(ApiResponse.success(workflow, 'Workflow created successfully'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update a workflow
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId!;

            const workflow = await workflowService.update(id, tenantId, req.body);

            if (!workflow) {
                return res.status(404).json(ApiResponse.error('Workflow not found', 'NOT_FOUND'));
            }

            res.json(ApiResponse.success(workflow, 'Workflow updated successfully'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Delete a workflow (soft delete)
     */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId!;

            await workflowService.softDelete(id, tenantId);

            res.json(ApiResponse.success(null, 'Workflow deleted successfully'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Duplicate a workflow
     */
    async duplicate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId!;
            const userId = req.userId!;

            const workflow = await workflowService.duplicate(id, tenantId, userId);

            res.status(201).json(ApiResponse.success(workflow, 'Workflow duplicated successfully'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Archive a workflow
     */
    async archive(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId!;

            const workflow = await workflowService.archive(id, tenantId);

            res.json(ApiResponse.success(workflow, 'Workflow archived successfully'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Export workflow to PDF
     */
    async exportPdf(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tenantId = req.tenantId!;

            const pdfBuffer = await workflowService.exportToPdf(id, tenantId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=workflow-${id}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            next(error);
        }
    },
};
