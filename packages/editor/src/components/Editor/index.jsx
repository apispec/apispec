import { hot } from 'react-hot-loader';
import React from 'react';
import PropTypes from 'prop-types';

import {
    Footer,
    Loader,
    Suites,
    Suite,
    Test,
    Report,
    // eslint-disable-next-line import/no-unresolved
} from '@apispec/report';
import { apispec as theme } from '@apispec/report/src/themes';

import Navbar from '../Navbar';
import SuiteActions from '../SuiteActions';
import SocketProvider from '../SocketProvider';

const DefaultTest = (props) => <Test {...props} />;
const DefaultSuite = (props) => (
    <Suite {...props} Test={DefaultTest} Actions={SuiteActions} />
);
const DefaultSuites = (props) => (
    <SocketProvider>
        <Suites {...props} Suite={DefaultSuite} />
    </SocketProvider>
);
const DefaultFooter = (props) => (
    <Footer {...props} name='mochawesome' link='https://apispec.github.io' />
);
const Editor = ({ store }) => {
    return (
        <Report
            store={store}
            theme={theme}
            Navbar={Navbar}
            Suites={DefaultSuites}
            Loader={Loader}
            Footer={DefaultFooter}
        />
    );
};

Editor.propTypes = {
    store: PropTypes.shape().isRequired,
};

Editor.displayName = 'Editor';

export default hot(module)(Editor);
