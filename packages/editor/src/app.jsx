import React from 'react';
import ReactDOM from 'react-dom';
import ReportStore from '@apispec/report/src/notchanged/reportStore';
import Editor from './components/Editor';

// Initialize the store
const store = new ReportStore(
    {},
    {
        reportTitle: 'apispec',
        enableCharts: true,
        enableCode: true,
        showPassed: true,
        showFailed: true,
        showPending: true,
        showSkipped: true,
        showHooks: 'always',
    }
);
// log(store);

ReactDOM.render(
    React.createElement(Editor, { store }),
    document.getElementById('report')
);
