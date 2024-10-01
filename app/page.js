'use client'
import { useState, useEffect } from 'react';

export default function Home() {
    const workTime = 25 * 60 ; // 25 minutes
    const breakTime = 5 * 60; // 5 minutes
    const [timeLeft, setTimeLeft] = useState(workTime);
    const [isRunning, setIsRunning] = useState(false);
    const [isWorkPhase, setIsWorkPhase] = useState(true);
    const [intervalId, setIntervalId] = useState(null);

    // Calculate angles for the clock hands
    const calculateRotation = (timeInSeconds, totalTime) => {
        const minuteAngle = (timeInSeconds / totalTime) * 360;
        const secondAngle = ((timeInSeconds % 60) / 60) * 360;
        return { minuteAngle, secondAngle };
    };

    // Get the angles for the minute and second hands
    const { minuteAngle, secondAngle } = calculateRotation(timeLeft, workTime);

    // Handle Start/Stop functionality
    const startStopTimer = () => {
        if (isRunning) {
            clearInterval(intervalId);
            setIsRunning(false);
        } else {
            const id = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            setIntervalId(id);
            setIsRunning(true);
        }
    };

    // Reset Timer
    const resetTimer = () => {
        clearInterval(intervalId);
        setIsRunning(false);
        setIsWorkPhase(true);
        setTimeLeft(workTime);
    };

    // Handle Timer Completion
    useEffect(() => {
        if (timeLeft === 0) {
            clearInterval(intervalId);
            if (isWorkPhase) {
                setTimeLeft(breakTime);
                setIsWorkPhase(false);
                notifyUser("Time to rest!");
            } else {
                setTimeLeft(workTime);
                setIsWorkPhase(true);
                notifyUser("Get back to work!");
            }
            startStopTimer();
        }
    }, [timeLeft]);

    // Browser Notification
    const notifyUser = (message) => {
        if (Notification.permission === 'granted') {
            new Notification(message);
        }
    };

    // Request Notification Permission
    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    // Convert seconds into MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    // Generate 60 divisions for the clock face
    const divisions = Array.from({ length: 60 }, (_, index) => {
        const angle = index * 6; // 6 degrees per division
        const isHourMark = index % 5 === 0;
        return (
            <div
                key={index}
                className="absolute"
                style={{
                    height: '100%',
                    width: '100%',
                    transform: `rotate(${angle}deg)`,
                }}>
                <div
                    className={`absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800`}
                    style={{
                        height: isHourMark ? '10px' : '5px',
                        width: isHourMark ? '2px' : '1px',
                    }}
                />
            </div>
        );
    });

    return (
        <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">
                {isWorkPhase ? "Work Time" : "Break Time"}
            </h2>
            <div className="flex justify-center items-center relative">
                {/* Clock Face */}
                <div className="relative w-64 h-64 border-8 border-gray-800 rounded-full flex justify-center items-center">
                    {/* Clock Divisions */}
                    {divisions}
                    {/* Minute Hand */}
                    <div
                        className="w-1 h-24 bg-black absolute rounded-full"
                        style={{ 
                            transform: `rotate(${minuteAngle}deg)`,
                            transformOrigin: 'bottom center',
                            bottom: '50%',
                            left: 'calc(50% - 0.5px)'
                        }}
                    ></div>
                    {/* Second Hand */}
                    <div
                        className="w-0.5 h-28 bg-red-500 absolute rounded-full"
                        style={{ 
                            transform: `rotate(${secondAngle}deg)`,
                            transformOrigin: 'bottom center',
                            bottom: '50%',
                            left: 'calc(50% - 0.25px)'
                        }}
                    ></div>
                    {/* Clock Center */}
                    <div className="w-3 h-3 bg-gray-800 rounded-full absolute"></div>
                </div>
            </div>

            {/* Timer Text */}
            <div className="text-4xl font-bold">
                {formatTime(timeLeft)}
            </div>

            <div className="space-x-4">
                <button
                    onClick={startStopTimer}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    {isRunning ? "Stop" : "Start"}
                </button>
                <button
                    onClick={resetTimer}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}