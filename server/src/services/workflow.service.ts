// Workflow Service - Business Logic Layer
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface FindAllOptions {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    filters: Record<string, string>;
}

export const workflowService = {
    /**
     * Find all workflows with pagination and filtering
     */
    async findAll(tenantId: string, options: FindAllOptions) {
        const { page, limit, sortBy, sortOrder, filters } = options;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.WorkflowWhereInput = {
            tenantId,
            archivedAt: null, // Exclude archived
        };

        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.type) {
            where.type = filters.type;
        }
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search } },
                { client: { contains: filters.search } },
            ];
        }

        // Execute queries in parallel
        const [items, totalItems] = await Promise.all([
            prisma.workflow.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    createdBy: {
                        select: { id: true, name: true, email: true, avatar: true },
                    },
                },
            }),
            prisma.workflow.count({ where }),
        ]);

        return {
            items,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                hasNextPage: page < Math.ceil(totalItems / limit),
                hasPrevPage: page > 1,
            },
        };
    },

    /**
     * Find a single workflow by ID
     */
    async findById(id: string, tenantId: string) {
        return prisma.workflow.findFirst({
            where: { id, tenantId },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
            },
        });
    },

    /**
     * Create a new workflow
     */
    async create(data: {
        title: string;
        type: string;
        client?: string;
        content: string;
        tenantId: string;
        createdById: string;
        metadata?: string;
    }) {
        return prisma.workflow.create({
            data: {
                title: data.title,
                type: data.type,
                client: data.client,
                content: data.content,
                metadata: data.metadata || '{}',
                tenant: { connect: { id: data.tenantId } },
                createdBy: { connect: { id: data.createdById } },
            },
        });
    },

    /**
     * Update a workflow
     */
    async update(id: string, tenantId: string, data: Partial<{
        title: string;
        status: string;
        priority: string;
        content: string;
        metadata: string;
    }>) {
        await prisma.workflow.updateMany({
            where: { id, tenantId },
            data,
        });
        return this.findById(id, tenantId);
    },

    /**
     * Soft delete a workflow
     */
    async softDelete(id: string, tenantId: string) {
        return prisma.workflow.updateMany({
            where: { id, tenantId },
            data: { archivedAt: new Date() },
        });
    },

    /**
     * Duplicate a workflow
     */
    async duplicate(id: string, tenantId: string, userId: string) {
        const original = await this.findById(id, tenantId);
        if (!original) throw new Error('Workflow not found');

        return prisma.workflow.create({
            data: {
                title: `${original.title} (Copy)`,
                type: original.type,
                client: original.client,
                content: original.content,
                metadata: original.metadata,
                status: 'DRAFT',
                tenant: { connect: { id: tenantId } },
                createdBy: { connect: { id: userId } },
            },
        });
    },

    /**
     * Archive a workflow
     */
    async archive(id: string, tenantId: string) {
        await prisma.workflow.updateMany({
            where: { id, tenantId },
            data: { status: 'ARCHIVED', archivedAt: new Date() },
        });
        return this.findById(id, tenantId);
    },

    /**
     * Export workflow to PDF (placeholder)
     */
    async exportToPdf(id: string, tenantId: string): Promise<Buffer> {
        const workflow = await this.findById(id, tenantId);
        if (!workflow) throw new Error('Workflow not found');

        // TODO: Implement PDF generation with puppeteer or similar
        return Buffer.from(`Workflow: ${workflow.title}\n\n${workflow.content}`);
    },
};

export default workflowService;
