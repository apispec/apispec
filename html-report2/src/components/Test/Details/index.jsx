/* eslint-disable max-len, no-nested-ternary  */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { AccordionDetails, Tabs, Tab } from '@material-ui/core';

const StyledExpansionPanelDetails = styled(AccordionDetails)`
    padding: 0;
    flex-direction: column;
    background-color: ${(props) => props.theme.color.nearwhite};
`;

const StyledTabs = styled(Tabs)`
    padding: ${(props) => props.theme.spacing(0, 3)};

    & .MuiTabs-indicator {
        ${(props) =>
            props.color === 'success' &&
            css`
                background-color: ${props.theme.color.green500};
            `}
        ${(props) =>
            props.color === 'error' &&
            css`
                background-color: ${props.theme.color.red500};
            `}
      ${(props) =>
            props.color === 'neutral' &&
            css`
                background-color: ${props.theme.color.black54};
            `}
    }
`;

const TabContent = styled.div`
    min-height: 148px;
    padding: ${(props) => props.theme.spacing(2, 3)};
    background-color: ${(props) => props.theme.color.nearwhite};
    border-top: 1px solid ${(props) => props.theme.palette.divider};
`;

const TestDetails = ({ passed, failed, error, code, context, enableCode }) => {
    const cntxt = context ? JSON.parse(context) : [];

    const tabs = {};

    if (error) {
        if (error.estack) {
            tabs.error = { title: 'Error', value: error.estack };
        }
        if (error.diff) {
            tabs.diff = { title: 'Diff', value: error.diff, language: 'diff' };
        }
    }
    if (enableCode && code) {
        tabs.code = { title: 'Code', value: code, language: 'javascript' };
    }
    if (cntxt) {
        cntxt.forEach((ctx) => {
            tabs[ctx.title] = ctx;
        });
    }

    const initialSelectedTab =
        Object.keys(tabs).length > 0 && Object.keys(tabs)[0];

    const [selectedTab, setSelectedTab] = useState(initialSelectedTab);

    const onTabSelect = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <StyledExpansionPanelDetails>
            <StyledTabs
                value={selectedTab}
                onChange={onTabSelect}
                color={passed ? 'success' : failed ? 'error' : 'neutral'}>
                {Object.keys(tabs).map((key) => (
                    <Tab
                        key={key}
                        value={key}
                        label={tabs[key].title.toUpperCase()}
                        disableRipple
                    />
                ))}
            </StyledTabs>
            <TabContent>
                <div>code snippets</div>
                {/* {selectedTab === 'ERROR' && (
                        <CodeSnippet
                            code={err.estack}
                            highlight={false}
                            label='Stack Trace'
                        />
                    )}
                    {selectedTab === 'DIFF' && (
                        <CodeSnippet code={err.diff} lang='diff' label='Diff' />
                    )}
                    {selectedTab === 'CODE' && (
                        <CodeSnippet code={code} label='Test Code' />
                    )}
                    {cntxt &&
                        cntxt.some(
                            ({ title: ctitle }) => ctitle === selectedTab
                        ) && (
                            <CodeSnippet
                                code={
                                    cntxt.find(
                                        ({ title: ctitle }) =>
                                            ctitle === selectedTab
                                    ).value
                                }
                                label='bla'
                            />
                              )} */}
                {/* !!context && <TestContext context={context} /> */}
            </TabContent>
        </StyledExpansionPanelDetails>
    );
};

TestDetails.propTypes = {
    passed: PropTypes.bool,
    failed: PropTypes.bool,
    error: PropTypes.shape(),
    code: PropTypes.string,
    context: PropTypes.string,
    enableCode: PropTypes.bool,
};

TestDetails.defaultProps = {
    passed: false,
    failed: false,
    error: null,
    code: null,
    context: null,
    enableCode: true,
};

TestDetails.displayName = 'TestDetails';

export default TestDetails;
