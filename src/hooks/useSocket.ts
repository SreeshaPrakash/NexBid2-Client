
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '') || 'http://localhost:3000';

export const useSocket = (projectId?: string) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to socket server');
            if (projectId) {
                socket.emit('join_project', projectId);
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [projectId]);

    return socketRef.current;
};
