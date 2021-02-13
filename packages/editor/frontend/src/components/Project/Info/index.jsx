import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Typography, Grid, Button } from '@material-ui/core';

const Actions = styled(Grid).attrs(() => ({
    container: true,
    justify: 'center',
    spacing: 2,
}))`
    margin: ${(props) => props.theme.spacing(3, 0, 0, 0)};
`;

const ProjectInfo = ({ name, title, description, version }) => {
    return (
        <>
            <Typography
                variant='h5'
                align='center'
                color='textSecondary'
                paragraph>
                {name}
                {version && (
                    <Typography
                        variant='subtitle2'
                        display='inline'
                        color='textSecondary'>
                        {` v${version}`}
                    </Typography>
                )}
            </Typography>
            <Typography
                component='h1'
                variant='h2'
                align='center'
                color='textPrimary'
                gutterBottom>
                {title}
                {version && (
                    <Typography
                        variant='subtitle2'
                        display='inline'
                        color='textSecondary'>
                        {` v${version}`}
                    </Typography>
                )}
            </Typography>
            <Typography
                variant='body'
                align='center'
                color='textSecondary'
                paragraph>
                {description}
            </Typography>
            <Actions>
                <Grid item>
                    <Button variant='contained' color='primary'>
                        Edit settings
                    </Button>
                </Grid>
            </Actions>
        </>
    );
};

ProjectInfo.propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    version: PropTypes.string,
};

ProjectInfo.defaultProps = {
    name: null,
    title: null,
    description: null,
    version: null,
};

ProjectInfo.displayName = 'ProjectInfo';

export default ProjectInfo;
