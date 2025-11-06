import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

export const WebcamCapture = ({ onScan, active = true }) => {
    const webcamRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        // start or stop interval depending on `active`
        if (active) {
            timerRef.current = setInterval(() => {
                capture();
            }, 500);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [active]);

    const videoConstraints = {
        width: 500,
        height: 500,
        facingMode: "environment"
    };

    const capture = () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        onScan(imageSrc);
    }

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onClick={() => capture() }
            />
        </div>
    );
}