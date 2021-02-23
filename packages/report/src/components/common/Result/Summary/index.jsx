/* eslint-disable max-len, no-nested-ternary  */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, AccordionSummary } from '@material-ui/core';
import { ChatBubbleOutline, ExpandMore } from '@material-ui/icons';

import Duration from '../../Duration';
import IconLabel from '../../IconLabel';
import IconStatus from '../../IconStatus';
import { Title, ErrorMessage } from '../styles';

const ResultSummary = ({
    title,
    duration,
    speed,
    passed,
    failed,
    pending,
    errorMessage,
    isHook,
    isExpanded,
    hasContext,
    small,
}) => {
    return (
        <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Box display='flex' flexGrow={1}>
                <Box display='flex' flexDirection='column' flexGrow={1}>
                    <Box display='flex' flexGrow={1}>
                        {isHook ? (
                            <span>hook</span>
                        ) : (
                            <IconStatus
                                status={
                                    passed
                                        ? 'passed'
                                        : failed
                                        ? 'failed'
                                        : pending
                                        ? 'pending'
                                        : 'skipped'
                                }
                                boxProps={{
                                    mr: 2,
                                    fontSize: small ? '1rem' : '1.5rem',
                                }}
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
                                        isExpanded
                                            ? 'text.primary'
                                            : 'text.secondary'
                                    }
                                    hoverColor='text.primary'
                                    speed={speed}
                                    iconAfter
                                />
                            )}
                        </Box>
                    </Box>
                    {!!errorMessage && (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    )}
                </Box>
            </Box>
        </AccordionSummary>
    );
};

ResultSummary.propTypes = {
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
    small: PropTypes.bool,
};

ResultSummary.defaultProps = {
    duration: 0,
    speed: 'notset',
    passed: false,
    failed: false,
    pending: false,
    errorMessage: null,
    isHook: false,
    isExpanded: false,
    hasContext: false,
    small: false,
};

ResultSummary.displayName = 'ResultSummary';

export default ResultSummary;
