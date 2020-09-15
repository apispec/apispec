import React from 'react';
import ReactDOM from 'react-dom';
import HtmlReport from './components/HtmlReport';
import ReportStore from './notchanged/reportStore';

// Initialize the store
const bodyEl = document.querySelector('body');
const data = JSON.parse(bodyEl.getAttribute('data-raw'));
const config = JSON.parse(bodyEl.getAttribute('data-config'));
const store = new ReportStore(data, config);

// Clean up the DOM
bodyEl.removeAttribute('data-raw');
bodyEl.removeAttribute('data-config');

// Add global reference to the store
window.marge = store;

ReactDOM.render(
    React.createElement(HtmlReport, { store }),
    document.getElementById('report')
);
