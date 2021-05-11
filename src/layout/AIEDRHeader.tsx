import React, { useEffect } from 'react';
import { StyledLayout } from 'src/atoms/styledLayout';
import styled from 'styled-components';
import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import useAxios from 'src/hooks/useAxios';
import { AxiosRequestConfig } from 'axios';
import { userLoginConfig } from 'src/api';

import { StyledButton } from 'src/atoms/StyledButton';
import { StyledText } from 'src/atoms/StyledText';
import { useStore } from 'src/contexts/globalContext';
import { dashboardIcon } from 'src/assets/index';

const { Header } = Layout;
const { logo, userIcon } = dashboardIcon;

const StyledHeader = styled(Header)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(0deg, #DCDCDC, #F0F0F0);
    padding: 0 27px;
`;

const LeftHeader = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

const RightHeader = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

const UserButton = styled(StyledButton)`
`;

const UserImg = styled.img`
`;

const CollapsedButton = styled(StyledButton)`
    padding-left: 0px;
`;

const Logo = styled.img`
`;

const AIEDRHeader = () => {
    const { isFuncSiderCollapsed, setIsFuncSiderCollapsed } = useStore();
    const { apiCaller } = useAxios();

    const userLogin = async () => {
        
        const response = await apiCaller(userLoginConfig({
            secretKey: '58afef1bf8c90a43be4c16c54f62940239a0902d64a9d57e7a46bb370bf26b9d2f25fb51256be5afc4790103367c62c955a845977dd422500b296acc5542777c',
            serialNumber: 'defaultUser'
        }) as AxiosRequestConfig);

        const {token} = response.responseData;
        
        if( token ) {
            localStorage.setItem('userToken', token);
        }
    };

    const handleLogin = () => {
        userLogin();
    };

    useEffect(() => {
        userLogin();
    }, []);




    return (
        <StyledLayout >
            <StyledHeader>
                <LeftHeader>
                    <CollapsedButton
                        customSize="large"
                        type="link"
                        onClick={(e) => {
                            console.log('clicked: ', e);
                            setIsFuncSiderCollapsed(!isFuncSiderCollapsed);
                        }}
                    >
                        <MenuOutlined />
                    </CollapsedButton>
                    <Logo src={logo} />
                </LeftHeader>
                <RightHeader>
                    <UserButton type="link" onClick={handleLogin}>
                        <UserImg src={userIcon} />
                    </UserButton>
                    <StyledText type="medium" isBold={false}>Admin</StyledText>
                </RightHeader>
            </StyledHeader>
        </StyledLayout>
    );
};

export default AIEDRHeader;

