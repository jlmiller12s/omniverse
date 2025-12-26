import React, { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    Download,
    Share2,
    MoreVertical,
    FileText,
    CheckCircle,
    Clock,
    X,
    Zap,
    Bell,
    Users,
    Briefcase,
    Globe,
    Shield,
    Trash2,
    Edit,
    Copy,
    Archive as ArchiveIcon,
    Layout,
    Layers,
    Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);
import { WorkflowType } from './WorkflowForge';

export interface WorkflowRecord {
    id: string;
    campaignName: string; // Title
    client: string;
    date: string;
    status: 'Draft' | 'Approved' | 'Sent';
    content: string;
    type: WorkflowType;
}

interface WorkflowRegistryProps {
    briefs: WorkflowRecord[]; // Renaming to briefs for App.tsx compatibility, but using WorkflowRecord type
    onViewBrief: (workflow: WorkflowRecord) => void;
}

const WorkflowRegistry: React.FC<WorkflowRegistryProps> = ({ briefs, onViewBrief }) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRecord | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useGSAP(() => {
        gsap.fromTo(".workflow-row",
            { opacity: 0 },
            { opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "all" }
        );
    }, { dependencies: [briefs] });

    const handleShare = (workflow: WorkflowRecord) => {
        setToast(`Registry link for ${workflow.campaignName} copied to clipboard!`);
        setTimeout(() => setToast(null), 3000);
        setActiveMenu(null);
    };

    const handleDownload = (workflow: WorkflowRecord) => {
        setToast(`Exporting ${workflow.campaignName} as localized brief...`);
        setTimeout(() => setToast(null), 3000);
        setActiveMenu(null);
    };

    const handleAction = (action: string, workflow: WorkflowRecord) => {
        setToast(`${action}: ${workflow.campaignName}`);
        setTimeout(() => setToast(null), 3000);
        setActiveMenu(null);
    };

    const getTypeIcon = (type: WorkflowType) => {
        switch (type) {
            case 'IT': return <Bell size={16} />;
            case 'HR': return <Users size={16} />;
            case 'Creative': return <FileText size={16} />;
            case 'Project': return <Briefcase size={16} />;
            case 'Automation': return <Zap size={16} />;
            case 'Sales': return <Layout size={16} />;
            case 'Compliance': return <Shield size={16} />;
            case 'Orchestration': return <Globe size={16} />;
            default: return <Layers size={16} />;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'white' }}>
                        Workflow <span className="serif" style={{ color: 'var(--omnicom-blue)' }}>Registry</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Complete audit trail of organization-wide business processes.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search registry..."
                            style={{
                                padding: '10px 16px 10px 40px',
                                borderRadius: '10px',
                                border: '1px solid var(--border-subtle)',
                                width: '240px',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                color: 'white',
                                fontFamily: 'var(--font-primary)'
                            }}
                        />
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white' }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </header>

            <div className="glass-dark" style={{ borderRadius: '20px', overflow: 'visible', border: '1px solid var(--border-subtle)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Process Title</th>
                            <th style={{ padding: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                            <th style={{ padding: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stakeholder</th>
                            <th style={{ padding: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                            <th style={{ padding: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {briefs.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                    <FileText size={48} style={{ marginBottom: '16px', opacity: 0.1 }} />
                                    <p>The registry is empty. Deploy a workflow to begin tracking.</p>
                                </td>
                            </tr>
                        ) : (
                            briefs.map((workflow) => (
                                <motion.tr
                                    key={workflow.id}
                                    className="workflow-row"
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.01)' }}
                                    style={{
                                        borderBottom: '1px solid var(--border-subtle)',
                                        position: 'relative',
                                        zIndex: activeMenu === workflow.id ? 50 : 1
                                    }}
                                >
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 127, 242, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--omnicom-blue)' }}>
                                                {getTypeIcon(workflow.type)}
                                            </div>
                                            <span style={{ fontWeight: 500, color: 'white' }}>{workflow.campaignName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{workflow.type}</span>
                                    </td>
                                    <td style={{ padding: '20px', color: 'rgba(255,255,255,0.7)' }}>{workflow.client}</td>
                                    <td style={{ padding: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{workflow.date}</td>
                                    <td style={{ padding: '20px' }}>
                                        <StatusBadge status={workflow.status} />
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', position: 'relative' }}>
                                            <IconButton icon={<Eye size={16} />} onClick={() => setSelectedWorkflow(workflow)} />
                                            <IconButton icon={<Download size={16} />} onClick={() => handleDownload(workflow)} />
                                            <IconButton icon={<Share2 size={16} />} onClick={() => handleShare(workflow)} />
                                            <div style={{ position: 'relative' }}>
                                                <IconButton
                                                    icon={<MoreVertical size={16} />}
                                                    onClick={() => setActiveMenu(activeMenu === workflow.id ? null : workflow.id)}
                                                />
                                                <AnimatePresence>
                                                    {activeMenu === workflow.id && (
                                                        <>
                                                            <div
                                                                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                                                                onClick={() => setActiveMenu(null)}
                                                            />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: 0,
                                                                    top: '100%',
                                                                    width: '180px',
                                                                    backgroundColor: '#1a1a1a',
                                                                    borderRadius: '12px',
                                                                    padding: '8px',
                                                                    zIndex: 20,
                                                                    border: '1px solid var(--border-subtle)',
                                                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                <MenuButton icon={<Edit size={14} />} label="Edit Process" onClick={() => handleAction('Editing', workflow)} />
                                                                <MenuButton icon={<Copy size={14} />} label="Duplicate" onClick={() => handleAction('Duplicating', workflow)} />
                                                                <MenuButton icon={<ArchiveIcon size={14} />} label="Archive" onClick={() => handleAction('Archiving', workflow)} />
                                                                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                                                                <MenuButton icon={<Trash2 size={14} />} label="Delete" color="#ef4444" onClick={() => handleAction('Deleting', workflow)} />
                                                                <i style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', padding: '4px 12px', display: 'block' }}>ID: {workflow.id.slice(0, 8)}</i>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {selectedWorkflow && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '40px'
                    }} onClick={() => setSelectedWorkflow(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                backgroundColor: 'var(--bg-card)',
                                width: '100%',
                                maxWidth: '900px',
                                maxHeight: '90vh',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <header style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 127, 242, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--omnicom-blue)' }}>
                                        {getTypeIcon(selectedWorkflow.type)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'white' }}>{selectedWorkflow.campaignName}</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{selectedWorkflow.type} Workflow • {selectedWorkflow.client}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => handleDownload(selectedWorkflow)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                                        <Download size={16} /> Export
                                    </button>
                                    <button onClick={() => setSelectedWorkflow(null)} style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>
                                        <X size={20} />
                                    </button>
                                </div>
                            </header>
                            <div style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: '#0a0a0a' }}>
                                <WorkflowRenderer content={selectedWorkflow.content} />
                            </div>
                        </motion.div>
                    </div>
                )}

                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        style={{
                            position: 'fixed',
                            bottom: '40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#222',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        <CheckCircle size={18} color="var(--omnicom-blue)" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatusBadge: React.FC<{ status: WorkflowRecord['status'] }> = ({ status }) => {
    const styles = {
        Draft: { bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.5)', icon: <Clock size={12} /> },
        Approved: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', icon: <CheckCircle size={12} /> },
        Sent: { bg: 'rgba(79, 127, 242, 0.1)', text: 'var(--omnicom-blue)', icon: <Share2 size={12} /> }
    }[status];

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: styles.bg,
            color: styles.text
        }}>
            {styles.icon} {status}
        </span>
    );
};

const IconButton: React.FC<{ icon: React.ReactNode, onClick?: () => void }> = ({ icon, onClick }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
    >
        {icon}
    </button>
);

const MenuButton: React.FC<{ icon: React.ReactNode, label: string, color?: string, onClick: () => void }> = ({ icon, label, color, onClick }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: color || 'rgba(255,255,255,0.8)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        <span style={{ opacity: 0.6 }}>{icon}</span>
        {label}
    </button>
);

const WorkflowRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');

    return (
        <div style={{
            fontFamily: 'Instrument Sans, sans-serif',
            lineHeight: 1.8,
            color: 'white',
        }}>
            {lines.map((line, i) => {
                if (line.trim() === '---') {
                    return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0' }} />;
                }

                if (line.startsWith('# ')) {
                    return <h1 key={i} style={{ fontSize: '2.4rem', marginBottom: '32px', color: 'var(--omnicom-coral)', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '-0.02em' }}>{line.replace('# ', '')}</h1>;
                }

                if (line.startsWith('## ')) {
                    return <h2 key={i} style={{ fontSize: '1.6rem', marginTop: '40px', marginBottom: '16px', color: 'var(--omnicom-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--omnicom-blue)', borderRadius: '2px' }}></div>
                        {line.replace('## ', '')}
                    </h2>;
                }

                if (line.startsWith('### ')) {
                    return <h3 key={i} style={{ fontSize: '1.2rem', marginTop: '24px', marginBottom: '12px', color: 'white', fontWeight: 600 }}>{line.replace('### ', '')}</h3>;
                }

                const trimmed = line.trim();
                if (trimmed.startsWith('* ')) {
                    const contentStr = trimmed.replace('* ', '');
                    const parts = contentStr.split('**');
                    return (
                        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', paddingLeft: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--omnicom-coral)', marginTop: '10px', flexShrink: 0 }}></div>
                            <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                                {parts.map((part, pi) => (
                                    pi % 2 === 1 ? <strong key={pi} style={{ color: 'var(--omnicom-blue)', fontWeight: 600 }}>{part}</strong> : part
                                ))}
                            </p>
                        </div>
                    );
                }

                if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                        <p key={i} style={{ marginBottom: '16px', fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                            {parts.map((part, pi) => (
                                pi % 2 === 1 ? <strong key={pi} style={{ color: 'var(--omnicom-blue)', fontWeight: 600 }}>{part}</strong> : part
                            ))}
                        </p>
                    );
                }

                if (line.trim() === '') return <div key={i} style={{ height: '8px' }} />;

                return <p key={i} style={{ marginBottom: '16px', fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>{line}</p>;
            })}
        </div>
    );
};

export default WorkflowRegistry;
