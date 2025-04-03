import { useState, useEffect } from "react";
import DataSource from "../DataSource/videapi";

const useWebSocket = () => {
    const [imageSrc, setImageSrc] = useState("");
    const [status, setStatus] = useState("Disconnected");

    useEffect(() => {
        let socket;

        const connectWebSocket = () => {
            setStatus("Connecting...");
            socket = new WebSocket(DataSource.WEBSOCKET_URL);

            socket.onopen = () => {
                setStatus("Connected");
                console.log("WebSocket Connected");
            };

            socket.onmessage = (event) => {
                if (typeof event.data === "string") {
                    setImageSrc(`data:image/jpeg;base64,${event.data}`);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket Error:", error);
                setStatus("Error");
            };

            socket.onclose = () => {
                setStatus("Disconnected - Reconnecting...");
                setTimeout(connectWebSocket, 5000);
            };
        };

        connectWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    return { imageSrc, status };
};

export default useWebSocket;
