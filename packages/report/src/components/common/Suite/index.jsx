import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Box } from '@material-ui/core';

import ExpandButton from '../ExpandButton';
import {
    Card,
    CardContent,
    CardActions,
    TestContainer,
    Title,
    Description,
} from './styles';
import Chart from './Chart';
import SuiteCompact from './Compact';
import Tests from '../Tests';
// import TestListMui from '../test/list-mui';
// import SuiteListMui from './list-mui'
// import SuiteSummaryMui from './summary-mui'

import { useToggle } from '../../../style/base';

const Suite = ({
    suite,
    enableChart,
    enableCode,
    isMain,
    compact,
    TitleComponent,
    DescriptionComponent,
    Actions,
    Test,
}) => {
    const [expanded, toggleExpanded] = useToggle(true);

    const {
        rootEmpty,
        suites,
        tests,
        beforeHooks,
        afterHooks,
        uuid,
        title,
        //        file,
        options = {},
        duration,
    } = suite;

    const { description = '' } = options;

    const hasSuites = suites && suites.length > 0;
    const hasTests = tests && tests.length > 0;
    const hasPasses = suite.passes && suite.passes.length > 0;
    const hasFailures = suite.failures && suite.failures.length > 0;
    const hasPending = suite.pending && suite.pending.length > 0;
    const hasSkipped = suite.skipped && suite.skipped.length > 0;
    const hasBeforeHooks = beforeHooks && beforeHooks.length > 0;
    const hasAfterHooks = afterHooks && afterHooks.length > 0;
    //    const totalTests = hasTests ? tests.length : 0;
    const totalPasses = hasPasses ? suite.passes.length : 0;
    const totalFailures = hasFailures ? suite.failures.length : 0;
    const totalPending = hasPending ? suite.pending.length : 0;
    const totalSkipped = hasSkipped ? suite.skipped.length : 0;

    const subSuiteProps = {
        enableChart,
        enableCode,
        TitleComponent,
        DescriptionComponent,
        Actions,
        Test,
    };
    // TODO: CompositeTest instead of SuiteCompact
    // TODO: instead of triggering by level, might trigger in options with compositeTest
    const subSuites = (isMain2) =>
        hasSuites &&
        (!isMain && !isMain2
            ? suites.map((subsuite) => (
                  <SuiteCompact
                      key={subsuite.uuid}
                      suite={subsuite}
                      isMain={isMain2}
                      Test={Test}
                      {...subsuite}
                      {...subSuiteProps}
                  />
              ))
            : suites.map((subsuite) => (
                  <Suite
                      key={subsuite.uuid}
                      suite={subsuite}
                      isMain={isMain2}
                      {...subSuiteProps}
                  />
              )));
    /*
    const summaryProps = {
        duration,
        totalTests,
        totalPasses,
        totalFailures,
        totalPending,
        totalSkipped,
        noMargin: title === '' && file === '',
    };
*/
    const chartProps = {
        duration,
        totalPasses,
        totalFailures,
        totalPending,
        totalSkipped,
        size: 75,
    };

    if (rootEmpty && !hasBeforeHooks && !hasAfterHooks) {
        return subSuites(true);
    }

    return (
        <Card id={uuid} raised={isMain} square>
            <CardContent>
                <Box>
                    <TitleComponent title={title} />
                    <DescriptionComponent description={description} />
                </Box>
                {hasTests && enableChart && <Chart {...chartProps} />}
                {!hasTests && !Actions && (
                    <ExpandButton onClick={toggleExpanded} />
                )}
            </CardContent>
            {(Actions || hasTests) && (
                <CardActions>
                    {Actions && <Actions {...suite} />}
                    {
                        hasTests && (
                            <div />
                        ) /* <SuiteSummaryMui {...summaryProps} /> */
                    }
                    <ExpandButton onClick={toggleExpanded} />
                </CardActions>
            )}
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                {(hasTests || hasBeforeHooks || hasAfterHooks) && (
                    <Tests
                        uuid={uuid}
                        tests={tests}
                        beforeHooks={beforeHooks}
                        afterHooks={afterHooks}
                        enableCode={enableCode}
                        Test={Test}
                    />
                )}
                {subSuites()}
            </Collapse>
        </Card>
    );
};

Suite.propTypes = {
    suite: PropTypes.shape().isRequired,
    isMain: PropTypes.bool,
    compact: PropTypes.bool,
    enableChart: PropTypes.bool,
    enableCode: PropTypes.bool,
    TitleComponent: PropTypes.elementType,
    DescriptionComponent: PropTypes.elementType,
    Actions: PropTypes.oneOfType([PropTypes.elementType, PropTypes.bool]),
    Test: PropTypes.elementType.isRequired,
};

Suite.defaultProps = {
    isMain: false,
    compact: false,
    enableChart: false,
    enableCode: false,
    TitleComponent: Title,
    DescriptionComponent: Description,
    Actions: false,
};

Suite.displayName = 'Suite';

export default React.memo(Suite);
