// Workflow Routes
import { Router } from 'express';
import { workflowController } from '../controllers/workflow.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createWorkflowSchema, updateWorkflowSchema } from '../validators/workflow.validator';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/workflows - List all workflows (paginated)
router.get('/', workflowController.getAll);

// GET /api/workflows/:id - Get single workflow
router.get('/:id', workflowController.getById);

// POST /api/workflows - Create new workflow
router.post('/', validateRequest(createWorkflowSchema), workflowController.create);

// PATCH /api/workflows/:id - Update workflow
router.patch('/:id', validateRequest(updateWorkflowSchema), workflowController.update);

// DELETE /api/workflows/:id - Delete workflow (soft delete)
router.delete('/:id', workflowController.delete);

// POST /api/workflows/:id/duplicate - Duplicate workflow
router.post('/:id/duplicate', workflowController.duplicate);

// PATCH /api/workflows/:id/archive - Archive workflow
router.patch('/:id/archive', workflowController.archive);

// GET /api/workflows/:id/export/pdf - Export to PDF
router.get('/:id/export/pdf', workflowController.exportPdf);

export default router;
