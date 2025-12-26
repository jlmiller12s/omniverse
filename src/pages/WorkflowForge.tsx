import React, { useState } from 'react';
import {
    Sparkles,
    FileText,
    Target,
    Users,
    DollarSign,
    Calendar,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Shield,
    Zap,
    Bell,
    Briefcase,
    Globe,
    Scale,
    Layers,
    Layout,
    Plus,
    Clock,
    Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { VoiceDictationButton, VoiceDictationOverlay } from '../components/VoiceDictationButton';

gsap.registerPlugin(useGSAP);

export type WorkflowType =
    | 'Creative'
    | 'IT'
    | 'HR'
    | 'Sales'
    | 'Compliance'
    | 'Automation'
    | 'Project'
    | 'Orchestration';

interface WorkflowForgeProps {
    onSaveBrief: (workflow: { campaignName: string, client: string, content: string, type: WorkflowType }) => void;
    onBack: () => void;
}

const templates: { type: WorkflowType, title: string, description: string, icon: React.ReactNode }[] = [
    { type: 'Creative', title: 'Creative & Content', description: 'Ads, social posts, videos, and design review cycles.', icon: <FileText size={24} /> },
    { type: 'IT', title: 'IT & Service', description: 'Incidents, service requests, and triage workflows.', icon: <Bell size={24} /> },
    { type: 'HR', title: 'HR & People Ops', description: 'Onboarding, performance reviews, and policy acknowledgments.', icon: <Users size={24} /> },
    { type: 'Project', title: 'Project Management', description: 'Task coordination, status tracking, and blocker monitoring.', icon: <Briefcase size={24} /> },
    { type: 'Automation', title: 'Process Automation', description: 'Purchase approvals, expense reports, and handoff rules.', icon: <Zap size={24} /> },
    { type: 'Sales', title: 'Sales Lifecycle', description: 'Lead intake, qualification, and renewal stages.', icon: <Layout size={24} /> },
    { type: 'Compliance', title: 'Compliance & Audit', description: 'Risk assessments, security reviews, and audit trails.', icon: <Shield size={24} /> },
    { type: 'Orchestration', title: 'System Orchestration', description: 'Connecting DAM, CRM, and Project tools in one flow.', icon: <Globe size={24} /> },
];

const WorkflowForge: React.FC<WorkflowForgeProps> = ({ onSaveBrief, onBack }) => {
    const [step, setStep] = useState(0); // 0 is Template Selection
    const [selectedType, setSelectedType] = useState<WorkflowType | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        detail1: '', // Dynamic field 1
        detail2: '', // Dynamic field 2
        priority: 'Medium',
        deadline: '',
    });

    const [loadingState, setLoadingState] = useState<'idle' | 'generating' | 'success'>('idle');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState('');

    // Voice dictation state
    const [isDictationOpen, setIsDictationOpen] = useState(false);
    const {
        transcript,
        interimTranscript,
        state: speechState,
        isSupported: isSpeechSupported,
        error: speechError,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition({
        language: 'en-US',
        continuous: true,
        silenceTimeout: 3000,
    });

    // Parse voice input to extract workflow details
    const parseVoiceInput = (text: string) => {
        const lowerText = text.toLowerCase();

        // Detect workflow type
        let detectedType: WorkflowType = 'Creative';
        if (lowerText.includes('it') || lowerText.includes('incident') || lowerText.includes('service')) {
            detectedType = 'IT';
        } else if (lowerText.includes('hr') || lowerText.includes('onboarding') || lowerText.includes('employee')) {
            detectedType = 'HR';
        } else if (lowerText.includes('compliance') || lowerText.includes('audit')) {
            detectedType = 'Compliance';
        } else if (lowerText.includes('sales') || lowerText.includes('lead')) {
            detectedType = 'Sales';
        } else if (lowerText.includes('automation') || lowerText.includes('approval')) {
            detectedType = 'Automation';
        } else if (lowerText.includes('project') || lowerText.includes('task')) {
            detectedType = 'Project';
        } else if (lowerText.includes('integration') || lowerText.includes('orchestration')) {
            detectedType = 'Orchestration';
        }

        // Extract title (use first meaningful phrase or the whole text if short)
        let title = text.length > 50 ? text.substring(0, 50) + '...' : text;

        // Look for patterns like "called X" or "named X" or "for X"
        const forMatch = text.match(/(?:for|called|named|titled)\s+([^,\.]+)/i);
        if (forMatch) {
            title = forMatch[1].trim();
        }

        // Extract client name
        let client = '';
        const clientMatch = text.match(/(?:client|for|company|team)\s+(?:is\s+)?([A-Z][A-Za-z\s]+?)(?:\s+with|\s+and|\s+requiring|,|\.)/);
        if (clientMatch) {
            client = clientMatch[1].trim();
        }

        // Extract budget if mentioned
        let detail2 = '';
        const budgetMatch = text.match(/\$[\d,]+k?|\d+(?:,\d{3})*\s*(?:dollars|k|thousand|million)/i);
        if (budgetMatch) {
            detail2 = budgetMatch[0];
        }

        // Extract deadline if mentioned
        let deadline = '';
        const dateMatch = text.match(/(?:by|deadline|due|before)\s+(\w+\s+\d+(?:st|nd|rd|th)?(?:,?\s*\d{4})?)/i);
        if (dateMatch) {
            // Try to parse the date
            const parsedDate = new Date(dateMatch[1]);
            if (!isNaN(parsedDate.getTime())) {
                deadline = parsedDate.toISOString().split('T')[0];
            }
        }

        // Extract priority
        let priority = 'Medium';
        if (lowerText.includes('urgent') || lowerText.includes('critical') || lowerText.includes('high priority')) {
            priority = 'Critical';
        } else if (lowerText.includes('high')) {
            priority = 'High';
        } else if (lowerText.includes('low priority') || lowerText.includes('not urgent')) {
            priority = 'Low';
        }

        return {
            type: detectedType,
            title: title.charAt(0).toUpperCase() + title.slice(1),
            client,
            detail1: text, // Store full description as primary goal
            detail2,
            priority,
            deadline,
        };
    };

    const handleDictationConfirm = (text: string) => {
        const parsed = parseVoiceInput(text);
        setSelectedType(parsed.type);
        setFormData({
            title: parsed.title,
            client: parsed.client,
            detail1: parsed.detail1,
            detail2: parsed.detail2,
            priority: parsed.priority,
            deadline: parsed.deadline,
        });
        setIsDictationOpen(false);
        resetTranscript();
        setStep(1); // Go to identification step
    };

    const loadingSteps = [
        { progress: 20, status: 'Analyzing workflow parameters...' },
        { progress: 45, status: 'Mapping stakeholder dependencies...' },
        { progress: 70, status: 'Designing escalation paths...' },
        { progress: 90, status: 'Finalizing process documentation...' },
    ];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBackStep = () => setStep(prev => prev - 1);

    const generateWorkflow = () => {
        setLoadingState('generating');

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < loadingSteps.length) {
                setLoadingProgress(loadingSteps[currentStep].progress);
                setLoadingStatus(loadingSteps[currentStep].status);
                currentStep++;
            } else {
                clearInterval(interval);
                setLoadingProgress(100);
                setLoadingStatus('Workflow generated successfully!');

                setTimeout(() => {
                    const content = generatePlanContent(selectedType!, formData);
                    onSaveBrief({
                        campaignName: formData.title,
                        client: formData.client || 'Internal',
                        content: content,
                        type: selectedType!
                    });
                    setLoadingState('success');
                }, 1000);
            }
        }, 800);
    };

    const getDynamicLabels = (type: WorkflowType) => {
        switch (type) {
            case 'IT': return { d1: 'Impacted Systems', d2: 'Severity Level', i1: <Globe size={18} />, i2: <Shield size={18} /> };
            case 'HR': return { d1: 'Employee Dept', d2: 'Reporting Manager', i1: <Users size={18} />, i2: <Target size={18} /> };
            case 'Compliance': return { d1: 'Regulation Type', d2: 'Audit Interval', i1: <Scale size={18} />, i2: <Clock size={18} /> };
            case 'Orchestration': return { d1: 'Source Tool', d2: 'Destination Tool', i1: <Layers size={18} />, i2: <ArrowRight size={18} /> };
            case 'Sales': return { d1: 'Lead Source', d2: 'Initial Stage', i1: <Target size={18} />, i2: <Layout size={18} /> };
            case 'Automation': return { d1: 'Approval Rule', d2: 'Escalation Limit', i1: <Zap size={18} />, i2: <Shield size={18} /> };
            default: return { d1: 'Primary Goal', d2: 'Estimated Budget', i1: <Target size={18} />, i2: <DollarSign size={18} /> };
        }
    };

    // Animation removed to prevent layout shift on load

    return (
        <div style={{ width: '100%', margin: 0 }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'white' }}>
                    Workflow <span className="serif" style={{ color: 'var(--omnicom-coral)' }}>Forge</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Automating complex processes for <span className="serif" style={{ color: 'var(--omnicom-blue)' }}>Omniverse</span> Teams.</p>
            </header>

            <div className="glass-dark" style={{ padding: '40px', borderRadius: '24px', position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column', background: 'rgba(5, 5, 5, 0.8)' }}>
                <AnimatePresence mode="wait">
                    {loadingState === 'idle' && (
                        <motion.div
                            key="forge-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                        >
                            {step > 0 && (
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                                    {[1, 2, 3].map(s => (
                                        <div key={s} style={{
                                            flex: 1,
                                            height: '4px',
                                            borderRadius: '2px',
                                            backgroundColor: s <= step ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.05)',
                                            transition: 'background-color 0.3s'
                                        }}></div>
                                    ))}
                                </div>
                            )}

                            <div style={{ flex: 1 }}>
                                {step === 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h3 style={{ marginBottom: '24px', color: 'white', textAlign: 'center' }}>Select Workflow Template</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', padding: '8px' }}>
                                            {templates.map(t => (
                                                <button
                                                    key={t.type}
                                                    onClick={() => { setSelectedType(t.type); setStep(1); }}
                                                    style={{
                                                        padding: '32px',
                                                        borderRadius: '20px',
                                                        backgroundColor: selectedType === t.type ? 'rgba(79, 127, 242, 0.2)' : '#111111',
                                                        border: `1px solid ${selectedType === t.type ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.15)'}`,
                                                        color: '#ffffff',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                                        // Explicit resets to override browser button defaults
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none',
                                                        outline: 'none',
                                                        fontFamily: 'inherit',
                                                        fontSize: 'inherit'
                                                    }}
                                                    className="template-card"
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--omnicom-blue)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = selectedType === t.type ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.15)'}
                                                >
                                                    <div style={{ color: 'var(--omnicom-blue)', marginBottom: '16px' }}>{t.icon}</div>
                                                    <div style={{ fontWeight: 600, marginBottom: '8px', color: 'white' }}>{t.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{t.description}</div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Voice Dictation Option */}
                                        <div style={{
                                            marginTop: '32px',
                                            padding: '24px',
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, rgba(79, 127, 242, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                                            border: '1px solid rgba(79, 127, 242, 0.2)',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{
                                                color: 'rgba(255,255,255,0.6)',
                                                marginBottom: '16px',
                                                fontSize: '0.9rem'
                                            }}>
                                                Or describe your workflow using voice
                                            </p>
                                            <motion.button
                                                onClick={() => {
                                                    resetTranscript();
                                                    setIsDictationOpen(true);
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '16px 32px',
                                                    borderRadius: '12px',
                                                    backgroundColor: isSpeechSupported ? 'var(--omnicom-coral)' : 'rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    border: 'none',
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    cursor: isSpeechSupported ? 'pointer' : 'not-allowed',
                                                    opacity: isSpeechSupported ? 1 : 0.5,
                                                    boxShadow: isSpeechSupported ? '0 8px 24px rgba(234, 88, 77, 0.3)' : 'none'
                                                }}
                                                disabled={!isSpeechSupported}
                                            >
                                                <Mic size={20} />
                                                {isSpeechSupported ? 'Dictate Workflow' : 'Voice Not Supported'}
                                            </motion.button>
                                            {!isSpeechSupported && (
                                                <p style={{
                                                    color: 'rgba(255,255,255,0.4)',
                                                    fontSize: '0.75rem',
                                                    marginTop: '8px'
                                                }}>
                                                    Try Chrome or Edge for voice input
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h3 style={{ marginBottom: '24px', color: 'white' }}>Identification</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <InputGroup label="Workflow Title" icon={<Plus size={18} />} value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="e.g., Q1 Social Ads Review" />
                                            <InputGroup label="Stakeholder / Client" icon={<Users size={18} />} value={formData.client} onChange={(v) => setFormData({ ...formData, client: v })} placeholder="e.g., Marketing Team" />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && selectedType && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h3 style={{ marginBottom: '24px', color: 'white' }}>Process Specifics</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <InputGroup
                                                label={getDynamicLabels(selectedType).d1}
                                                icon={getDynamicLabels(selectedType).i1}
                                                value={formData.detail1}
                                                onChange={(v) => setFormData({ ...formData, detail1: v })}
                                            />
                                            <InputGroup
                                                label={getDynamicLabels(selectedType).d2}
                                                icon={getDynamicLabels(selectedType).i2}
                                                value={formData.detail2}
                                                onChange={(v) => setFormData({ ...formData, detail2: v })}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h3 style={{ marginBottom: '24px', color: 'white' }}>Execution Details</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <InputGroup label="Target Deadline" icon={<Calendar size={18} />} type="date" value={formData.deadline} onChange={(v) => setFormData({ ...formData, deadline: v })} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Priority Level</label>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                                        <button
                                                            key={p}
                                                            onClick={() => setFormData({ ...formData, priority: p })}
                                                            style={{
                                                                flex: 1,
                                                                padding: '12px',
                                                                borderRadius: '12px',
                                                                border: '1px solid var(--border-subtle)',
                                                                backgroundColor: formData.priority === p ? 'var(--omnicom-coral)' : 'rgba(255,255,255,0.02)',
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >{p}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                                {step > 0 && <button onClick={handleBackStep} style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'white', borderRadius: '12px', cursor: 'pointer' }}>Back</button>}
                                {step === 0 && <button onClick={onBack} style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'white', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>}
                                <div style={{ marginLeft: 'auto' }}>
                                    {step > 0 && step < 3 && <button className="btn-primary" onClick={handleNext}>Continue</button>}
                                    {step === 3 && (
                                        <button className="btn-primary" onClick={generateWorkflow} disabled={!formData.title}>
                                            Generate Workflow Flow
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {loadingState === 'generating' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                        >
                            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--omnicom-blue)', marginBottom: '24px' }} />
                            <h3 style={{ marginBottom: '16px', color: 'white' }}>Forging Workflow...</h3>
                            <div style={{ width: '100%', maxWidth: '400px', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${loadingProgress}%` }}
                                    style={{ height: '100%', backgroundColor: 'var(--omnicom-blue)' }}
                                />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{loadingStatus}</p>
                        </motion.div>
                    )}

                    {loadingState === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#10b981',
                                marginBottom: '24px'
                            }}>
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', color: 'white' }}>Workflow Active!</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', maxWidth: '400px' }}>
                                The <strong>{formData.title}</strong> process has been orchestrated and logged in the registry.
                            </p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn-primary" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    Back to Dashboard <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={() => { setLoadingState('idle'); setStep(0); setSelectedType(null); }}
                                    style={{ padding: '12px 24px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                >
                                    New Workflow
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Voice Dictation Overlay */}
            <VoiceDictationOverlay
                isOpen={isDictationOpen}
                onClose={() => {
                    setIsDictationOpen(false);
                    stopListening();
                    resetTranscript();
                }}
                transcript={transcript}
                interimTranscript={interimTranscript}
                state={speechState}
                isSupported={isSpeechSupported}
                error={speechError}
                onStart={startListening}
                onStop={stopListening}
                onConfirm={handleDictationConfirm}
            />
        </div>
    );
};

const InputGroup: React.FC<{ label: string, icon: React.ReactNode, value: string, onChange: (v: string) => void, type?: string, placeholder?: string }> = ({ label, icon, value, onChange, type = "text", placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{label}</label>
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>
                {icon}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-primary)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--omnicom-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
        </div>
    </div>
);

const generatePlanContent = (type: WorkflowType, data: any) => {
    switch (type) {
        case 'IT':
            return `# IT Service Plan: ${data.title}
**System Impact:** ${data.detail1}
**Priority:** ${data.priority}
**Executive Summary:** Rapid response and resolution plan for critical system infrastructure.

---

## 1. Triage \u0026 Incident Mapping
*   **Initial Discovery:** Automated detection synced with ${data.detail1}.
*   **Severity Assessment:** Logged as ${data.detail2}.
*   **Ownership:** Assigned to tier-3 infrastructure team.

## 2. Resolution Path
To ensure uptime and compliance, we will execute the following:
*   **Step 1:** Isolate affected nodes in ${data.detail1}.
*   **Step 2:** Deploy temporary patch via automation scripts.
*   **Step 3:** Full root-cause analysis with stakeholder review.

## 3. SLA \u0026 Metrics
*   **MTTR Target:** 120 minutes.
*   **Communication:** Internal status page updated every 30 minutes.

---
*Forged by Omniverse AI Assistant*`;

        case 'HR':
            return `# HR Operations: ${data.title}
**Department:** ${data.detail1}
**Lead Manager:** ${data.detail2}
**Executive Summary:** Seamless orchestration of people-first processes ensuring compliance and connection.

---

## 1. Onboarding Checklist
*   **Infrastructure:** Provision accounts in CRM and DAM.
*   **Culture:** Schedule welcome session with ${data.detail2}.
*   **Policy:** Electronic acknowledgment of 2025 guidelines.

## 2. Workflow Sequence
*   **Handoff A:** Legal clearance and background check completion.
*   **Handoff B:** Equipment dispatch and logistics tracking.
*   **Handoff C:** Departmental immersion within ${data.detail1}.

---
*Forged by Omniverse AI Assistant*`;

        case 'Compliance':
            return `# Compliance Audit Trail: ${data.title}
**Regulation Type:** ${data.detail1}
**Audit Interval:** ${data.detail2}
**Executive Summary:** Rigorous documentation and policy enforcement for regulated workflows.

---

## 1. Risk Assessment
*   **Impact Score:** ${data.priority === 'Critical' ? 'High' : 'Moderate'}.
*   **Regulatory Map:** Directly tied to ${data.detail1} requirements.
*   **Review Board:** Quarterly board review scheduled for ${data.deadline}.

## 2. Security Protocols
*   **Access Control:** Multi-factor authentication required for all decision markers.
*   **Audit Logging:** Every stage change is recorded in the immutable registry.

---
*Forged by Omniverse AI Assistant*`;

        case 'Orchestration':
            return `# Cross-System Orchestration: ${data.title}
**Source Tool:** ${data.detail1}
**Destination Tool:** ${data.detail2}
**Executive Summary:** Automated bridge connecting disparate tools into one unified organizational flow.

---

## 1. Integration Topology
*   **Trigger:** Event detected in ${data.detail1}.
*   **Logic Engine:** AI classifies request and prepares metadata.
*   **Action:** Records created in ${data.detail2} with high priority status.

## 2. Synchronization Rules
*   **Two-Way Sync:** Active status updates every 5 minutes.
*   **Dead-Letter Handling:** Automated alerts if the API connection fails.

---
*Forged by Omniverse AI Assistant*`;

        default:
            return `# Creative Flow: ${data.title}
**Client:** ${data.client}
**Primary Goal:** ${data.detail1}
**Executive Summary:** Multi-stage creative review and approval lifecycle for high-impact media.

---

## 1. Review Tiers
*   **Tier 1 (Internal):** Peer review of all copy and design assets.
*   **Tier 2 (Stakeholder):** Strategic alignment check against ${data.detail1}.
*   **Tier 3 (Final):** Legal and brand compliance sign-offs.

## 2. Media Strategy
*   **Budget Focused:** ${data.detail2} total allocation.
*   **Deadline:** Launch scheduled for ${data.deadline}.

---
*Forged by Omniverse AI Assistant*`;
    }
}

export default WorkflowForge;
