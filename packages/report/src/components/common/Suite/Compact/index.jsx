/* eslint-disable max-len, no-nested-ternary  */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, AccordionSummary } from '@material-ui/core';
import { ChatBubbleOutline, ExpandMore } from '@material-ui/icons';

import Duration from '../../Duration';
import IconLabel from '../../IconLabel';
import IconStatus from '../../IconStatus';
import { Title, ErrorMessage } from '../../Test/styles';
import { TestContainer } from '../styles';
import Tests from '../../Tests';

const Container = styled(({ pass, fail, ...props }) => (
    <TestContainer {...props} />
))`
    border-left: 3px solid
        ${(props) =>
            props.pass
                ? props.theme.color.green500
                : props.fail
                ? props.theme.color.red500
                : props.theme.color.grey};
    box-shadow: none;

    &::before {
        display: none;
    }

    &:not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.palette.divider};
    }

    &.MuiExpansionPanel-root.Mui-expanded {
        margin: 0;
    }
`;

const SuiteCompact = ({
    title,
    duration,
    speed,
    passes,
    failures,
    pending,
    enableCode,
    errorMessage,
    isHook,
    isExpanded,
    hasContext,
    uuid,
    tests,
    Test,
}) => {
    const hasPasses = passes && passes.length > 0;
    const hasFailures = failures && failures.length > 0;
    const hasPending = pending && pending.length > 0;

    return (
        <Container
            pass={hasPasses}
            fail={hasFailures}
            display='flex'
            flexDirection='column'
            flexGrow={1}>
            <Box display='flex' flexGrow={1} p={2}>
                {isHook ? (
                    <span>hook</span>
                ) : (
                    <IconStatus
                        status={
                            hasPasses
                                ? 'passed'
                                : hasFailures
                                ? 'failed'
                                : hasPending
                                ? 'pending'
                                : 'skipped'
                        }
                        boxProps={{ mr: 2, fontSize: '1.5rem' }}
                    />
                )}
                <Title truncate={!isExpanded} secondary={isHook}>
                    {title}
                </Title>
                <Box display='flex'>
                    {hasContext && (
                        <IconLabel
                            text=''
                            color='text.hint'
                            Icon={ChatBubbleOutline}
                        />
                    )}
                    {!isHook && (
                        <Duration
                            expanded={isExpanded}
                            pending={pending}
                            ms={duration}
                            color={
                                isExpanded ? 'text.primary' : 'text.secondary'
                            }
                            hoverColor='text.primary'
                            speed={speed}
                            iconAfter
                        />
                    )}
                </Box>
            </Box>
            {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <TestContainer ml={5}>
                <Tests
                    uuid={uuid}
                    tests={tests}
                    enableCode={enableCode}
                    beforeHooks={null}
                    afterHooks={null}
                    isNested
                    Test={Test}
                />
            </TestContainer>
        </Container>
    );
};

SuiteCompact.propTypes = {
    title: PropTypes.string.isRequired,
    duration: PropTypes.number,
    speed: PropTypes.string,
    passed: PropTypes.bool,
    failed: PropTypes.bool,
    pending: PropTypes.bool,
    errorMessage: PropTypes.string,
    isHook: PropTypes.bool,
    isExpanded: PropTypes.bool,
    hasContext: PropTypes.bool,
};

SuiteCompact.defaultProps = {
    duration: 0,
    speed: 'notset',
    passed: false,
    failed: false,
    pending: false,
    errorMessage: null,
    isHook: false,
    isExpanded: false,
    hasContext: false,
};

SuiteCompact.displayName = 'SuiteCompact';

export default SuiteCompact;
