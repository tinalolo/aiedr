
import React from 'react';
import { Button as antdButton } from 'antd';
import styled from 'styled-components';

interface Props {
    customSize?: 'large' | 'small'
}

export const StyledButton = styled(antdButton)`
    border-radius: 50px;
    ${(prop: Props) => prop.customSize === 'large' && (
        `
        height: 60px;
        font-size: 24px;
        padding: 0 40px;
        `
    )}
`;


