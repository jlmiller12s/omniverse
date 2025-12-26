// Voice Flow Agent - Full-screen voice assistant modal
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    X,
    Loader2,
    CheckCircle,
    AlertCircle,
    FileText,
    CheckSquare,
    Folder,
    FileSignature,
    RefreshCw,
    Navigation,
    HelpCircle,
    ArrowRight,
    Sparkles,
    Keyboard,
    Send
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { parseVoiceCommand, getIntentDescription, getCommandExamples, VoiceIntent } from '../utils/voiceCommandParser';

interface VoiceFlowAgentProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (destination: string) => void;
    onCreateBrief: (data: { title: string; client: string; description: string }) => void;
    onCreateTask: (data: { title: string; assignee?: string; priority?: string; project?: string }) => void;
    onCreateProject: (data: { name: string; client?: string; description?: string; priority?: string; dueDate?: string }) => void;
    onGenerateSOW: (data: { projectName: string }) => void;
    onUpdateStatus: (data: { projectName: string; newStatus: string }) => void;
}

export const VoiceFlowAgent: React.FC<VoiceFlowAgentProps> = ({
    isOpen,
    onClose,
    onNavigate,

    onCreateBrief,
    onCreateTask,
    onCreateProject,
    onGenerateSOW,
    onUpdateStatus,
}) => {
    const [currentIntent, setCurrentIntent] = useState<VoiceIntent | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionResult, setExecutionResult] = useState<'success' | 'error' | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [textInput, setTextInput] = useState('');

    const {
        transcript,
        interimTranscript,
        state: speechState,
        isSupported,
        error: speechError,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition({
        language: 'en-US',
        continuous: true,
        silenceTimeout: 2500,
    });

    const isListening = speechState === 'listening';
    const fullTranscript = transcript + (interimTranscript ? ' ' + interimTranscript : '');

    // Parse command when transcript updates
    useEffect(() => {
        if (transcript && !isListening) {
            const intent = parseVoiceCommand(transcript);
            setCurrentIntent(intent);
        }
    }, [transcript, isListening]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            resetTranscript();
            setCurrentIntent(null);
            setExecutionResult(null);
            setIsExecuting(false);
            setIsExecuting(false);
            setShowHelp(false);
            setTextInput('');
        }
    }, [isOpen, resetTranscript]);

    const handleClose = useCallback(() => {
        stopListening();
        resetTranscript();
        setCurrentIntent(null);
        onClose();
    }, [stopListening, resetTranscript, onClose]);

    const handleExecute = useCallback(async () => {
        if (!currentIntent || currentIntent.type === 'UNKNOWN') return;

        setIsExecuting(true);
        setExecutionResult(null);

        try {
            // Small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 500));

            switch (currentIntent.type) {
                case 'NAVIGATE':
                    onNavigate(currentIntent.data.destination);
                    handleClose();
                    break;
                case 'CREATE_BRIEF':
                    onCreateBrief(currentIntent.data);
                    break;
                case 'CREATE_TASK':
                    onCreateTask(currentIntent.data);
                    break;
                case 'CREATE_PROJECT':
                    onCreateProject(currentIntent.data);
                    break;
                case 'GENERATE_SOW':
                    onGenerateSOW(currentIntent.data);
                    break;
                case 'UPDATE_STATUS':
                    onUpdateStatus(currentIntent.data);
                    break;
                case 'HELP':
                    setShowHelp(true);
                    setIsExecuting(false);
                    return;
            }

            setExecutionResult('success');

            // Auto-close after success (except navigation which closes immediately)
            if (currentIntent.type !== 'NAVIGATE') {
                setTimeout(() => {
                    handleClose();
                }, 1500);
            }
        } catch (err) {
            setExecutionResult('error');
        }

        setIsExecuting(false);
    }, [currentIntent, onNavigate, onCreateBrief, onCreateTask, onCreateProject, onGenerateSOW, onUpdateStatus, handleClose]);

    const handleTryAgain = useCallback(() => {
        resetTranscript();
        setCurrentIntent(null);
        setExecutionResult(null);
        setShowHelp(false);
        setTextInput('');
    }, [resetTranscript]);

    const handleTextSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        if (!textInput.trim()) return;

        const intent = parseVoiceCommand(textInput);
        setCurrentIntent(intent);
        // Don't clear text input yet so they can see what they typed? 
        // Actually, better to treat it like a transcript.
        // We set the transcript virtually or just rely on intent.
        // The UI shows transcript if available. Let's rely on currentIntent display.
        // We can clear the input for cleanliness.
        setTextInput('');
    }, [textInput]);

    const getIntentIcon = (type: string) => {
        switch (type) {
            case 'CREATE_BRIEF': return <FileText size={20} />;
            case 'CREATE_TASK': return <CheckSquare size={20} />;
            case 'CREATE_PROJECT': return <Folder size={20} />;
            case 'GENERATE_SOW': return <FileSignature size={20} />;
            case 'UPDATE_STATUS':
            case 'UPDATE_STAGE': return <RefreshCw size={20} />;
            case 'NAVIGATE': return <Navigation size={20} />;
            case 'HELP': return <HelpCircle size={20} />;
            default: return <AlertCircle size={20} />;
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 300,
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 301,
                            padding: '40px',
                            pointerEvents: 'none',
                        }}
                    >
                        {/* Close button */}
                        <motion.button
                            onClick={handleClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                position: 'absolute',
                                top: '40px',
                                right: '40px',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                            }}
                        >
                            <X size={24} />
                        </motion.button>

                        {/* Main content */}
                        <div style={{
                            pointerEvents: 'auto',
                            textAlign: 'center',
                            maxWidth: '600px',
                            width: '100%'
                        }}>
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    marginBottom: '8px'
                                }}>
                                    <Sparkles size={24} style={{ color: 'var(--omnicom-coral)' }} />
                                    <h1 style={{
                                        fontSize: '2rem',
                                        fontWeight: 600,
                                        color: 'white',
                                        margin: 0
                                    }}>
                                        Voice Flow
                                    </h1>
                                </div>
                                <p style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    marginBottom: '40px',
                                    fontSize: '0.95rem'
                                }}>
                                    Speak naturally to control Omniverse
                                </p>
                            </motion.div>

                            {/* Help Panel */}
                            {showHelp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        marginBottom: '32px',
                                        textAlign: 'left',
                                    }}
                                >
                                    <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>
                                        Available Commands
                                    </h3>
                                    <ul style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        {getCommandExamples().map((example, i) => (
                                            <li key={i} style={{
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.85rem',
                                                padding: '8px 12px',
                                                backgroundColor: 'rgba(255,255,255,0.03)',
                                                borderRadius: '8px'
                                            }}>
                                                {example}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={handleTryAgain}
                                        style={{
                                            marginTop: '16px',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: 'var(--omnicom-blue)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Try a Command
                                    </button>
                                </motion.div>
                            )}

                            {/* Microphone and Text Input Container */}
                            {!showHelp && !currentIntent && !executionResult && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    style={{
                                        marginBottom: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        width: '100%',
                                        maxWidth: '500px',
                                        margin: '0 auto 32px'
                                    }}
                                >
                                    {/* Text Input */}
                                    <form
                                        onSubmit={handleTextSubmit}
                                        style={{
                                            flex: 1,
                                            position: 'relative',
                                            opacity: isListening ? 0.5 : 1,
                                            pointerEvents: isListening ? 'none' : 'auto',
                                            transition: 'opacity 0.2s'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            placeholder="Type a command..."
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '16px',
                                                padding: '16px 48px 16px 20px',
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                outline: 'none',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--omnicom-blue)'}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!textInput.trim()}
                                            style={{
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                padding: '8px',
                                                color: textInput.trim() ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.2)',
                                                cursor: textInput.trim() ? 'pointer' : 'default',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Send size={20} />
                                        </button>
                                    </form>

                                    {/* Mic Button */}
                                    <motion.button
                                        onClick={isListening ? stopListening : startListening}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!isSupported}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            backgroundColor: isListening ? '#ef4444' : 'white',
                                            color: isListening ? 'white' : 'black',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: isSupported ? 'pointer' : 'not-allowed',
                                            boxShadow: isListening
                                                ? '0 0 30px rgba(239, 68, 68, 0.5)'
                                                : '0 4px 20px rgba(255,255,255,0.1)',
                                            position: 'relative',
                                            flexShrink: 0
                                        }}
                                    >
                                        {/* Pulsing rings when listening */}
                                        {isListening && (
                                            <>
                                                <motion.div
                                                    initial={{ scale: 1, opacity: 0.5 }}
                                                    animate={{ scale: 1.5, opacity: 0 }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                                                    style={{
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '50%',
                                                        border: '2px solid #ef4444',
                                                    }}
                                                />
                                            </>
                                        )}

                                        {isListening ? (
                                            <Mic size={28} />
                                        ) : isSupported ? (
                                            <Mic size={28} />
                                        ) : (
                                            <MicOff size={28} />
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Status Text */}
                            {!showHelp && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        color: isListening ? '#ef4444' : 'rgba(255,255,255,0.4)',
                                        fontSize: '0.9rem',
                                        marginBottom: '24px',
                                        fontWeight: isListening ? 600 : 400,
                                    }}
                                >
                                    {!isSupported
                                        ? 'Voice not supported in this browser'
                                        : isListening
                                            ? 'Listening... Speak your command'
                                            : currentIntent
                                                ? 'Command recognized!'
                                                : 'Click the microphone to start'}
                                </motion.p>
                            )}

                            {/* Error message */}
                            {speechError && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '12px',
                                        padding: '12px 16px',
                                        marginBottom: '24px',
                                        color: '#ef4444',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {speechError}
                                </motion.div>
                            )}

                            {/* Transcript Display */}
                            {!showHelp && fullTranscript && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        marginBottom: '24px',
                                        minHeight: '60px',
                                    }}
                                >
                                    <p style={{
                                        color: 'white',
                                        margin: 0,
                                        fontSize: '1.1rem',
                                        lineHeight: 1.5,
                                    }}>
                                        "{transcript}
                                        {interimTranscript && (
                                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                {interimTranscript}
                                            </span>
                                        )}"
                                    </p>
                                </motion.div>
                            )}

                            {/* Intent Preview */}
                            {!showHelp && currentIntent && !isListening && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        backgroundColor: currentIntent.type === 'UNKNOWN'
                                            ? 'rgba(239, 68, 68, 0.1)'
                                            : 'rgba(79, 127, 242, 0.1)',
                                        border: `1px solid ${currentIntent.type === 'UNKNOWN'
                                            ? 'rgba(239, 68, 68, 0.3)'
                                            : 'rgba(79, 127, 242, 0.3)'}`,
                                        borderRadius: '16px',
                                        padding: '20px',
                                        marginBottom: '24px',
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: currentIntent.type === 'UNKNOWN' ? '#ef4444' : 'var(--omnicom-blue)'
                                    }}>
                                        {getIntentIcon(currentIntent.type)}
                                        <span style={{ fontWeight: 600 }}>
                                            {getIntentDescription(currentIntent)}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Execution Result */}
                            {executionResult && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        color: executionResult === 'success' ? '#10b981' : '#ef4444',
                                        marginBottom: '24px',
                                    }}
                                >
                                    {executionResult === 'success' ? (
                                        <>
                                            <CheckCircle size={24} />
                                            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Done!</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={24} />
                                            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Something went wrong</span>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            {!showHelp && currentIntent && !isListening && !executionResult && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
                                >
                                    <button
                                        onClick={handleTryAgain}
                                        style={{
                                            padding: '14px 28px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backgroundColor: 'transparent',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        Try Again
                                    </button>
                                    {currentIntent.type !== 'UNKNOWN' && (
                                        <button
                                            onClick={handleExecute}
                                            disabled={isExecuting}
                                            className="btn-primary"
                                            style={{
                                                padding: '14px 28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {isExecuting ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Executing...
                                                </>
                                            ) : (
                                                <>
                                                    Execute <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* Help hint */}
                            {!showHelp && !currentIntent && !isListening && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => setShowHelp(true)}
                                    style={{
                                        color: 'rgba(255,255,255,0.4)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        margin: '0 auto',
                                    }}
                                >
                                    <HelpCircle size={14} />
                                    What can I say?
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default VoiceFlowAgent;
