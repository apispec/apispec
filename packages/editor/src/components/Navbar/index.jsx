import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const Navbar = ({ reportTitle }) => {
    return (
        <AppBar position='fixed'>
            <Toolbar variant='dense'>
                <Typography variant='h6' color='inherit' noWrap>
                    {reportTitle}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

Navbar.propTypes = {
    reportTitle: PropTypes.string.isRequired,
};

Navbar.displayName = 'Navbar';

export default Navbar;
