import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import {
    createGlobalStyle,
    ThemeProvider as ScThemeProvider,
} from 'styled-components';
import {
    StylesProvider as MuiStylesProvider,
    ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';

import { CssBaseline, Box } from '@material-ui/core';

import StoreProvider from '../StoreProvider';

const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
}
  body {
    min-height: 100vh;
  }
  #report {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

const Report = observer(
    ({ store, theme, Navbar, Suites, Header, Loader, Footer }) => {
        const { openSideNav, reportTitle, stats, VERSION } = store;

        return (
            <MuiStylesProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                    <ScThemeProvider theme={theme}>
                        <StoreProvider store={store}>
                            <CssBaseline />
                            <GlobalStyle />
                            <Navbar
                                onMenuClick={openSideNav}
                                reportTitle={reportTitle}
                                stats={stats}
                            />
                            <Box component='main' pt={12} pb={6} flexGrow={1}>
                                <Header />
                                <Suites />
                                <Loader />
                                {/* <NavMenu /> */}
                            </Box>
                            <Footer version={VERSION} />
                        </StoreProvider>
                    </ScThemeProvider>
                </MuiThemeProvider>
            </MuiStylesProvider>
        );
    }
);

Report.propTypes = {
    store: PropTypes.shape().isRequired,
    theme: PropTypes.shape().isRequired,
    Navbar: PropTypes.elementType.isRequired,
    Suites: PropTypes.elementType.isRequired,
    Header: PropTypes.elementType,
    Loader: PropTypes.elementType,
    Footer: PropTypes.elementType,
};

Report.defaultProps = {
    Header: () => null,
    Loader: () => null,
    Footer: () => null,
};

Report.displayName = 'Report';

export default Report;
