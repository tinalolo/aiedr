import styled from 'styled-components';
import { Checkbox as antdCheckbox } from 'antd';
//antd => Ant Design of React

export const StyledCheckbox = styled(antdCheckbox)`
    display: flex;
    align-items: flex-end;
    color: white;

    .ant-checkbox-inner {
        width: 20px;
        height: 20px;
    }
`;