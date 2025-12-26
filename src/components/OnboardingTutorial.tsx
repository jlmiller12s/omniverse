import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export interface TutorialStep {
    targetId: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTutorialProps {
    steps: TutorialStep[];
    onComplete: () => void;
    isVisible: boolean;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ steps, onComplete, isVisible }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const step = useMemo(() => steps[currentStep], [steps, currentStep]);

    useEffect(() => {
        if (!isVisible || !step) return;

        if (step.targetId === 'center') {
            setTargetRect(null);
            return;
        }

        const updateRect = () => {
            const el = document.getElementById(step.targetId);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect);

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
        };
    }, [step, isVisible]);

    if (!isVisible) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
            setCurrentStep(0);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
            {/* Dark Overlay with Hole */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(2px)',
                    clipPath: targetRect
                        ? `polygon(0% 0%, 0% 100%, ${targetRect.left - 8}px 100%, ${targetRect.left - 8}px ${targetRect.top - 8}px, ${targetRect.right + 8}px ${targetRect.top - 8}px, ${targetRect.right + 8}px ${targetRect.bottom + 8}px, ${targetRect.left - 8}px ${targetRect.bottom + 8}px, ${targetRect.left - 8}px 100%, 100% 100%, 100% 0%)`
                        : 'none',
                    pointerEvents: 'auto'
                }}
            />

            {/* Tooltip */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        left: targetRect ? calculatePos(targetRect, step.position).x : '50%',
                        top: targetRect ? calculatePos(targetRect, step.position).y : '50%',
                        translateX: targetRect ? 0 : '-50%',
                        translateY: targetRect ? 0 : '-50%'
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{
                        position: 'absolute',
                        width: '320px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid var(--omnicom-blue)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        pointerEvents: 'auto',
                        zIndex: 10001
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(79, 127, 242, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--omnicom-blue)' }}>
                            <Sparkles size={16} />
                        </div>
                        <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{step.title}</h4>
                        <button
                            onClick={onComplete}
                            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                        {step.content}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {steps.map((_, i) => (
                                <div key={i} style={{
                                    width: i === currentStep ? '16px' : '6px',
                                    height: '6px',
                                    borderRadius: '3px',
                                    backgroundColor: i === currentStep ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s'
                                }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {currentStep > 0 && (
                                <button
                                    onClick={handleBack}
                                    style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="btn-primary"
                                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Arrow for Tooltip */}
                    {targetRect && (
                        <div style={{
                            position: 'absolute',
                            ...calculateArrowPos(step.position),
                            width: 0,
                            height: 0,
                            border: '8px solid transparent',
                            borderColor: calculateArrowBorderColor(step.position)
                        }} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const calculatePos = (rect: DOMRect, position: TutorialStep['position']) => {
    const margin = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 200; // rough estimate

    switch (position) {
        case 'top':
            return { x: rect.left + (rect.width / 2) - (tooltipWidth / 2), y: rect.top - tooltipHeight - margin };
        case 'bottom':
            return { x: rect.left + (rect.width / 2) - (tooltipWidth / 2), y: rect.bottom + margin };
        case 'left':
            return { x: rect.left - tooltipWidth - margin, y: rect.top + (rect.height / 2) - (tooltipHeight / 2) };
        case 'right':
            return { x: rect.right + margin, y: rect.top + (rect.height / 2) - (tooltipHeight / 2) };
        default:
            return { x: window.innerWidth / 2 - tooltipWidth / 2, y: window.innerHeight / 2 - tooltipHeight / 2 };
    }
};

const calculateArrowPos = (position: TutorialStep['position']) => {
    switch (position) {
        case 'top': return { bottom: '-16px', left: '50%', transform: 'translateX(-50%)' };
        case 'bottom': return { top: '-16px', left: '50%', transform: 'translateX(-50%)' };
        case 'left': return { right: '-16px', top: '50%', transform: 'translateY(-50%)' };
        case 'right': return { left: '-16px', top: '50%', transform: 'translateY(-50%)' };
        default: return {};
    }
};

const calculateArrowBorderColor = (position: TutorialStep['position']) => {
    const color = 'var(--omnicom-blue)';
    switch (position) {
        case 'top': return `${color} transparent transparent transparent`;
        case 'bottom': return `transparent transparent ${color} transparent`;
        case 'left': return `transparent transparent transparent ${color}`;
        case 'right': return `transparent ${color} transparent transparent`;
        default: return 'transparent';
    }
}

export default OnboardingTutorial;
