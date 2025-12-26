// Voice Command Parser - Intent recognition and entity extraction
// Parses natural language voice commands into structured actions

export type VoiceIntent =
    | { type: 'CREATE_BRIEF'; data: { title: string; client: string; description: string } }
    | { type: 'CREATE_TASK'; data: { title: string; assignee?: string; priority?: string; project?: string } }
    | { type: 'ASSIGN_TASK'; data: { taskName: string; assignee: string } }
    | { type: 'GENERATE_SOW'; data: { projectName: string; client?: string } }
    | { type: 'CREATE_PROJECT'; data: { name: string; client?: string; description?: string; priority?: string; dueDate?: string } }
    | { type: 'UPDATE_STATUS'; data: { projectName: string; newStatus: string } }
    | { type: 'UPDATE_STAGE'; data: { projectName: string; newStage: string } }
    | { type: 'NAVIGATE'; data: { destination: string } }
    | { type: 'HELP'; data: null }
    | { type: 'UNKNOWN'; rawText: string };

// Status mappings for fuzzy matching
const STATUS_KEYWORDS: Record<string, string> = {
    'approved': 'Approved',
    'approve': 'Approved',
    'pending': 'Pending',
    'in progress': 'In Progress',
    'progress': 'In Progress',
    'working': 'In Progress',
    'started': 'In Progress',
    'draft': 'Draft',
    'review': 'In Review',
    'reviewing': 'In Review',
    'complete': 'Completed',
    'completed': 'Completed',
    'done': 'Completed',
    'finished': 'Completed',
    'on hold': 'On Hold',
    'hold': 'On Hold',
    'paused': 'On Hold',
    'cancelled': 'Cancelled',
    'cancel': 'Cancelled',
};

// Navigation destination mappings
const NAVIGATION_KEYWORDS: Record<string, string> = {
    'dashboard': 'dashboard',
    'home': 'dashboard',
    'main': 'dashboard',
    'projects': 'projects',
    'project': 'projects',
    'planning': 'planning',
    'plan': 'planning',
    'tasks': 'tasks',
    'task': 'tasks',
    'my tasks': 'tasks',
    'sow': 'sow',
    'statement of work': 'sow',
    'teams': 'teams',
    'team': 'teams',
    'permissions': 'teams',
    'forge': 'forge',
    'workflow forge': 'forge',
    'create workflow': 'forge',
    'registry': 'registry',
    'workflow registry': 'registry',
    'workflows': 'registry',
};

// Priority mappings
const PRIORITY_KEYWORDS: Record<string, string> = {
    'low': 'Low',
    'medium': 'Medium',
    'normal': 'Medium',
    'high': 'High',
    'urgent': 'Critical',
    'critical': 'Critical',
    'asap': 'Critical',
};

/**
 * Parse a voice transcript into a structured intent
 */
export function parseVoiceCommand(transcript: string): VoiceIntent {
    const text = transcript.toLowerCase().trim();

    // Check for help command
    if (text.includes('help') || text.includes('what can you do') || text.includes('commands')) {
        return { type: 'HELP', data: null };
    }

    // Check for navigation commands
    if (text.startsWith('go to') || text.startsWith('show me') || text.startsWith('open') || text.startsWith('navigate to')) {
        return parseNavigationCommand(text);
    }

    // Check for brief creation
    if (text.includes('brief') || text.includes('creative brief') || text.includes('market brief')) {
        return parseBriefCommand(text, transcript);
    }

    // Check for SOW generation
    if (text.includes('sow') || text.includes('statement of work') || text.includes('generate sow')) {
        return parseSOWCommand(text, transcript);
    }

    // Check for task creation
    if (text.includes('create task') || text.includes('new task') || text.includes('add task') || text.includes('make a task')) {
        return parseTaskCommand(text, transcript);
    }

    // Check for project creation
    if (text.includes('create project') || text.includes('new project') || text.includes('start project') || text.includes('make a project')) {
        return parseProjectCommand(text, transcript);
    }

    // Check for task assignment
    if (text.includes('assign') && (text.includes('task') || text.includes('to'))) {
        return parseAssignCommand(text, transcript);
    }

    // Check for status update
    if (text.includes('update') && (text.includes('status') || text.includes('to'))) {
        return parseStatusCommand(text, transcript);
    }

    // Check for stage update
    if (text.includes('move') && (text.includes('stage') || text.includes('phase') || text.includes('to'))) {
        return parseStageCommand(text, transcript);
    }

    // Navigation fallback - check for any destination keywords
    for (const [keyword, destination] of Object.entries(NAVIGATION_KEYWORDS)) {
        if (text.includes(keyword)) {
            return { type: 'NAVIGATE', data: { destination } };
        }
    }

    return { type: 'UNKNOWN', rawText: transcript };
}

function parseNavigationCommand(text: string): VoiceIntent {
    for (const [keyword, destination] of Object.entries(NAVIGATION_KEYWORDS)) {
        if (text.includes(keyword)) {
            return { type: 'NAVIGATE', data: { destination } };
        }
    }
    return { type: 'UNKNOWN', rawText: text };
}

function parseBriefCommand(text: string, originalText: string): VoiceIntent {
    // Try to extract client name
    let client = '';
    const clientPatterns = [
        /(?:for|client|company)\s+([A-Z][a-zA-Z\s]+?)(?:\s+with|\s+about|\s+on|,|$)/i,
        /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:brief|campaign|project)/i,
    ];

    for (const pattern of clientPatterns) {
        const match = originalText.match(pattern);
        if (match) {
            client = match[1].trim();
            break;
        }
    }

    // Extract title/description
    let title = originalText;
    const titlePatterns = [
        /(?:called|titled|named)\s+(.+?)(?:\s+for|\s+with|$)/i,
        /brief\s+(?:for\s+)?(.+?)(?:\s+with|\s+about|$)/i,
    ];

    for (const pattern of titlePatterns) {
        const match = originalText.match(pattern);
        if (match) {
            title = match[1].trim();
            break;
        }
    }

    return {
        type: 'CREATE_BRIEF',
        data: {
            title: title.substring(0, 60),
            client: client,
            description: originalText,
        },
    };
}

function parseSOWCommand(text: string, originalText: string): VoiceIntent {
    // Extract project name
    let projectName = '';
    const projectPatterns = [
        /sow\s+for\s+(.+?)(?:\s+project|\s+client|$)/i,
        /statement\s+of\s+work\s+for\s+(.+?)(?:\s+project|$)/i,
        /generate\s+sow\s+for\s+(.+)/i,
    ];

    for (const pattern of projectPatterns) {
        const match = originalText.match(pattern);
        if (match) {
            projectName = match[1].trim();
            break;
        }
    }

    return {
        type: 'GENERATE_SOW',
        data: {
            projectName: projectName || 'New Project',
        },
    };
}

function parseTaskCommand(text: string, originalText: string): VoiceIntent {
    let title = '';
    let assignee: string | undefined;
    let priority: string | undefined;

    // Extract task title
    const titlePatterns = [
        /(?:task|create task|new task)\s+(?:called|named|titled)?\s*(.+?)(?:\s+and\s+assign|\s+assign|\s+for|$)/i,
        /(?:create|add|make)\s+(?:a\s+)?task\s+(.+?)(?:\s+and|\s+assign|\s+for|$)/i,
    ];

    for (const pattern of titlePatterns) {
        const match = originalText.match(pattern);
        if (match) {
            title = match[1].trim();
            break;
        }
    }

    // Extract assignee
    const assigneeMatch = originalText.match(/assign\s+(?:to\s+)?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/i);
    if (assigneeMatch) {
        assignee = assigneeMatch[1].trim();
    }

    // Extract priority
    for (const [keyword, priorityValue] of Object.entries(PRIORITY_KEYWORDS)) {
        if (text.includes(keyword)) {
            priority = priorityValue;
            break;
        }
    }

    return {
        type: 'CREATE_TASK',
        data: {
            title: title || 'New Task',
            assignee,
            priority,
        },
    };
}

function parseAssignCommand(text: string, originalText: string): VoiceIntent {
    let taskName = '';
    let assignee = '';

    // Extract task name and assignee
    const assignPattern = /assign\s+(?:task\s+)?(.+?)\s+to\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/i;
    const match = originalText.match(assignPattern);

    if (match) {
        taskName = match[1].trim();
        assignee = match[2].trim();
    }

    return {
        type: 'ASSIGN_TASK',
        data: {
            taskName: taskName || 'Unknown Task',
            assignee: assignee || 'Unknown',
        },
    };
}

function parseStatusCommand(text: string, originalText: string): VoiceIntent {
    let projectName = '';
    let newStatus = '';

    // Direct action verbs
    const actionPatterns = [
        /(?:complete|finish)\s+(?:the\s+)?(?:project\s+)?(.+?)(?:\s+project|\s*$)/i,
        /(?:cancel|terminate)\s+(?:the\s+)?(?:project\s+)?(.+?)(?:\s+project|\s*$)/i,
        /(?:pause|hold|suspend)\s+(?:the\s+)?(?:project\s+)?(.+?)(?:\s+project|\s*$)/i,
        /(?:mark|set)\s+(?:project\s+)?(.+?)\s+(?:as|to)\s+(.+)/i,
        /update\s+(?:status\s+of\s+)?(.+?)\s+(?:to|as)\s+(.+)/i
    ];

    // Check for "complete project X"
    if (text.startsWith('complete') || text.startsWith('finish')) {
        const match = originalText.match(actionPatterns[0]);
        if (match) {
            projectName = match[1].trim();
            newStatus = 'Completed';
            return { type: 'UPDATE_STATUS', data: { projectName, newStatus } };
        }
    }

    // Check for "cancel project X"
    if (text.startsWith('cancel')) {
        const match = originalText.match(actionPatterns[1]);
        if (match) {
            projectName = match[1].trim();
            newStatus = 'Cancelled';
            return { type: 'UPDATE_STATUS', data: { projectName, newStatus } };
        }
    }

    // Check for "pause/hold project X"
    if (text.startsWith('pause') || text.startsWith('hold')) {
        const match = originalText.match(actionPatterns[2]);
        if (match) {
            projectName = match[1].trim();
            newStatus = 'On Hold';
            return { type: 'UPDATE_STATUS', data: { projectName, newStatus } };
        }
    }

    // Generic update patterns
    for (const pattern of [actionPatterns[3], actionPatterns[4]]) {
        const match = originalText.match(pattern);
        if (match) {
            projectName = match[1].trim();
            const statusText = match[2].toLowerCase().trim();

            // Map to standard status
            for (const [keyword, status] of Object.entries(STATUS_KEYWORDS)) {
                if (statusText.includes(keyword)) {
                    newStatus = status;
                    break;
                }
            }
            if (!newStatus) {
                newStatus = match[2].trim();
            }
            if (projectName && newStatus) {
                return { type: 'UPDATE_STATUS', data: { projectName, newStatus } };
            }
        }
    }

    // Fallback for strict "update X to Y" if regex didn't catch it
    const fallbackMatch = originalText.match(/update\s+(.+?)\s+(?:status\s+)?to\s+(.+)/i);
    if (fallbackMatch && !projectName) {
        projectName = fallbackMatch[1].replace(/\s*status\s*/i, '').trim();
        const statusText = fallbackMatch[2].toLowerCase().trim();
        for (const [keyword, status] of Object.entries(STATUS_KEYWORDS)) {
            if (statusText.includes(keyword)) {
                newStatus = status;
                break;
            }
        }
        if (!newStatus) newStatus = fallbackMatch[2].trim();
    }

    return {
        type: 'UPDATE_STATUS',
        data: {
            projectName: projectName || 'Unknown Project',
            newStatus: newStatus || 'Unknown Status',
        },
    };
}

function parseStageCommand(text: string, originalText: string): VoiceIntent {
    let projectName = '';
    let newStage = '';

    // Extract project name and new stage
    const stagePattern = /move\s+(.+?)\s+to\s+(.+?)(?:\s+stage|\s+phase)?$/i;
    const match = originalText.match(stagePattern);

    if (match) {
        projectName = match[1].trim();
        newStage = match[2].trim();
    }

    return {
        type: 'UPDATE_STAGE',
        data: {
            projectName: projectName || 'Unknown Project',
            newStage: newStage || 'Unknown Stage',
        },
    };
}

function parseProjectCommand(text: string, originalText: string): VoiceIntent {
    let name = '';
    let client: string | undefined;
    let description: string | undefined;
    let priority: string | undefined;

    // Extract project name
    const namePatterns = [
        /(?:project|new project)\s+(?:called|named|titled)?\s*(.+?)(?:\s+for|\s+with|\s+client|\s+priority|\s+due|$)/i,
        /(?:create|start|make)\s+(?:a\s+)?project\s+(.+?)(?:\s+for|\s+with|\s+client|\s+priority|\s+due|$)/i,
    ];

    for (const pattern of namePatterns) {
        const match = originalText.match(pattern);
        if (match) {
            name = match[1].trim();
            break;
        }
    }

    // Extract client
    const clientMatch = originalText.match(/(?:for|with|client)\s+([A-Z][a-zA-Z\s]+?)(?:\s+priority|\s+due|\s+description|$)/i);
    if (clientMatch) {
        client = clientMatch[1].trim();
    }

    // Extract priority
    for (const [keyword, priorityValue] of Object.entries(PRIORITY_KEYWORDS)) {
        if (text.includes(keyword)) {
            priority = priorityValue;
            break;
        }
    }

    // Extract description (if explicitly stated)
    const descMatch = originalText.match(/(?:description|about)\s+(.+)$/i);
    if (descMatch) {
        description = descMatch[1].trim();
    }

    return {
        type: 'CREATE_PROJECT',
        data: {
            name: name || 'New Project',
            client,
            description,
            priority,
        },
    };
}

/**
 * Get a human-readable description of an intent
 */
export function getIntentDescription(intent: VoiceIntent): string {
    switch (intent.type) {
        case 'CREATE_BRIEF':
            return `Create a brief${intent.data.client ? ` for ${intent.data.client}` : ''}: "${intent.data.title}"`;
        case 'CREATE_TASK':
            return `Create task: "${intent.data.title}"${intent.data.assignee ? ` (assign to ${intent.data.assignee})` : ''}`;
        case 'CREATE_PROJECT':
            return `Create project: "${intent.data.name}"${intent.data.client ? ` for ${intent.data.client}` : ''}`;
        case 'ASSIGN_TASK':
            return `Assign "${intent.data.taskName}" to ${intent.data.assignee}`;
        case 'GENERATE_SOW':
            return `Generate SOW for ${intent.data.projectName}`;
        case 'UPDATE_STATUS':
            return `Update ${intent.data.projectName} status to ${intent.data.newStatus}`;
        case 'UPDATE_STAGE':
            return `Move ${intent.data.projectName} to ${intent.data.newStage}`;
        case 'NAVIGATE':
            return `Navigate to ${intent.data.destination}`;
        case 'HELP':
            return 'Show available commands';
        case 'UNKNOWN':
            return 'Command not recognized';
    }
}

/**
 * Get available command examples
 */
export function getCommandExamples(): string[] {
    return [
        '"Create a brief for Nike summer campaign"',
        '"Create a new task called Review designs"',
        '"Create new project called Website Redesign for Microsoft"',
        '"Assign task to Sarah Chen"',
        '"Generate SOW for Project Vision"',
        '"Update Pepsi project to Approved"',
        '"Show me my tasks"',
        '"Go to dashboard"',
    ];
}
