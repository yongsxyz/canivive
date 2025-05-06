import React, { useEffect, useRef, useState } from "react";
import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
} from "framer-motion";

const MAX_OVERFLOW = 50;

interface ElasticSliderProps {
    defaultValue?: number;
    startingValue?: number;
    maxValue?: number;
    className?: string;
    isStepped?: boolean;
    stepSize?: number;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const ElasticSlider: React.FC<ElasticSliderProps> = ({
    defaultValue = 50,
    startingValue = 0,
    maxValue = 100,
    className = "",
    isStepped = false,
    stepSize = 1,
    leftIcon = <>-</>,
    rightIcon = <>+</>,
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 w-48 ${className}`}
        >
            <Slider
                defaultValue={defaultValue}
                startingValue={startingValue}
                maxValue={maxValue}
                isStepped={isStepped}
                stepSize={stepSize}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
            />
        </div>
    );
};

interface SliderProps {
    defaultValue: number;
    startingValue: number;
    maxValue: number;
    isStepped: boolean;
    stepSize: number;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({
    defaultValue,
    startingValue,
    maxValue,
    isStepped,
    stepSize,
    leftIcon,
    rightIcon,
}) => {
    const [value, setValue] = useState<number>(defaultValue);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [region, setRegion] = useState<"left" | "middle" | "right">("middle");
    const clientX = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);


    useMotionValueEvent(clientX, "change", (latest: number) => {
        if (sliderRef.current) {
            const { left, right } = sliderRef.current.getBoundingClientRect();
            let newValue: number;
            if (latest < left) {
                setRegion("left");
                newValue = left - latest;
            } else if (latest > right) {
                setRegion("right");
                newValue = latest - right;
            } else {
                setRegion("middle");
                newValue = 0;
            }
            overflow.jump(decay(newValue, MAX_OVERFLOW));
        }
    });

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.buttons > 0 && sliderRef.current) {
            const { left, width } = sliderRef.current.getBoundingClientRect();
            let newValue =
                startingValue +
                ((e.clientX - left) / width) * (maxValue - startingValue);
            if (isStepped) {
                newValue = Math.round(newValue / stepSize) * stepSize;
            }
            newValue = Math.min(Math.max(newValue, startingValue), maxValue);
            setValue(newValue);
            clientX.jump(e.clientX);
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        handlePointerMove(e);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: "spring", bounce: 0.5 });
    };

    const getRangePercentage = (): number => {
        const totalRange = maxValue - startingValue;
        if (totalRange === 0) return 0;
        return ((value - startingValue) / totalRange) * 100;
    };


    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTrack, setCurrentTrack] = useState(() => {
        const savedTrack = localStorage.getItem('currentTrack');
        return savedTrack ? parseInt(savedTrack, 10) : 3; // default ke 3
    });
    
    useEffect(() => {
        localStorage.setItem('currentTrack', currentTrack.toString());
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
    
        const handleEnded = () => {
            setCurrentTrack(prev => {
                if (prev === 1) return 2;
                if (prev === 2) return 3;
                return 1;
            });
        };
    
        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (value < 2) {
                audioRef.current.muted = true;
                audioRef.current.volume = 0;
            } else {
                audioRef.current.muted = false;
                audioRef.current.volume = value / 100;
            }
        }
    }, [value]);

    useEffect(() => {
        const playAudio = () => {
            if (audioRef.current) {
                audioRef.current.play().catch((error) => {
                    console.error("Play error:", error);
                });
            }
            document.removeEventListener('click', playAudio);
        };

        window.addEventListener('click', playAudio);
        window.addEventListener('touchstart', playAudio);
        window.addEventListener('keydown', playAudio);

        return () => {
            window.removeEventListener('touchstart', playAudio);
            window.removeEventListener('keydown', playAudio);
            document.removeEventListener('click', playAudio);
        };
    }, []);


    return (
        <>
            <motion.div
                onHoverStart={() => animate(scale, 1.2)}
                onHoverEnd={() => animate(scale, 1)}
                onTouchStart={() => animate(scale, 1.2)}
                onTouchEnd={() => animate(scale, 1)}
                style={{
                    scale,
                    opacity: useTransform(scale, [1, 1.2], [0.7, 1]),
                }}
                className="flex w-full touch-none select-none items-center justify-center gap-4"
            >

                <audio 
                    id="myAudio"
                    ref={audioRef} 
                    src={
                        currentTrack === 1 ? "/canivive.mp3" : 
                        currentTrack === 2 ? "/canivive2.mp3" : 
                        "/canivive3.mp3"
                    }
                    autoPlay
                />


                <motion.div
                    animate={{
                        scale: region === "left" ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 },
                    }}
                    style={{
                        x: useTransform(() =>
                            region === "left" ? -overflow.get() / scale.get() : 0
                        ),
                    }}
                >
                    {leftIcon}
                </motion.div>

                <div
                    ref={sliderRef}
                    className="relative flex w-full max-w-xs flex-grow cursor-grab touch-none select-none items-center py-4"
                    onPointerMove={handlePointerMove}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                >
                    <motion.div
                        style={{
                            scaleX: useTransform(() => {
                                if (sliderRef.current) {
                                    const { width } = sliderRef.current.getBoundingClientRect();
                                    return 1 + overflow.get() / width;
                                }
                                return 1;
                            }),
                            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                            transformOrigin: useTransform(() => {
                                if (sliderRef.current) {
                                    const { left, width } =
                                        sliderRef.current.getBoundingClientRect();
                                    return clientX.get() < left + width / 2 ? "right" : "left";
                                }
                                return "center";
                            }),
                            height: useTransform(scale, [1, 1.2], [6, 12]),
                            marginTop: useTransform(scale, [1, 1.2], [0, -3]),
                            marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
                        }}
                        className="flex flex-grow"
                    >
                        <div className="relative h-full flex-grow overflow-hidden rounded-full bg-gray-400">
                            <div
                                className="absolute h-full bg-gray-500 rounded-full"
                                style={{ width: `${getRangePercentage()}%` }}
                            />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    animate={{
                        scale: region === "right" ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 },
                    }}
                    style={{
                        x: useTransform(() =>
                            region === "right" ? overflow.get() / scale.get() : 0
                        ),
                    }}
                >
                    {rightIcon}
                </motion.div>
            </motion.div>

        </>
    );
};

function decay(value: number, max: number): number {
    if (max === 0) {
        return 0;
    }
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}

export default ElasticSlider;
