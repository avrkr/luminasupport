import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (namespace, userId) => {
    const socketRef = useRef();

    useEffect(() => {
        const socket = io(`/${namespace}`, {
            auth: { userId }
        });
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [namespace, userId]);

    return socketRef.current;
};

export default useSocket;
