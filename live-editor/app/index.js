import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { action } from 'mobx';

import MochawesomeReport from '../../html-report/mochawesome-report-generator/src/client/components/report';
import ReportStore, { log } from '../../html-report/mochawesome-report-generator/src/client/js/reportStore';

// Initialize the store
const store = new ReportStore({}, {
    reportTitle: 'apispec',
    enableCharts: true,
    enableCode: true,
    showPassed: true,
    showFailed: true,
    showPending: true,
    showSkipped: true,
    showHooks: 'always',
});
log(store);
const socket = io();

socket.emit('action', { type: 'mocha/hello', data: 'foo!' });

socket.emit('action', { type: 'mocha/init' });

socket.on('action', action(msg => {
    console.log(msg);

    if (msg.type === 'mochaui/report') {
        store.results = msg.data.results;
        console.log(msg);
    }
}));




ReactDOM.render(
    React.createElement(MochawesomeReport, { store }),
    document.getElementById('report')
);
