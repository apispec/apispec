import { hot } from 'react-hot-loader';
import React from 'react';
import PropTypes from 'prop-types';

import Footer from '../../common/Footer';
import Loader from '../../common/Loader';
import Navbar from '../../common/Navbar';
// import { NavMenu } from "components/nav-menu";
import Suites from '../../common/Suites';
import Suite from '../../common/Suite';
import Test from '../../common/Test';
import Report from '../../common/Report';

import { mochawesome as theme } from '../../../themes';

const DefaultTest = (props) => <Test {...props} />;
const DefaultSuite = (props) => (
    <Suite {...props} Test={DefaultTest} Actions={() => <div>actions</div>} />
);
const DefaultSuites = (props) => <Suites {...props} Suite={DefaultSuite} />;
const DefaultFooter = (props) => (
    <Footer {...props} name='mochawesome' link='https://apispec.github.io' />
);
const HtmlReport = ({ store }) => {
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

HtmlReport.propTypes = {
    store: PropTypes.shape().isRequired,
};

HtmlReport.displayName = 'HtmlReport';

export default hot(module)(HtmlReport);
