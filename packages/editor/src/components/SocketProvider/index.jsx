import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { action } from 'mobx';
import { useStore } from '@apispec/report/src/components/common/StoreProvider';

const socket = io();

const backend = {
    socket,
    isRunning: false,
};

const socketContext = React.createContext(null);

const SocketProvider = ({ children }) => {
    const store = useStore();

    useEffect(() => {
        socket.emit('action', { type: 'editor/init' });

        // TODO
        // socket.emit('action', { type: 'mocha/init' });
        socket.emit('action', {
            type: 'mocha/run',
            payload: { grep: 'should skip', invert: true },
        });

        socket.on(
            'action',
            action((msg) => {
                console.log(msg);

                if (msg.type === 'editor/project') {
                    store.project = msg.data;
                }
                if (msg.type === 'mochaui/report') {
                    store.results = msg.data.results;
                    backend.isRunning = false;
                }
            })
        );
    }, [store]);

    return (
        <socketContext.Provider value={backend}>
            {children}
        </socketContext.Provider>
    );
};

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

SocketProvider.displayName = 'SocketProvider';

export default SocketProvider;

export const useSocket = () => {
    const sock = React.useContext(socketContext);
    if (!sock || !sock.socket) {
        throw new Error('You have forgot to use SocketProvider, shame on you.');
    }
    return sock;
};

export const useRunner = (grep) => {
    const state = useSocket();

    return [
        state.isRunning,
        () => {
            if (!state.isRunning) {
                state.isRunning = true;

                state.socket.emit('action', {
                    type: 'mocha/run',
                    payload: { grep },
                });
            }
        },
    ];
};
