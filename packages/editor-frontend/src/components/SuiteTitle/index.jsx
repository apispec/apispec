import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Box, TextField, IconButton } from '@material-ui/core';
import { Edit, Save, Cancel } from '@material-ui/icons';
import { useToggle } from '@apispec/report/src/style/base';
import { Title } from '@apispec/report/src/components/common/Suite/styles';

const StyledEdit = styled(IconButton)`
    color: ${(props) => props.theme.palette.divider};

    &:hover {
        color: ${(props) => props.theme.palette.text.secondary};
        background-color: inherit;
    }
`;

const SuiteTitle = ({ title }) => {
    const [edit, toggleEdit] = useToggle(false);
    const [newTitle, setTitle] = useState(title);

    const onChange = (event) => {
        setTitle(event.target.value);
    };

    const onSave = () => {
        toggleEdit();
    };

    const onCancel = () => {
        setTitle(title);
        toggleEdit();
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSave();
        }
        if (e.keyCode === 27) {
            onCancel();
        }
    };

    return edit ? (
        <Box display='flex' alignItems='center'>
            <TextField
                id='standard-with-placeholder'
                placeholder='Suite title'
                margin='normal'
                autoFocus
                value={newTitle}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
            <StyledEdit
                size='medium'
                title='Save title [Enter]'
                onClick={onSave}>
                <Save fontSize='small' />
            </StyledEdit>
            <StyledEdit size='medium' title='Cancel [Esc]' onClick={onCancel}>
                <Cancel fontSize='small' />
            </StyledEdit>
        </Box>
    ) : (
        <Box display='flex' alignItems='center'>
            <Title
                title={newTitle}
                css={css`
                    padding: ${(props2) => props2.theme.spacing(1, 0)};
                `}
            />
            <StyledEdit size='medium' title='Edit title' onClick={toggleEdit}>
                <Edit fontSize='small' />
            </StyledEdit>
        </Box>
    );
};

SuiteTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

SuiteTitle.defaultProps = {};

SuiteTitle.displayName = 'SuiteTitle';

export default SuiteTitle;
