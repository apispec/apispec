import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import { useRunner } from '../SocketProvider';

const SuiteActions = ({ title }) => {
    const [isRunning, run] = useRunner(title);

    return (
        <Box ml={-1.5}>
            <IconButton
                aria-label='Run suite'
                color='primary'
                disableRipple
                disabled={isRunning}
                onClick={run}>
                <PlayArrow />
            </IconButton>
        </Box>
    );
};

SuiteActions.propTypes = {
    title: PropTypes.string.isRequired,
};

SuiteActions.defaultProps = {};

SuiteActions.displayName = 'SuiteActions';

export default SuiteActions;
