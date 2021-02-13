import { useSocket } from './components/SocketProvider';

export const useRunner = (grep) => {
    const sock = useSocket();

    return () =>
        sock.emit('action', {
            type: 'mocha/run',
            payload: { grep },
        });
};
