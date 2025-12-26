import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Check,
    Building2,
    Calendar,
    DollarSign,
    ListChecks,
    FileCheck,
    Download,
    Copy,
    RefreshCw,
    Loader2,
    CheckCircle,
    Briefcase,
    Clock,
    Printer
} from 'lucide-react';

interface SOWData {
    clientName: string;
    clientContact: string;
    clientEmail: string;
    clientAddress: string;
    projectName: string;
    projectDescription: string;
    projectType: string;
    industry: string;
    objectives: string;
    deliverables: string;
    exclusions: string;
    startDate: string;
    endDate: string;
    milestones: string;
    totalBudget: string;
    paymentTerms: string;
    teamSize: string;
    keyRoles: string;
}

const SOWGenerator: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [sowRef, setSowRef] = useState('');

    const [sowData, setSowData] = useState<SOWData>({
        clientName: '',
        clientContact: '',
        clientEmail: '',
        clientAddress: '',
        projectName: '',
        projectDescription: '',
        projectType: 'Brand Campaign',
        industry: 'Technology',
        objectives: '',
        deliverables: '',
        exclusions: '',
        startDate: '',
        endDate: '',
        milestones: '',
        totalBudget: '',
        paymentTerms: '50% upfront, 50% on completion',
        teamSize: '',
        keyRoles: ''
    });

    const steps = [
        { id: 'client', title: 'Client Information', icon: Building2, description: 'Enter client details' },
        { id: 'project', title: 'Project Overview', icon: Briefcase, description: 'Define project scope' },
        { id: 'scope', title: 'Scope & Deliverables', icon: ListChecks, description: 'Outline deliverables' },
        { id: 'timeline', title: 'Timeline', icon: Calendar, description: 'Set milestones' },
        { id: 'budget', title: 'Budget & Terms', icon: DollarSign, description: 'Financial details' },
        { id: 'generate', title: 'Generate SOW', icon: Sparkles, description: 'AI-powered generation' }
    ];

    const projectTypes = [
        'Brand Campaign', 'Digital Marketing', 'Website Development', 'Mobile App',
        'Content Strategy', 'Social Media', 'Video Production', 'Market Research',
        'Product Launch', 'Rebranding', 'Consulting', 'Custom Project'
    ];

    const industries = [
        'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
        'Entertainment', 'Education', 'Real Estate', 'Automotive', 'Food & Beverage',
        'Travel & Hospitality', 'Non-Profit', 'Government', 'Other'
    ];

    const handleInputChange = (field: keyof SOWData, value: string) => {
        setSowData(prev => ({ ...prev, [field]: value }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return sowData.clientName && sowData.clientEmail;
            case 1: return sowData.projectName && sowData.projectDescription;
            case 2: return sowData.objectives && sowData.deliverables;
            case 3: return sowData.startDate && sowData.endDate;
            case 4: return sowData.totalBudget;
            default: return true;
        }
    };

    const generateSOW = async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSowRef(`SOW-${Date.now().toString().slice(-6)}`);
        setIsGenerating(false);
        setShowPreview(true);
    };

    const copyToClipboard = () => {
        const content = document.getElementById('sow-document')?.innerText || '';
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const printSOW = () => {
        const printContent = document.getElementById('sow-document');
        if (!printContent) return;
        const printWindow = window.open('', '', 'width=900,height=700');
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Statement of Work - ${sowData.projectName}</title>
                    <style>
                        body { font-family: 'Georgia', serif; padding: 40px; line-height: 1.6; color: #1a1a1a; }
                        h1 { font-size: 28px; text-align: center; border-bottom: 3px solid #1a1a1a; padding-bottom: 20px; }
                        h2 { font-size: 18px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 30px; }
                        h3 { font-size: 14px; color: #555; margin-top: 20px; }
                        p, li { font-size: 12px; }
                        .header-info { text-align: center; margin-bottom: 30px; }
                        .section { margin-bottom: 25px; }
                        .signature-line { border-bottom: 1px solid #333; width: 250px; display: inline-block; margin-right: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                        td { padding: 8px; border: 1px solid #ddd; font-size: 12px; }
                        .label { font-weight: bold; width: 150px; background: #f5f5f5; }
                    </style>
                </head>
                <body>${printContent.innerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const getDuration = () => {
        if (!sowData.startDate || !sowData.endDate) return 0;
        return Math.ceil((new Date(sowData.endDate).getTime() - new Date(sowData.startDate).getTime()) / (1000 * 60 * 60 * 24));
    };

    // Professional document styles
    const docStyles = {
        container: { backgroundColor: 'white', color: '#1a1a1a', padding: '60px', borderRadius: '8px', maxHeight: '600px', overflowY: 'auto' as const, fontFamily: "'Georgia', 'Times New Roman', serif", lineHeight: 1.7 },
        title: { fontSize: '32px', fontWeight: 700 as const, textAlign: 'center' as const, marginBottom: '8px', color: '#1a1a1a', letterSpacing: '2px' },
        subtitle: { fontSize: '14px', textAlign: 'center' as const, color: '#666', marginBottom: '40px' },
        sectionTitle: { fontSize: '16px', fontWeight: 700 as const, color: '#1a1a1a', borderBottom: '2px solid #1a1a1a', paddingBottom: '8px', marginTop: '40px', marginBottom: '20px', textTransform: 'uppercase' as const, letterSpacing: '1px' },
        subsectionTitle: { fontSize: '13px', fontWeight: 600 as const, color: '#333', marginTop: '24px', marginBottom: '12px' },
        text: { fontSize: '13px', color: '#333', marginBottom: '12px' },
        label: { fontWeight: 600 as const, color: '#1a1a1a' },
        divider: { height: '1px', backgroundColor: '#e0e0e0', margin: '30px 0' },
        table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: '20px' },
        tableCell: { padding: '12px 16px', border: '1px solid #ddd', fontSize: '13px' },
        tableCellLabel: { padding: '12px 16px', border: '1px solid #ddd', fontSize: '13px', fontWeight: 600 as const, backgroundColor: '#f8f8f8', width: '180px' },
        list: { paddingLeft: '24px', marginBottom: '16px' },
        listItem: { fontSize: '13px', color: '#333', marginBottom: '8px' },
        signatureLine: { borderBottom: '1px solid #333', width: '280px', display: 'inline-block', marginTop: '40px' },
        signatureLabel: { fontSize: '11px', color: '#666', marginTop: '4px' }
    };

    const renderSOWDocument = () => (
        <div id="sow-document" style={docStyles.container}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '20px', letterSpacing: '3px' }}>OMNICOM GROUP</div>
                <h1 style={docStyles.title}>STATEMENT OF WORK</h1>
                <div style={docStyles.subtitle}>
                    Reference: {sowRef} &nbsp;|&nbsp; Version 1.0 &nbsp;|&nbsp; {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            {/* Executive Summary */}
            <div style={docStyles.divider} />
            <table style={docStyles.table}>
                <tbody>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Client</td>
                        <td style={docStyles.tableCell}>{sowData.clientName}</td>
                        <td style={docStyles.tableCellLabel}>Project</td>
                        <td style={docStyles.tableCell}>{sowData.projectName}</td>
                    </tr>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Project Type</td>
                        <td style={docStyles.tableCell}>{sowData.projectType}</td>
                        <td style={docStyles.tableCellLabel}>Industry</td>
                        <td style={docStyles.tableCell}>{sowData.industry}</td>
                    </tr>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Duration</td>
                        <td style={docStyles.tableCell}>{formatDate(sowData.startDate)} – {formatDate(sowData.endDate)} ({getDuration()} days)</td>
                        <td style={docStyles.tableCellLabel}>Investment</td>
                        <td style={docStyles.tableCell}><strong>{sowData.totalBudget}</strong></td>
                    </tr>
                </tbody>
            </table>

            {/* Section 1: Parties */}
            <h2 style={docStyles.sectionTitle}>1. Parties</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                    <h3 style={docStyles.subsectionTitle}>Service Provider</h3>
                    <p style={docStyles.text}>
                        <strong>Omnicom Group</strong><br />
                        Omniverse Workflow Division<br />
                        123 Madison Avenue<br />
                        New York, NY 10001
                    </p>
                </div>
                <div>
                    <h3 style={docStyles.subsectionTitle}>Client</h3>
                    <p style={docStyles.text}>
                        <strong>{sowData.clientName}</strong><br />
                        {sowData.clientContact && <>{sowData.clientContact}<br /></>}
                        {sowData.clientEmail}<br />
                        {sowData.clientAddress}
                    </p>
                </div>
            </div>

            {/* Section 2: Project Overview */}
            <h2 style={docStyles.sectionTitle}>2. Project Overview</h2>
            <p style={docStyles.text}>{sowData.projectDescription}</p>

            {/* Section 3: Scope of Work */}
            <h2 style={docStyles.sectionTitle}>3. Scope of Work</h2>

            <h3 style={docStyles.subsectionTitle}>3.1 Objectives</h3>
            <ul style={docStyles.list}>
                {sowData.objectives.split('\n').filter(o => o.trim()).map((obj, i) => (
                    <li key={i} style={docStyles.listItem}>{obj.trim()}</li>
                ))}
            </ul>

            <h3 style={docStyles.subsectionTitle}>3.2 Deliverables</h3>
            <table style={docStyles.table}>
                <tbody>
                    {sowData.deliverables.split('\n').filter(d => d.trim()).map((del, i) => (
                        <tr key={i}>
                            <td style={{ ...docStyles.tableCell, width: '40px', textAlign: 'center', fontWeight: 600 }}>{i + 1}</td>
                            <td style={docStyles.tableCell}>{del.trim()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 style={docStyles.subsectionTitle}>3.3 Exclusions</h3>
            <ul style={docStyles.list}>
                {(sowData.exclusions || 'Items not explicitly mentioned in deliverables\nOngoing maintenance beyond project timeline\nThird-party licensing fees unless specified').split('\n').filter(e => e.trim()).map((exc, i) => (
                    <li key={i} style={docStyles.listItem}>{exc.trim()}</li>
                ))}
            </ul>

            {/* Section 4: Timeline */}
            <h2 style={docStyles.sectionTitle}>4. Project Timeline</h2>
            <table style={docStyles.table}>
                <tbody>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Commencement Date</td>
                        <td style={docStyles.tableCell}>{formatDate(sowData.startDate)}</td>
                    </tr>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Completion Date</td>
                        <td style={docStyles.tableCell}>{formatDate(sowData.endDate)}</td>
                    </tr>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Total Duration</td>
                        <td style={docStyles.tableCell}>{getDuration()} calendar days</td>
                    </tr>
                </tbody>
            </table>

            <h3 style={docStyles.subsectionTitle}>Key Milestones</h3>
            <table style={docStyles.table}>
                <tbody>
                    {(sowData.milestones || 'Project Kickoff & Discovery\nStrategy Development & Approval\nCreative Production\nReview & Revisions\nFinal Delivery & Handoff').split('\n').filter(m => m.trim()).map((milestone, i) => (
                        <tr key={i}>
                            <td style={{ ...docStyles.tableCell, width: '100px', fontWeight: 600 }}>Milestone {i + 1}</td>
                            <td style={docStyles.tableCell}>{milestone.trim()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Section 5: Investment */}
            <h2 style={docStyles.sectionTitle}>5. Investment & Payment Terms</h2>
            <table style={docStyles.table}>
                <tbody>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Total Project Fee</td>
                        <td style={{ ...docStyles.tableCell, fontSize: '16px', fontWeight: 700 }}>{sowData.totalBudget}</td>
                    </tr>
                    <tr>
                        <td style={docStyles.tableCellLabel}>Payment Terms</td>
                        <td style={docStyles.tableCell}>{sowData.paymentTerms}</td>
                    </tr>
                </tbody>
            </table>
            <p style={{ ...docStyles.text, fontSize: '11px', color: '#666' }}>
                All invoices are due within 30 days of receipt. Late payments may incur a 1.5% monthly interest charge.
                Any additional work outside the defined scope will be quoted separately and require written approval.
            </p>

            {/* Section 6: Team */}
            <h2 style={docStyles.sectionTitle}>6. Project Team</h2>
            {sowData.teamSize && <p style={docStyles.text}><span style={docStyles.label}>Team Size:</span> {sowData.teamSize} dedicated team members</p>}
            <h3 style={docStyles.subsectionTitle}>Key Roles & Responsibilities</h3>
            <ul style={docStyles.list}>
                {(sowData.keyRoles || 'Project Manager: Overall project coordination and client communication\nCreative Director: Creative strategy and quality oversight\nAccount Manager: Day-to-day client liaison\nStrategy Lead: Strategic planning and recommendations\nProduction Team: Execution of deliverables').split('\n').filter(r => r.trim()).map((role, i) => (
                    <li key={i} style={docStyles.listItem}>{role.trim()}</li>
                ))}
            </ul>

            {/* Section 7: Assumptions */}
            <h2 style={docStyles.sectionTitle}>7. Assumptions & Dependencies</h2>
            <ul style={docStyles.list}>
                <li style={docStyles.listItem}>Client will provide timely feedback within 3 business days of each deliverable submission</li>
                <li style={docStyles.listItem}>All necessary brand assets, materials, and content will be provided by the client</li>
                <li style={docStyles.listItem}>Client has the authority to approve deliverables and authorize payments</li>
                <li style={docStyles.listItem}>Access to required systems, platforms, and stakeholders will be granted as needed</li>
                <li style={docStyles.listItem}>Project timeline is dependent on client approval at each milestone</li>
            </ul>

            {/* Section 8: Change Management */}
            <h2 style={docStyles.sectionTitle}>8. Change Management</h2>
            <p style={docStyles.text}>
                Any changes to this Statement of Work must be documented in writing and approved by authorized representatives
                of both parties. Changes may impact project timeline, budget, and scope of deliverables. A formal Change Request
                will be submitted for any modifications, with associated cost and timeline implications clearly documented.
            </p>

            {/* Section 9: Legal */}
            <h2 style={docStyles.sectionTitle}>9. Confidentiality & Intellectual Property</h2>
            <p style={docStyles.text}>
                <strong>Confidentiality:</strong> Both parties agree to maintain strict confidentiality of all proprietary
                information, trade secrets, and sensitive business data shared during this engagement.
            </p>
            <p style={docStyles.text}>
                <strong>Intellectual Property:</strong> Upon full payment of all fees, all deliverables created specifically
                for this project will be transferred to the Client. Pre-existing materials, methodologies, and tools remain
                the exclusive property of the Service Provider.
            </p>

            {/* Section 10: Acceptance */}
            <h2 style={docStyles.sectionTitle}>10. Acceptance & Authorization</h2>
            <p style={docStyles.text}>
                By signing below, both parties agree to the terms, conditions, and scope of work outlined in this Statement of Work.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '50px' }}>
                <div>
                    <p style={{ ...docStyles.text, fontWeight: 600 }}>For Omnicom Group:</p>
                    <div style={docStyles.signatureLine}></div>
                    <p style={docStyles.signatureLabel}>Authorized Signature</p>
                    <div style={{ ...docStyles.signatureLine, width: '180px', marginTop: '20px' }}></div>
                    <p style={docStyles.signatureLabel}>Date</p>
                </div>
                <div>
                    <p style={{ ...docStyles.text, fontWeight: 600 }}>For {sowData.clientName}:</p>
                    <div style={docStyles.signatureLine}></div>
                    <p style={docStyles.signatureLabel}>Authorized Signature</p>
                    <div style={{ ...docStyles.signatureLine, width: '180px', marginTop: '20px' }}></div>
                    <p style={docStyles.signatureLabel}>Date</p>
                </div>
            </div>

            <div style={{ ...docStyles.divider, marginTop: '60px' }} />
            <p style={{ textAlign: 'center', fontSize: '10px', color: '#999' }}>
                This Statement of Work was generated using Omniverse AI-Powered Document Generator<br />
                Omnicom Group © {new Date().getFullYear()} | Confidential
            </p>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Client/Company Name *</label>
                            <input type="text" placeholder="e.g., Acme Corporation" value={sowData.clientName} onChange={(e) => handleInputChange('clientName', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Primary Contact</label>
                                <input type="text" placeholder="Contact name" value={sowData.clientContact} onChange={(e) => handleInputChange('clientContact', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Email Address *</label>
                                <input type="email" placeholder="client@company.com" value={sowData.clientEmail} onChange={(e) => handleInputChange('clientEmail', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Business Address</label>
                            <textarea placeholder="Full business address" value={sowData.clientAddress} onChange={(e) => handleInputChange('clientAddress', e.target.value)} rows={2} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project Name *</label>
                            <input type="text" placeholder="e.g., Q1 Brand Refresh Campaign" value={sowData.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project Type</label>
                                <select value={sowData.projectType} onChange={(e) => handleInputChange('projectType', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1a1a1a', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                    {projectTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Industry</label>
                                <select value={sowData.industry} onChange={(e) => handleInputChange('industry', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1a1a1a', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                    {industries.map(ind => (<option key={ind} value={ind}>{ind}</option>))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project Description *</label>
                            <textarea placeholder="Describe the project in detail..." value={sowData.projectDescription} onChange={(e) => handleInputChange('projectDescription', e.target.value)} rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project Objectives * <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>(one per line)</span></label>
                            <textarea placeholder="Increase brand awareness by 25%&#10;Launch new product messaging" value={sowData.objectives} onChange={(e) => handleInputChange('objectives', e.target.value)} rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Deliverables * <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>(one per line)</span></label>
                            <textarea placeholder="Brand strategy document&#10;Creative concept presentations" value={sowData.deliverables} onChange={(e) => handleInputChange('deliverables', e.target.value)} rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Exclusions <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>(optional)</span></label>
                            <textarea placeholder="Media buying/placement&#10;Print production" value={sowData.exclusions} onChange={(e) => handleInputChange('exclusions', e.target.value)} rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project Start Date *</label>
                                <input type="date" value={sowData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1a1a1a', color: 'white', fontSize: '1rem', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Project End Date *</label>
                                <input type="date" value={sowData.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1a1a1a', color: 'white', fontSize: '1rem', outline: 'none' }} />
                            </div>
                        </div>
                        {sowData.startDate && sowData.endDate && (
                            <div style={{ padding: '16px', backgroundColor: 'rgba(79, 127, 242, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={20} color="var(--omnicom-blue)" />
                                <span style={{ color: 'white' }}>Project Duration: <strong>{getDuration()} days</strong></span>
                            </div>
                        )}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Key Milestones <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>(optional)</span></label>
                            <textarea placeholder="Week 1: Project Kickoff&#10;Week 3: Strategy Presentation" value={sowData.milestones} onChange={(e) => handleInputChange('milestones', e.target.value)} rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Total Project Budget *</label>
                            <input type="text" placeholder="e.g., $150,000" value={sowData.totalBudget} onChange={(e) => handleInputChange('totalBudget', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Payment Terms</label>
                            <select value={sowData.paymentTerms} onChange={(e) => handleInputChange('paymentTerms', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1a1a1a', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                <option value="50% upfront, 50% on completion">50% upfront, 50% on completion</option>
                                <option value="100% upfront">100% upfront</option>
                                <option value="100% on completion">100% on completion</option>
                                <option value="Monthly retainer">Monthly retainer</option>
                                <option value="Milestone-based payments">Milestone-based payments</option>
                                <option value="Net 30">Net 30</option>
                                <option value="Net 60">Net 60</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Team Size</label>
                                <input type="text" placeholder="e.g., 5-8" value={sowData.teamSize} onChange={(e) => handleInputChange('teamSize', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>Key Roles</label>
                                <input type="text" placeholder="PM, Creative Director, Designer" value={sowData.keyRoles} onChange={(e) => handleInputChange('keyRoles', e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        {!showPreview ? (
                            <>
                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--omnicom-blue), #3a6cd9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <Sparkles size={40} color="white" />
                                </motion.div>
                                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '12px' }}>Ready to Generate Your SOW</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                                    Our AI will create a professional, executive-ready Statement of Work.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto 32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <CheckCircle size={18} color="#22c55e" />
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Client: {sowData.clientName}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <CheckCircle size={18} color="#22c55e" />
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Project: {sowData.projectName}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <CheckCircle size={18} color="#22c55e" />
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Budget: {sowData.totalBudget}</span>
                                    </div>
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generateSOW} disabled={isGenerating} className="btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                                    {isGenerating ? (<><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>) : (<><Sparkles size={20} /> Generate Statement of Work</>)}
                                </motion.button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ color: 'white', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FileCheck size={24} color="#22c55e" />
                                        Statement of Work Generated
                                    </h3>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyToClipboard} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                            {copied ? 'Copied!' : 'Copy'}
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={printSOW} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                            <Printer size={16} /> Print / PDF
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowPreview(false)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                            <RefreshCw size={16} /> Regenerate
                                        </motion.button>
                                    </div>
                                </div>
                                {renderSOWDocument()}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '32px', width: '100%' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={28} color="var(--omnicom-blue)" />
                    SOW Generator
                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: 'rgba(79, 127, 242, 0.15)', color: 'var(--omnicom-blue)', marginLeft: '8px' }}>
                        <Sparkles size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        AI-Powered
                    </span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '0.95rem' }}>
                    Create professional Statements of Work in minutes with AI assistance
                </p>
            </div>

            <div className="glass-dark" style={{ padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep;
                        return (
                            <React.Fragment key={step.id}>
                                <motion.div whileHover={{ scale: 1.02 }} onClick={() => index <= currentStep && setCurrentStep(index)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: index <= currentStep ? 'pointer' : 'default', opacity: index <= currentStep ? 1 : 0.4 }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: isCompleted ? '#22c55e' : isCurrent ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', border: isCurrent ? '2px solid var(--omnicom-blue)' : 'none', boxShadow: isCurrent ? '0 0 20px rgba(79, 127, 242, 0.3)' : 'none' }}>
                                        {isCompleted ? <Check size={20} color="white" /> : <Icon size={20} color={isCurrent ? 'white' : 'rgba(255,255,255,0.5)'} />}
                                    </div>
                                    <span style={{ color: isCurrent ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>{step.title}</span>
                                </motion.div>
                                {index < steps.length - 1 && (<div style={{ flex: 1, height: '2px', backgroundColor: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.1)', margin: '0 16px', marginBottom: '28px' }} />)}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="glass-dark" style={{ padding: '32px', borderRadius: '20px', marginBottom: '24px', minHeight: '400px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ color: 'white', fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {React.createElement(steps[currentStep].icon, { size: 22, color: 'var(--omnicom-blue)' })}
                        {steps[currentStep].title}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '0.9rem' }}>{steps[currentStep].description}</p>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {currentStep < 5 || !showPreview ? (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} style={{ padding: '14px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: currentStep === 0 ? 'rgba(255,255,255,0.3)' : 'white', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ChevronLeft size={20} /> Previous
                    </motion.button>
                    {currentStep < 5 && (
                        <motion.button whileHover={{ scale: canProceed() ? 1.02 : 1 }} whileTap={{ scale: canProceed() ? 0.98 : 1 }} onClick={() => setCurrentStep(Math.min(5, currentStep + 1))} disabled={!canProceed()} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
                            Next Step <ChevronRight size={20} />
                        </motion.button>
                    )}
                </div>
            ) : null}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default SOWGenerator;
