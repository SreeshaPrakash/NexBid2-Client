import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '') || 'http://localhost:3000';

export const useSocket = (projectId?: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            if (projectId) {
                newSocket.emit('join_project', projectId);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [projectId]);

    return socket;
};
