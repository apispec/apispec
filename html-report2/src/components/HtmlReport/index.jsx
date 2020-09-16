import { hot } from 'react-hot-loader';
import React from 'react';
import PropTypes from 'prop-types';

import Footer from '../Footer';
import Loader from '../Loader';
import Navbar from '../Navbar';
// import { NavMenu } from "components/nav-menu";
import Suites from '../Suites';
import Suite from '../Suite';
import Test from '../Test';
import Report from '../Report';

import { mochawesome as theme } from '../../themes';

const DefaultTest = (props) => <Test {...props} />;
const DefaultSuite = (props) => (
    <Suite {...props} Test={DefaultTest} Actions={() => <div>actions</div>} />
);
const DefaultSuites = (props) => <Suites {...props} Suite={DefaultSuite} />;

const HtmlReport = ({ store }) => {
    return (
        <Report
            store={store}
            theme={theme}
            Navbar={Navbar}
            Suites={DefaultSuites}
            Loader={Loader}
            Footer={Footer}
        />
    );
};

HtmlReport.propTypes = {
    store: PropTypes.shape().isRequired,
};

HtmlReport.displayName = 'HtmlReport';

export default hot(module)(HtmlReport);
