
import { useCallback, useRef, useEffect } from 'react';

export const useSoundEffects = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const musicSourceRef = useRef<GainNode | null>(null);
    const musicIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction (or component mount)
        // Browsers require a user gesture to start audio.
        const initializeAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            window.removeEventListener('click', initializeAudio);
            window.removeEventListener('keydown', initializeAudio);
        };
        window.addEventListener('click', initializeAudio);
        window.addEventListener('keydown', initializeAudio);

        return () => {
            window.removeEventListener('click', initializeAudio);
            window.removeEventListener('keydown', initializeAudio);
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);
    

    const playSound = useCallback((type: 'pop' | 'chime' | 'error' | 'musicNote', note?: number) => {
        if (!audioContextRef.current || audioContextRef.current.state === 'suspended') {
           audioContextRef.current?.resume();
        }
        if (!audioContextRef.current) return;
        
        const context = audioContextRef.current;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        switch (type) {
            case 'pop':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(150, context.currentTime);
                gainNode.gain.setValueAtTime(0.3, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
                break;
            case 'chime':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
                gainNode.gain.setValueAtTime(0.4, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
                break;
            case 'error':
                 oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(120, context.currentTime);
                gainNode.gain.setValueAtTime(0.2, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
                break;
            case 'musicNote':
                 oscillator.type = 'sine';
                 oscillator.frequency.setValueAtTime(note || 440, context.currentTime);
                 gainNode.gain.setValueAtTime(0.1, context.currentTime);
                 gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
                 break;
        }

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 1);
    }, []);
    
    const playMusic = useCallback(() => {
        if (musicIntervalRef.current) return;

        const melody = [261.63, 293.66, 329.63, 349.23]; // C4, D4, E4, F4
        let noteIndex = 0;
        
        musicIntervalRef.current = window.setInterval(() => {
            playSound('musicNote', melody[noteIndex]);
            noteIndex = (noteIndex + 1) % melody.length;
        }, 500);

    }, [playSound]);
    
    const stopMusic = useCallback(() => {
        if (musicIntervalRef.current) {
            clearInterval(musicIntervalRef.current);
            musicIntervalRef.current = null;
        }
    }, []);

    return {
        playPop: () => playSound('pop'),
        playChime: () => playSound('chime'),
        playError: () => playSound('error'),
        playMusic,
        stopMusic
    };
};
