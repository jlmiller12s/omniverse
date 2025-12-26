// Database Seed Script
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create a demo tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Omnicom Demo',
            domain: 'demo.omniverse',
            plan: 'ENTERPRISE',
        },
    });
    console.log('✅ Created tenant:', tenant.name);

    // Create demo users
    const passwordHash = await bcrypt.hash('password123', 12);

    const admin = await prisma.user.create({
        data: {
            email: 'admin@omniverse.demo',
            passwordHash,
            name: 'Alex Morgan',
            role: 'ADMIN',
            status: 'ACTIVE',
            department: 'Executive',
            title: 'Platform Administrator',
            permissions: '["*"]',
            tenantId: tenant.id,
        },
    });
    console.log('✅ Created admin user:', admin.email);

    const manager = await prisma.user.create({
        data: {
            email: 'manager@omniverse.demo',
            passwordHash,
            name: 'Sarah Chen',
            role: 'MANAGER',
            status: 'ACTIVE',
            department: 'Operations',
            title: 'Campaign Manager',
            permissions: '["workflows:create", "workflows:read", "workflows:update"]',
            tenantId: tenant.id,
        },
    });
    console.log('✅ Created manager user:', manager.email);

    // Create some demo workflows
    const workflows = [
        {
            title: 'Q1 Brand Campaign Brief',
            type: 'CREATIVE',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            client: 'Acme Corp',
            content: 'Creative brief for Q1 brand awareness campaign targeting millennials.',
            tenantId: tenant.id,
            createdById: manager.id,
        },
        {
            title: 'Annual Compliance Audit',
            type: 'COMPLIANCE',
            status: 'PENDING',
            priority: 'CRITICAL',
            client: 'Internal',
            content: 'Annual compliance review for regulatory requirements.',
            tenantId: tenant.id,
            createdById: admin.id,
        },
        {
            title: 'New Employee Onboarding',
            type: 'HR',
            status: 'COMPLETED',
            priority: 'MEDIUM',
            client: 'Human Resources',
            content: 'Standard onboarding workflow for new hires.',
            tenantId: tenant.id,
            createdById: admin.id,
        },
    ];

    for (const workflow of workflows) {
        await prisma.workflow.create({ data: workflow });
    }
    console.log(`✅ Created ${workflows.length} demo workflows`);

    // Create a team
    const team = await prisma.team.create({
        data: {
            name: 'Marketing Team',
            description: 'Core marketing and creative team',
            tenantId: tenant.id,
        },
    });

    await prisma.teamMember.createMany({
        data: [
            { teamId: team.id, userId: admin.id, role: 'lead' },
            { teamId: team.id, userId: manager.id, role: 'member' },
        ],
    });
    console.log('✅ Created team:', team.name);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📧 Demo Login Credentials:');
    console.log('   Admin: admin@omniverse.demo / password123');
    console.log('   Manager: manager@omniverse.demo / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
