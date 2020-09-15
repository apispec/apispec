import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Typography, Link } from '@material-ui/core';

const FooterWrapper = styled.footer`
    background-color: ${(props) => props.theme.palette.background.paper};
    padding: ${(props) => props.theme.spacing(6, 0)};
`;

const Footer = ({ version }) => {
    return (
        <FooterWrapper>
            <Typography variant='body2' color='textSecondary' align='center'>
                &copy;&nbsp;{new Date().getFullYear()}&nbsp;
                <Link color='primary' href='https://apispec.github.io'>
                    apispec
                </Link>
                &nbsp;{version}
            </Typography>
        </FooterWrapper>
    );
};

Footer.propTypes = {
    version: PropTypes.string.isRequired,
};

export default Footer;
