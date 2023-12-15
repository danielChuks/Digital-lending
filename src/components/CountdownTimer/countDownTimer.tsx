import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
    duration: number;
    onTimerEnd: any;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    duration,
    onTimerEnd,
}: CountdownTimerProps) => {
    const [remainingTime, setRemainingTime] = useState(duration);

    useEffect(() => {
        // Start the countdown
        const interval = setInterval(() => {
            setRemainingTime((prevTime: any) => prevTime - 1);
        }, 1000);
        if (remainingTime === 0) {
            clearInterval(interval);
            onTimerEnd(); // Call the callback function
        }
        return () => clearInterval(interval);
    }, [remainingTime]);

    const formattedTime = `0.${remainingTime % 60}`;
    return <p>Resend OTP in {formattedTime}s</p>;
};

export default CountdownTimer;
