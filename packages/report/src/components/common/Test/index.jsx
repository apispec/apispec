/* eslint-disable max-len, no-nested-ternary  */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Accordion } from '@material-ui/core';

import Summary from './Summary';
import Details from './Details';
// import { CodeSnippet } from 'components/test';
import { useToggle } from '../../../style/base';

const StyledExpansionPanel = styled(({ pass, fail, ...props }) => (
    <Accordion {...props} />
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

const Test = ({ test, enableCode }) => {
    const {
        uuid,
        title,
        speed,
        duration,
        pass,
        fail,
        pending,
        skipped,
        isHook,
        err,
        code,
        context,
    } = test;

    const [expanded, toggleExpanded] = useToggle(false);

    const toggleExpandedState = () => {
        if ((enableCode && pass) || !!context || fail || isHook) {
            toggleExpanded();
        }
    };

    const isInactive = pending || skipped || (pass && !enableCode && !context);

    return (
        <StyledExpansionPanel
            id={uuid}
            square
            disabled={isInactive}
            expanded={expanded}
            pass={pass}
            fail={fail}
            onChange={toggleExpandedState}>
            <Summary
                title={title}
                duration={duration}
                speed={speed}
                passed={pass}
                failed={fail}
                pending={pending}
                errorMessage={err && err.message ? err.message : null}
                isHook={isHook}
                isExpanded={expanded}
                hasContext={!!context}
            />
            <Details
                passed={pass}
                failed={fail}
                error={err}
                code={code}
                context={context}
                enableCode={enableCode}
            />
        </StyledExpansionPanel>
    );
};

Test.propTypes = {
    test: PropTypes.shape().isRequired,
    enableCode: PropTypes.bool,
};

Test.defaultProps = {
    enableCode: true,
};

Test.displayName = 'Test';

export default Test;
