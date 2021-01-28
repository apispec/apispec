import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Box, Typography, Card as MuiCard } from '@material-ui/core';

export const Card = styled(MuiCard)`
    ${(props) =>
        props.raised &&
        css`
            padding-left: ${props.theme.spacing(0, 2, 0, 0)};
        `};

    ${(props) =>
        !props.raised &&
        css`
            box-shadow: none;
            border-top: 1px solid ${props.theme.palette.divider};
            border-left: 1px solid ${props.theme.palette.divider};
            border-bottom: 1px solid ${props.theme.palette.divider};
            margin: ${props.theme.spacing(0, 0, 2, 2)};
        `};
`;

export const TestContainer = styled(Box)`
    border-top: 1px solid ${(props) => props.theme.palette.divider};
`;

export const Title = ({ title }) => (
    <Typography variant='h5'>{title}</Typography>
);

Title.propTypes = {
    title: PropTypes.string,
};

Title.defaultProps = {
    title: '',
};

export const Description = ({ description }) => (
    <Typography>{description}</Typography>
);

Description.propTypes = {
    description: PropTypes.string,
};

Description.defaultProps = {
    description: '',
};

export const CardContent = ({ children }) => (
    <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        p={2}
        pt={1}
        pr={1}>
        {children}
    </Box>
);

CardContent.propTypes = {
    children: PropTypes.node.isRequired,
};

export const CardActions = ({ children }) => (
    <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        pl={2}
        pr={0.5}
        pt={0}
        pb={1}
        mt={-1}>
        {children}
    </Box>
);

CardActions.propTypes = {
    children: PropTypes.node.isRequired,
};
