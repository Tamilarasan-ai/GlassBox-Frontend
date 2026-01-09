import { useState, useCallback } from 'react';
import type { Trace, Step } from '../types';

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export function useReplayTrace(trace: Trace | null) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
    const [replayIntervalId, setReplayIntervalId] = useState<NodeJS.Timeout | null>(null);

    const totalSteps = trace?.steps.length || 0;

    const play = useCallback(() => {
        if (!trace || currentStepIndex >= totalSteps - 1) return;

        setIsPlaying(true);

        const intervalId = setInterval(() => {
            setCurrentStepIndex(prev => {
                if (prev >= totalSteps - 1) {
                    setIsPlaying(false);
                    clearInterval(intervalId);
                    return prev;
                }
                return prev + 1;
            });
        }, 1000 / playbackSpeed);

        setReplayIntervalId(intervalId);
    }, [trace, currentStepIndex, totalSteps, playbackSpeed]);

    const pause = useCallback(() => {
        setIsPlaying(false);
        if (replayIntervalId) {
            clearInterval(replayIntervalId);
            setReplayIntervalId(null);
        }
    }, [replayIntervalId]);

    const stop = useCallback(() => {
        pause();
        setCurrentStepIndex(0);
    }, [pause]);

    const stepForward = useCallback(() => {
        pause();
        setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
    }, [pause, totalSteps]);

    const stepBackward = useCallback(() => {
        pause();
        setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    }, [pause]);

    const jumpToStep = useCallback((index: number) => {
        pause();
        setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
    }, [pause, totalSteps]);

    const changeSpeed = useCallback((speed: PlaybackSpeed) => {
        setPlaybackSpeed(speed);
        if (isPlaying) {
            pause();
            setTimeout(() => play(), 0);
        }
    }, [isPlaying, pause, play]);

    const currentStep = trace?.steps[currentStepIndex] || null;

    return {
        currentStep,
        currentStepIndex,
        totalSteps,
        isPlaying,
        playbackSpeed,
        play,
        pause,
        stop,
        stepForward,
        stepBackward,
        jumpToStep,
        changeSpeed,
    };
}
