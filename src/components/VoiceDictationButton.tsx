// Voice Dictation Button Component
import React from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeechState } from '../hooks/useSpeechRecognition';

interface VoiceDictationButtonProps {
    state: SpeechState;
    isSupported: boolean;
    onClick: () => void;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'inline' | 'floating';
    className?: string;
}

const sizeMap = {
    sm: { button: 32, icon: 14 },
    md: { button: 44, icon: 18 },
    lg: { button: 64, icon: 24 },
};

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
    state,
    isSupported,
    onClick,
    size = 'md',
    variant = 'default',
    className = '',
}) => {
    const { button: buttonSize, icon: iconSize } = sizeMap[size];
    const isListening = state === 'listening';
    const isProcessing = state === 'processing';
    const hasError = state === 'error';

    if (!isSupported) {
        return (
            <div
                title="Voice input not supported in this browser"
                style={{
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.2)',
                    cursor: 'not-allowed',
                }}
            >
                <MicOff size={iconSize} />
            </div>
        );
    }

    const getButtonStyles = (): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'visible',
        };

        if (variant === 'floating') {
            return {
                ...baseStyles,
                boxShadow: isListening
                    ? '0 8px 32px rgba(239, 68, 68, 0.4)'
                    : '0 4px 16px rgba(0,0,0,0.3)',
                backgroundColor: isListening ? '#ef4444' : 'white',
                color: isListening ? 'white' : 'black',
            };
        }

        if (variant === 'inline') {
            return {
                ...baseStyles,
                backgroundColor: isListening
                    ? 'rgba(239, 68, 68, 0.15)'
                    : hasError
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(255,255,255,0.05)',
                color: isListening
                    ? '#ef4444'
                    : hasError
                        ? '#ef4444'
                        : 'rgba(255,255,255,0.5)',
            };
        }

        // Default variant
        return {
            ...baseStyles,
            backgroundColor: isListening
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(79, 127, 242, 0.1)',
            color: isListening ? '#ef4444' : 'var(--omnicom-blue)',
            border: `1px solid ${isListening ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}`,
        };
    };

    return (
        <motion.button
            onClick={onClick}
            style={getButtonStyles()}
            className={className}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isListening ? 'Stop listening' : 'Start voice input'}
        >
            {/* Pulsing ring animation when listening */}
            <AnimatePresence>
                {isListening && (
                    <>
                        <motion.div
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '2px solid #ef4444',
                                pointerEvents: 'none',
                            }}
                        />
                        <motion.div
                            initial={{ scale: 1, opacity: 0.4 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '2px solid #ef4444',
                                pointerEvents: 'none',
                            }}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* Icon */}
            {isProcessing ? (
                <Loader2 size={iconSize} className="animate-spin" />
            ) : hasError ? (
                <AlertCircle size={iconSize} />
            ) : isListening ? (
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    <Mic size={iconSize} />
                </motion.div>
            ) : (
                <Mic size={iconSize} />
            )}
        </motion.button>
    );
};

// Voice dictation overlay/modal for full workflow dictation
interface VoiceDictationOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    transcript: string;
    interimTranscript: string;
    state: SpeechState;
    isSupported: boolean;
    error: string | null;
    onStart: () => void;
    onStop: () => void;
    onConfirm: (transcript: string) => void;
}

export const VoiceDictationOverlay: React.FC<VoiceDictationOverlayProps> = ({
    isOpen,
    onClose,
    transcript,
    interimTranscript,
    state,
    isSupported,
    error,
    onStart,
    onStop,
    onConfirm,
}) => {
    const isListening = state === 'listening';
    const fullTranscript = transcript + (interimTranscript ? ' ' + interimTranscript : '');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 200,
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '600px',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '24px',
                            border: '1px solid var(--border-subtle)',
                            padding: '40px',
                            zIndex: 201,
                            textAlign: 'center',
                        }}
                    >
                        <h2 style={{
                            fontSize: '1.5rem',
                            marginBottom: '16px',
                            color: 'white'
                        }}>
                            Voice Workflow Creation
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.5)',
                            marginBottom: '32px',
                            fontSize: '0.9rem'
                        }}>
                            Describe your workflow naturally. Include the type, title, client, goals, and any deadlines.
                        </p>

                        {/* Large microphone button */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '32px'
                        }}>
                            <VoiceDictationButton
                                state={state}
                                isSupported={isSupported}
                                onClick={isListening ? onStop : onStart}
                                size="lg"
                                variant="floating"
                            />
                        </div>

                        {/* Status text */}
                        <p style={{
                            color: isListening ? '#ef4444' : 'rgba(255,255,255,0.4)',
                            fontSize: '0.85rem',
                            marginBottom: '24px',
                            fontWeight: isListening ? 600 : 400
                        }}>
                            {isListening ? 'Listening... Speak now' : 'Click the microphone to start'}
                        </p>

                        {/* Error message */}
                        {error && (
                            <div style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                marginBottom: '24px',
                                color: '#ef4444',
                                fontSize: '0.85rem'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Transcript display */}
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            padding: '20px',
                            minHeight: '120px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            marginBottom: '24px',
                            textAlign: 'left',
                        }}>
                            {fullTranscript ? (
                                <p style={{
                                    color: 'white',
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontSize: '1rem'
                                }}>
                                    {transcript}
                                    {interimTranscript && (
                                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                                            {' '}{interimTranscript}
                                        </span>
                                    )}
                                </p>
                            ) : (
                                <p style={{
                                    color: 'rgba(255,255,255,0.3)',
                                    margin: 0,
                                    fontStyle: 'italic'
                                }}>
                                    Your speech will appear here...
                                </p>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm(transcript)}
                                disabled={!transcript.trim()}
                                className="btn-primary"
                                style={{
                                    opacity: transcript.trim() ? 1 : 0.5,
                                    cursor: transcript.trim() ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Use This Description
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default VoiceDictationButton;
