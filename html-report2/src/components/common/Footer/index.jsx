import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Typography, Link } from '@material-ui/core';

const FooterWrapper = styled.footer`
    background-color: ${(props) => props.theme.palette.background.paper};
    padding: ${(props) => props.theme.spacing(6, 0)};
`;

const Footer = ({ name, link, version }) => {
    return (
        <FooterWrapper>
            <Typography variant='body2' color='textSecondary' align='center'>
                &copy;&nbsp;{new Date().getFullYear()}&nbsp;
                <Link color='primary' href={link}>
                    {name}
                </Link>
                &nbsp;{version}
            </Typography>
        </FooterWrapper>
    );
};

Footer.propTypes = {
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
};

export default Footer;
