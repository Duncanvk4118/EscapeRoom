import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import {QRScanner} from "../Components/QRScanner";

export const Scanner = () => {
    return (
        <div>
            <span>QAP - Quick Access Control</span>
        <Link to={"1"}>Vraag 1</Link>
            <QRScanner />

        </div>
    )
}
