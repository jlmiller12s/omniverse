// Custom hook for Web Speech API speech recognition
import { useState, useEffect, useCallback, useRef } from 'react';

// TypeScript types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

export type SpeechState = 'idle' | 'listening' | 'processing' | 'error';

interface UseSpeechRecognitionOptions {
    language?: string;
    continuous?: boolean;
    silenceTimeout?: number; // Auto-stop after this many ms of silence
    onResult?: (transcript: string) => void;
    onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
    transcript: string;
    interimTranscript: string;
    state: SpeechState;
    isListening: boolean;
    isSupported: boolean;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export const useSpeechRecognition = (
    options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
    const {
        language = 'en-US',
        continuous = false,
        silenceTimeout = 5000,
        onResult,
        onError,
    } = options;

    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [state, setState] = useState<SpeechState>('idle');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Check browser support
    const isSupported = typeof window !== 'undefined' &&
        (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

    // Initialize recognition instance
    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionAPI();

        const recognition = recognitionRef.current;
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
            setState('listening');
            setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(prev => prev + finalTranscript);
                onResult?.(finalTranscript);
            }
            setInterimTranscript(interim);

            // Reset silence timeout
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
            if (!continuous) {
                silenceTimeoutRef.current = setTimeout(() => {
                    recognition.stop();
                }, silenceTimeout);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            const errorMessage = getErrorMessage(event.error);
            setError(errorMessage);
            setState('error');
            onError?.(errorMessage);
        };

        recognition.onend = () => {
            if (state === 'listening') {
                setState('idle');
            }
            setInterimTranscript('');
        };

        return () => {
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
            recognition.abort();
        };
    }, [isSupported, language, continuous, silenceTimeout, onResult, onError]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current || !isSupported) return;

        setTranscript('');
        setInterimTranscript('');
        setError(null);
        setState('listening');

        try {
            recognitionRef.current.start();
        } catch (err) {
            // Recognition may already be running
            console.warn('Speech recognition start error:', err);
        }
    }, [isSupported]);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current) return;

        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }

        recognitionRef.current.stop();
        setState('processing');

        // Brief processing state then idle
        setTimeout(() => {
            setState('idle');
        }, 300);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
    }, []);

    return {
        transcript,
        interimTranscript,
        state,
        isListening: state === 'listening',
        isSupported,
        error,
        startListening,
        stopListening,
        resetTranscript,
    };
};

// Helper function to get user-friendly error messages
function getErrorMessage(error: string): string {
    switch (error) {
        case 'no-speech':
            return 'No speech was detected. Please try again.';
        case 'audio-capture':
            return 'No microphone was found. Please ensure a microphone is connected.';
        case 'not-allowed':
            return 'Microphone access was denied. Please allow microphone access in your browser settings.';
        case 'network':
            return 'Network error occurred. Please check your internet connection.';
        case 'aborted':
            return 'Speech recognition was aborted.';
        case 'service-not-allowed':
            return 'Speech recognition service is not available.';
        default:
            return `Speech recognition error: ${error}`;
    }
}

export default useSpeechRecognition;
