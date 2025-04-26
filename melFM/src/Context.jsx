import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Cleanup socket on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    const initializeSocket = (options) => {
        const newSocket = io("http://localhost:3020", options);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        return newSocket;
    };

    return (
        <SocketContext.Provider value={{ socket, initializeSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};