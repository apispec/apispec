import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { Container } from '@material-ui/core';

import { useStore } from '../store';

const ReportBody = observer(({ Suite, containerProps }) => {
    const store = useStore();

    const {
        showPassed,
        showFailed,
        showPending,
        showSkipped,
        showHooks,
        enableCode,
        enableChart,
        results,
    } = store;

    useEffect(() => {
        const updateSuites = (timeout) => store.updateFilteredSuites(timeout);

        updateSuites();

        const disposer = reaction(
            () => {
                return {
                    showPassed,
                    showFailed,
                    showPending,
                    showSkipped,
                    showHooks,
                    enableCode,
                    enableChart,
                    results,
                };
            },
            () => updateSuites(0),
            { delay: 300 }
        );

        return disposer;
    }, [
        store,
        showPassed,
        showFailed,
        showPending,
        showSkipped,
        showHooks,
        enableCode,
        enableChart,
        results,
    ]);

    const { filteredSuites: suites } = store;
    console.log(suites);

    return (
        <Container {...containerProps}>
            {suites.map((suite) => (
                <Suite
                    key={suite.uuid}
                    suite={suite}
                    enableChart={enableChart}
                    enableCode={enableCode}
                />
            ))}
        </Container>
    );
});

ReportBody.propTypes = {
    Suite: PropTypes.elementType.isRequired,
    containerProps: PropTypes.shape(Container.propTypes),
};

ReportBody.defaultProps = {
    containerProps: {},
};

ReportBody.displayName = 'ReportBody';

export default ReportBody;
