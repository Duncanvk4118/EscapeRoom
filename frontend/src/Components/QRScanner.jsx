import React, { useState } from "react";
import {WebcamCapture} from "./Webcam";
import jsQR from 'jsqr';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router';

import api from '../utils/api';
// import {CameraCapture} from "./Camera";


export const QRScanner = () => {
    const [qrCode, setQrCode] = useState("");
    const [scanning, setScanning] = useState(true);
    const navigate = useNavigate();

    const handleScan = (imageSrc) => {
        if (imageSrc) {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert"});
                if (code && scanning) {
                    // code.data contains the scanned string
                    const scanned = code.data && code.data.toString();
                    console.log("scanned raw: ", scanned);
                    const isJwtLike = typeof scanned === 'string' && scanned.split('.').length === 3;
                    if (isJwtLike) {
                        try {
                            const payload = jwtDecode(scanned);
                            // expect question id or er_question id
                            if (payload && (payload.question_id || payload.questionId || payload.er_question_id || payload.erQuestionId)) {
                                // stop scanning
                                setScanning(false);
                                setQrCode(scanned);
                                console.log('Detected JWT-like token, calling backend...');
                                // call backend to get full question data
                                (async () => {
                                    try {
                                        const resp = await api(`/game/get-question/${encodeURIComponent(scanned)}`);
                                        console.log('Backend response for QR token', resp);
                                        // navigate to question page so the game continues
                                        navigate('/quest');
                                    } catch (err) {
                                        console.error('Error fetching question with token', err);
                                        // resume scanning after a short delay so user can try again
                                        setTimeout(() => setScanning(true), 1500);
                                    }
                                })();
                                return;
                            }
                        } catch (e) {
                            // not a valid JWT payload, ignore and continue scanning
                            console.log('jwt decode failed', e);
                        }
                    }
                    // If not JWT-like, still store the code for debugging
                    setQrCode(code);
                    console.log("code: ", code);
                }
            }
        }
    }

    return (<>
        <div className={"flex border-8 border-dashed border-orange-500 rounded-lg"}>
                <WebcamCapture onScan={handleScan} active={scanning} />
        </div>
        {/*<div className={"block md:hidden sm:flex border-8 border-dashed border-orange-500 rounded-lg"}>*/}
        {/*        <CameraCapture onScan={handleScan} />*/}
        {/*</div>*/}
        </>
    );
}