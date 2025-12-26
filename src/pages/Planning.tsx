import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Users,
    Target,
    Milestone,
    Flag,
    AlertCircle,
    CheckCircle,
    Edit3,
    Trash2,
    X,
    FileText,
    MessageSquare,
    Paperclip,
    ArrowRight,
    User,
    Link2
} from 'lucide-react';

interface MilestoneDetail {
    id: string;
    title: string;
    date: string;
    completed: boolean;
    description: string;
    assignee: string;
    dependencies: string[];
    deliverables: { name: string; status: 'pending' | 'in-progress' | 'complete' }[];
    comments: { user: string; text: string; time: string }[];
    attachments: { name: string; type: string; size: string }[];
}

interface PlanningPhase {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    color: string;
    milestones: MilestoneDetail[];
}

interface PlanningProject {
    id: string;
    name: string;
    client: string;
    phases: PlanningPhase[];
}

const Planning: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<string>('1');
    const [selectedMilestone, setSelectedMilestone] = useState<{ milestone: MilestoneDetail; phase: PlanningPhase } | null>(null);

    const [projects, setProjects] = useState<PlanningProject[]>([
        {
            id: '1',
            name: 'Q1 Brand Refresh Campaign',
            client: 'PepsiCo',
            phases: [
                {
                    id: 'p1',
                    name: 'Discovery & Research',
                    startDate: '2024-11-01',
                    endDate: '2024-11-30',
                    color: '#4f7ff2',
                    milestones: [
                        {
                            id: 'm1', title: 'Kickoff Meeting', date: '2024-11-01', completed: true,
                            description: 'Initial project kickoff with client stakeholders to align on objectives, timeline, and success metrics.',
                            assignee: 'Alex Morgan',
                            dependencies: [],
                            deliverables: [
                                { name: 'Meeting agenda', status: 'complete' },
                                { name: 'Stakeholder list', status: 'complete' },
                                { name: 'Project charter', status: 'complete' }
                            ],
                            comments: [
                                { user: 'Sarah Chen', text: 'Great kickoff! Client is very engaged.', time: '2 weeks ago' },
                                { user: 'Alex Morgan', text: 'Action items documented and shared.', time: '2 weeks ago' }
                            ],
                            attachments: [
                                { name: 'Kickoff_Presentation.pptx', type: 'PowerPoint', size: '2.4 MB' },
                                { name: 'Meeting_Notes.pdf', type: 'PDF', size: '124 KB' }
                            ]
                        },
                        {
                            id: 'm2', title: 'Market Research Complete', date: '2024-11-15', completed: true,
                            description: 'Complete comprehensive market research including consumer trends, competitor analysis, and industry benchmarks.',
                            assignee: 'James Wilson',
                            dependencies: ['Kickoff Meeting'],
                            deliverables: [
                                { name: 'Consumer trends report', status: 'complete' },
                                { name: 'Market size analysis', status: 'complete' },
                                { name: 'Target audience profiles', status: 'complete' }
                            ],
                            comments: [
                                { user: 'James Wilson', text: 'Research shows strong opportunity in Gen Z segment.', time: '1 week ago' }
                            ],
                            attachments: [
                                { name: 'Market_Research_2024.pdf', type: 'PDF', size: '5.8 MB' },
                                { name: 'Consumer_Survey_Results.xlsx', type: 'Excel', size: '890 KB' }
                            ]
                        },
                        {
                            id: 'm3', title: 'Competitor Analysis', date: '2024-11-30', completed: true,
                            description: 'Deep dive analysis of top 5 competitors including positioning, messaging, and market share.',
                            assignee: 'Sarah Chen',
                            dependencies: ['Market Research Complete'],
                            deliverables: [
                                { name: 'Competitor matrix', status: 'complete' },
                                { name: 'SWOT analysis', status: 'complete' },
                                { name: 'Recommendations doc', status: 'complete' }
                            ],
                            comments: [],
                            attachments: [
                                { name: 'Competitor_Analysis.pdf', type: 'PDF', size: '3.2 MB' }
                            ]
                        }
                    ]
                },
                {
                    id: 'p2',
                    name: 'Strategy Development',
                    startDate: '2024-12-01',
                    endDate: '2024-12-20',
                    color: '#22c55e',
                    milestones: [
                        {
                            id: 'm4', title: 'Strategy Presentation', date: '2024-12-10', completed: true,
                            description: 'Present comprehensive brand strategy to client leadership team for feedback and alignment.',
                            assignee: 'Alex Morgan',
                            dependencies: ['Competitor Analysis'],
                            deliverables: [
                                { name: 'Strategy deck', status: 'complete' },
                                { name: 'Brand positioning', status: 'complete' },
                                { name: 'Key messages', status: 'complete' }
                            ],
                            comments: [
                                { user: 'Alex Morgan', text: 'Client loved the new direction!', time: '3 days ago' }
                            ],
                            attachments: [
                                { name: 'Brand_Strategy_v2.pptx', type: 'PowerPoint', size: '8.1 MB' }
                            ]
                        },
                        {
                            id: 'm5', title: 'Client Approval', date: '2024-12-19', completed: false,
                            description: 'Obtain formal sign-off from client on brand strategy and creative direction.',
                            assignee: 'Alex Morgan',
                            dependencies: ['Strategy Presentation'],
                            deliverables: [
                                { name: 'Signed approval form', status: 'pending' },
                                { name: 'Budget confirmation', status: 'in-progress' },
                                { name: 'Timeline agreement', status: 'pending' }
                            ],
                            comments: [
                                { user: 'Sarah Chen', text: 'Client requested minor revisions to messaging.', time: '1 day ago' },
                                { user: 'Alex Morgan', text: 'Revisions in progress, expecting approval by EOD tomorrow.', time: '6 hours ago' }
                            ],
                            attachments: []
                        }
                    ]
                },
                {
                    id: 'p3',
                    name: 'Creative Production',
                    startDate: '2024-12-21',
                    endDate: '2025-01-10',
                    color: '#f97316',
                    milestones: [
                        {
                            id: 'm6', title: 'Asset Review', date: '2025-01-04', completed: false,
                            description: 'Review all creative assets with client including video, photography, and graphic design deliverables.',
                            assignee: 'Sarah Chen',
                            dependencies: ['Client Approval'],
                            deliverables: [
                                { name: 'Video assets', status: 'in-progress' },
                                { name: 'Photography suite', status: 'pending' },
                                { name: 'Social media templates', status: 'in-progress' }
                            ],
                            comments: [],
                            attachments: []
                        },
                        {
                            id: 'm7', title: 'Final Deliverables', date: '2025-01-09', completed: false,
                            description: 'Deliver all final creative assets to client including all file formats and usage guidelines.',
                            assignee: 'Sarah Chen',
                            dependencies: ['Asset Review'],
                            deliverables: [
                                { name: 'Final asset package', status: 'pending' },
                                { name: 'Brand guidelines', status: 'pending' },
                                { name: 'Usage documentation', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        }
                    ]
                },
                {
                    id: 'p4',
                    name: 'Launch & Optimization',
                    startDate: '2025-01-11',
                    endDate: '2025-01-31',
                    color: '#ec4899',
                    milestones: [
                        {
                            id: 'm8', title: 'Campaign Launch', date: '2025-01-14', completed: false,
                            description: 'Execute campaign launch across all channels including social, digital, and traditional media.',
                            assignee: 'James Wilson',
                            dependencies: ['Final Deliverables'],
                            deliverables: [
                                { name: 'Launch checklist', status: 'pending' },
                                { name: 'Media placements', status: 'pending' },
                                { name: 'Tracking setup', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        },
                        {
                            id: 'm9', title: 'Performance Report', date: '2025-01-30', completed: false,
                            description: 'Compile and present campaign performance report with KPIs, insights, and optimization recommendations.',
                            assignee: 'James Wilson',
                            dependencies: ['Campaign Launch'],
                            deliverables: [
                                { name: 'KPI dashboard', status: 'pending' },
                                { name: 'Performance summary', status: 'pending' },
                                { name: 'Optimization roadmap', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        }
                    ]
                }
            ]
        },
        {
            id: '2',
            name: 'Vision Pro Launch Strategy',
            client: 'Apple Inc.',
            phases: [
                {
                    id: 'p5',
                    name: 'Market Analysis',
                    startDate: '2024-12-01',
                    endDate: '2024-12-31',
                    color: '#8b5cf6',
                    milestones: [
                        {
                            id: 'm10', title: 'Enterprise Market Report', date: '2024-12-15', completed: true,
                            description: 'Comprehensive analysis of enterprise VR/AR market opportunity and competitive landscape.',
                            assignee: 'Mike Rodriguez',
                            dependencies: [],
                            deliverables: [
                                { name: 'Market opportunity analysis', status: 'complete' },
                                { name: 'Enterprise use cases', status: 'complete' },
                                { name: 'ROI calculator', status: 'complete' }
                            ],
                            comments: [
                                { user: 'Mike Rodriguez', text: 'Strong enterprise demand identified in healthcare and manufacturing.', time: '5 days ago' }
                            ],
                            attachments: [
                                { name: 'Enterprise_VR_Market_2024.pdf', type: 'PDF', size: '4.2 MB' }
                            ]
                        },
                        {
                            id: 'm11', title: 'Developer Ecosystem Analysis', date: '2024-12-31', completed: false,
                            description: 'Deep dive into developer ecosystem, SDK capabilities, and partnership opportunities.',
                            assignee: 'Mike Rodriguez',
                            dependencies: ['Enterprise Market Report'],
                            deliverables: [
                                { name: 'Developer survey results', status: 'in-progress' },
                                { name: 'SDK comparison matrix', status: 'pending' },
                                { name: 'Partnership recommendations', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        }
                    ]
                },
                {
                    id: 'p6',
                    name: 'Partnership Development',
                    startDate: '2025-01-01',
                    endDate: '2025-01-31',
                    color: '#06b6d4',
                    milestones: [
                        {
                            id: 'm12', title: 'Partner Outreach', date: '2025-01-15', completed: false,
                            description: 'Initial outreach to top 20 potential enterprise partners for Vision Pro integrations.',
                            assignee: 'Sarah Chen',
                            dependencies: ['Developer Ecosystem Analysis'],
                            deliverables: [
                                { name: 'Partner target list', status: 'pending' },
                                { name: 'Outreach materials', status: 'pending' },
                                { name: 'Meeting schedule', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        },
                        {
                            id: 'm13', title: 'Partnership Agreements', date: '2025-01-31', completed: false,
                            description: 'Finalize partnership agreements with at least 5 key enterprise partners.',
                            assignee: 'Sarah Chen',
                            dependencies: ['Partner Outreach'],
                            deliverables: [
                                { name: 'Signed agreements', status: 'pending' },
                                { name: 'Integration timelines', status: 'pending' },
                                { name: 'Co-marketing plans', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        }
                    ]
                },
                {
                    id: 'p7',
                    name: 'Launch Execution',
                    startDate: '2025-02-01',
                    endDate: '2025-02-28',
                    color: '#ef4444',
                    milestones: [
                        {
                            id: 'm14', title: 'Launch Event', date: '2025-02-15', completed: false,
                            description: 'Execute enterprise launch event including keynote, demos, and partner announcements.',
                            assignee: 'Alex Morgan',
                            dependencies: ['Partnership Agreements'],
                            deliverables: [
                                { name: 'Event logistics', status: 'pending' },
                                { name: 'Keynote presentation', status: 'pending' },
                                { name: 'Demo experiences', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        },
                        {
                            id: 'm15', title: 'Post-Launch Review', date: '2025-02-28', completed: false,
                            description: 'Comprehensive post-launch analysis including sales performance, partner feedback, and next steps.',
                            assignee: 'Alex Morgan',
                            dependencies: ['Launch Event'],
                            deliverables: [
                                { name: 'Launch metrics report', status: 'pending' },
                                { name: 'Partner feedback summary', status: 'pending' },
                                { name: 'Q2 roadmap', status: 'pending' }
                            ],
                            comments: [],
                            attachments: []
                        }
                    ]
                }
            ]
        }
    ]);

    const currentProject = projects.find(p => p.id === selectedProject);

    // Calculate timeline range
    const getTimelineRange = () => {
        if (!currentProject) return { start: new Date(), end: new Date(), months: [] };
        const allDates = currentProject.phases.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
        const start = new Date(Math.min(...allDates.map(d => d.getTime())));
        const end = new Date(Math.max(...allDates.map(d => d.getTime())));

        const months: Date[] = [];
        const current = new Date(start.getFullYear(), start.getMonth(), 1);
        while (current <= end) {
            months.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
        return { start, end, months };
    };

    const { months } = getTimelineRange();

    const getPhasePosition = (phase: PlanningPhase) => {
        if (months.length === 0) return { left: 0, width: 0 };
        const timelineStart = months[0].getTime();
        const timelineEnd = new Date(months[months.length - 1].getFullYear(), months[months.length - 1].getMonth() + 1, 0).getTime();
        const totalDuration = timelineEnd - timelineStart;
        const phaseStart = new Date(phase.startDate).getTime();
        const phaseEnd = new Date(phase.endDate).getTime();
        const left = ((phaseStart - timelineStart) / totalDuration) * 100;
        const width = ((phaseEnd - phaseStart) / totalDuration) * 100;
        return { left: Math.max(0, left), width: Math.min(100 - left, width) };
    };

    const getMilestonePosition = (date: string) => {
        if (months.length === 0) return 0;
        const timelineStart = months[0].getTime();
        const timelineEnd = new Date(months[months.length - 1].getFullYear(), months[months.length - 1].getMonth() + 1, 0).getTime();
        const totalDuration = timelineEnd - timelineStart;
        const milestoneDate = new Date(date).getTime();
        return ((milestoneDate - timelineStart) / totalDuration) * 100;
    };

    const getTodayPosition = () => {
        if (months.length === 0) return -1;
        const timelineStart = months[0].getTime();
        const timelineEnd = new Date(months[months.length - 1].getFullYear(), months[months.length - 1].getMonth() + 1, 0).getTime();
        const today = new Date().getTime();
        if (today < timelineStart || today > timelineEnd) return -1;
        return ((today - timelineStart) / (timelineEnd - timelineStart)) * 100;
    };

    const handleMilestoneClick = (milestone: MilestoneDetail, phase: PlanningPhase) => {
        setSelectedMilestone({ milestone, phase });
    };

    const toggleMilestoneComplete = () => {
        if (!selectedMilestone) return;
        setProjects(projects.map(project => ({
            ...project,
            phases: project.phases.map(phase => ({
                ...phase,
                milestones: phase.milestones.map(m =>
                    m.id === selectedMilestone.milestone.id ? { ...m, completed: !m.completed } : m
                )
            }))
        })));
        setSelectedMilestone({
            ...selectedMilestone,
            milestone: { ...selectedMilestone.milestone, completed: !selectedMilestone.milestone.completed }
        });
    };

    const getDeliverableStatusColor = (status: string) => {
        switch (status) {
            case 'complete': return '#22c55e';
            case 'in-progress': return '#eab308';
            default: return 'rgba(255,255,255,0.3)';
        }
    };

    return (
        <div style={{ padding: '32px', width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Calendar size={28} color="var(--omnicom-blue)" />
                        Planning
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '0.95rem' }}>
                        Visualize project timelines, phases, and milestones
                    </p>
                </div>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none', minWidth: '200px' }}>
                    {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
            </div>

            {currentProject && (
                <>
                    {/* Project Info Card */}
                    <div className="glass-dark" style={{ padding: '24px', borderRadius: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ color: 'white', fontSize: '1.4rem', margin: 0 }}>{currentProject.name}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{currentProject.client}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Phases</p><p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{currentProject.phases.length}</p></div>
                            <div style={{ textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Milestones</p><p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{currentProject.phases.reduce((acc, p) => acc + p.milestones.length, 0)}</p></div>
                            <div style={{ textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Completed</p><p style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{currentProject.phases.reduce((acc, p) => acc + p.milestones.filter(m => m.completed).length, 0)}</p></div>
                        </div>
                    </div>

                    {/* Timeline View */}
                    <div className="glass-dark" style={{ padding: '32px', borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} /> Project Timeline</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                                Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>

                        {/* Month Headers */}
                        <div style={{ display: 'flex', marginBottom: '16px', paddingLeft: '200px' }}>
                            {months.map((month, i) => (<div key={i} style={{ flex: 1, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>{month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</div>))}
                        </div>

                        {/* Timeline Grid */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: '200px', right: 0, bottom: 0, display: 'flex' }}>
                                {months.map((_, i) => (<div key={i} style={{ flex: 1, borderLeft: '1px solid rgba(255,255,255,0.05)' }} />))}
                            </div>
                            {getTodayPosition() >= 0 && (
                                <div style={{ position: 'absolute', left: `calc(200px + ${getTodayPosition()}%)`, top: 0, bottom: 0, width: '2px', backgroundColor: '#ef4444', zIndex: 10 }}>
                                    <div style={{ position: 'absolute', top: '-8px', left: '-4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                                </div>
                            )}
                            {currentProject.phases.map((phase, index) => {
                                const { left, width } = getPhasePosition(phase);
                                return (
                                    <div key={phase.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
                                        <div style={{ width: '200px', paddingRight: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: phase.color }} />
                                                <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>{phase.name}</span>
                                            </div>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '4px', marginLeft: '20px' }}>
                                                {new Date(phase.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(phase.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div style={{ flex: 1, position: 'relative', height: '48px' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.5, delay: index * 0.1 }} style={{ position: 'absolute', left: `${left}%`, top: '8px', height: '32px', backgroundColor: phase.color, borderRadius: '8px', opacity: 0.8, cursor: 'pointer' }} />
                                            {phase.milestones.map(milestone => {
                                                const pos = getMilestonePosition(milestone.date);
                                                return (
                                                    <motion.div key={milestone.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + index * 0.1 }} onClick={() => handleMilestoneClick(milestone, phase)} style={{ position: 'absolute', left: `${pos}%`, top: '16px', transform: 'translateX(-50%)', zIndex: 5, cursor: 'pointer' }}>
                                                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: milestone.completed ? '#22c55e' : '#1a1a1a', border: `2px solid ${milestone.completed ? '#22c55e' : phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={`${milestone.title} - ${new Date(milestone.date).toLocaleDateString()}`}>
                                                            {milestone.completed && <CheckCircle size={10} color="white" />}
                                                        </motion.div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming Milestones */}
                    <div className="glass-dark" style={{ padding: '32px', borderRadius: '20px', marginTop: '24px' }}>
                        <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Milestone size={18} /> Upcoming Milestones</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {currentProject.phases.flatMap(phase =>
                                phase.milestones.filter(m => !m.completed).map(milestone => (
                                    <motion.div key={milestone.id} whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.98 }} onClick={() => handleMilestoneClick(milestone, phase)} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${phase.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Flag size={18} color={phase.color} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{milestone.title}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '4px' }}>{phase.name}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                                <Calendar size={14} />
                                                {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Legend */}
                    <div style={{ marginTop: '24px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
                        {currentProject.phases.map(phase => (
                            <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: phase.color }} />
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{phase.name}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Milestone Detail Modal */}
            <AnimatePresence>
                {selectedMilestone && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMilestone(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '40px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-dark" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${selectedMilestone.phase.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Flag size={20} color={selectedMilestone.phase.color} />
                                        </div>
                                        <div>
                                            <h2 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>{selectedMilestone.milestone.title}</h2>
                                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.9rem' }}>{selectedMilestone.phase.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedMilestone(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '8px' }}><X size={24} /></button>
                            </div>

                            {/* Status & Date */}
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={toggleMilestoneComplete} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: selectedMilestone.milestone.completed ? '#22c55e' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {selectedMilestone.milestone.completed ? <><CheckCircle size={16} /> Completed</> : <><Clock size={16} /> Mark Complete</>}
                                </motion.button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    <Calendar size={16} color="rgba(255,255,255,0.5)" />
                                    <span style={{ color: 'white', fontSize: '0.9rem' }}>{new Date(selectedMilestone.milestone.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Description</h4>
                                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{selectedMilestone.milestone.description}</p>
                            </div>

                            {/* Assignee & Dependencies */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                <div>
                                    <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Assignee</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--omnicom-blue), #3a6cd9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{selectedMilestone.milestone.assignee.charAt(0)}</div>
                                        <span style={{ color: 'white' }}>{selectedMilestone.milestone.assignee}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Link2 size={16} /> Dependencies</h4>
                                    {selectedMilestone.milestone.dependencies.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {selectedMilestone.milestone.dependencies.map((dep, i) => (
                                                <span key={i} style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{dep}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>No dependencies</p>
                                    )}
                                </div>
                            </div>

                            {/* Deliverables */}
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={16} /> Deliverables</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {selectedMilestone.milestone.deliverables.map((del, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getDeliverableStatusColor(del.status) }} />
                                            <span style={{ flex: 1, color: 'white' }}>{del.name}</span>
                                            <span style={{ color: getDeliverableStatusColor(del.status), fontSize: '0.8rem', textTransform: 'capitalize' }}>{del.status.replace('-', ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attachments */}
                            {selectedMilestone.milestone.attachments.length > 0 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Paperclip size={16} /> Attachments</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {selectedMilestone.milestone.attachments.map((att, i) => (
                                            <div key={i} style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                                <FileText size={18} color="var(--omnicom-blue)" />
                                                <div>
                                                    <p style={{ color: 'white', fontSize: '0.9rem', margin: 0 }}>{att.name}</p>
                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: 0 }}>{att.type} • {att.size}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comments */}
                            {selectedMilestone.milestone.comments.length > 0 && (
                                <div>
                                    <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={16} /> Comments ({selectedMilestone.milestone.comments.length})</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {selectedMilestone.milestone.comments.map((comment, i) => (
                                            <div key={i} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--omnicom-blue)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{comment.user}</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{comment.time}</span>
                                                </div>
                                                <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{comment.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Planning;
