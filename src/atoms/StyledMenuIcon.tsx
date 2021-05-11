import styled from 'styled-components';

export const StyledMenuIcon = styled.img`
    width: 20px;
    height: 20px;
    margin: 10px 15px;
    visibility: ${prop => prop.src ? 'visible' : 'hidden'}
`;
