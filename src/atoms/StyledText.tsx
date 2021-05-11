import styled from 'styled-components';

interface Props {
    type: 'small' | 'medium' | 'large';
    isBold: boolean;
}

export const StyledText = styled.div`
    ${(prop: Props) => prop.type === 'small' && (
        `font-size: 12px;`
    )}
    ${(prop: Props) => prop.type === 'medium' && (
        `font-size: 16px;`
    )}
    ${(prop: Props) => prop.type === 'large' && (
        `font-size: 24px;`
    )}
    ${(prop: Props) => prop.isBold === true && (
        `font-wight: bold;`
    )}
`;