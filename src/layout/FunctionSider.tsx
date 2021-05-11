//
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledLayout } from 'src/atoms/styledLayout';
import { StyledMenu } from 'src/atoms/StyledMenu';
import { Link } from 'react-router-dom';
import { useStore } from 'src/contexts/globalContext';
import { dashboardIcon } from 'src/assets/index';

const { Item } = StyledMenu;
const { Sider } = StyledLayout;
const { dashboardNormal, dashboardSelected, deviceDirectoryNormal, deviceDirectorySelected } = dashboardIcon;

const PageSider = styled(Sider)`
    min-height: calc(100vh - 64px);
    float: left;
`;

const MenuItem = styled(Item)`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const MenuIcon = styled.img`
    width: 20px;
    height: 20px;
    margin: 10px 15px;
    visibility: ${prop => prop.src ? 'visible' : 'hidden'};
`;

const Menu = styled(StyledMenu)`
    /* &.ant-menu-item {
        height: 200px;
    } */

    &.ant-menu > li {
        height: 60px;
    }
`;

const FunctionSider = () => {
    const { isFuncSiderCollapsed } = useStore();
    const [selectedKey, setSelectedKey] = useState<string | number>(1);
    const [dashboardMenuIcon, setDashboardMenuIcon] = useState<string>(dashboardSelected);
    const [deviceDirectoryMenuIcon, setDeviceDirectoryMenuIcon] = useState<string>(deviceDirectoryNormal);
    // const [deviceIdentityMenuIcon, setDeviceIdentityMenuIcon] = useState<string>(deviceIdentityNormal);

    useEffect(() => {
        switch (selectedKey) {
            case '1':
                setDashboardMenuIcon(dashboardSelected);
                setDeviceDirectoryMenuIcon(deviceDirectoryNormal);
                // setDeviceIdentityMenuIcon(deviceIdentityNormal);
                break;
            case '2':
                setDashboardMenuIcon(dashboardNormal);
                setDeviceDirectoryMenuIcon(deviceDirectorySelected);
                // setDeviceIdentityMenuIcon(deviceIdentityNormal);
                break;
            case '3':
                setDashboardMenuIcon(dashboardNormal);
                setDeviceDirectoryMenuIcon(deviceDirectoryNormal);
                // setDeviceIdentityMenuIcon(deviceIdentitySelected);
                break;
        }
    }, [selectedKey]);

    return (
        <>
            {/* PageSider 左邊藍色sider */}
            <PageSider width={200} collapsed={isFuncSiderCollapsed} collapsible={true} trigger={null} >
                <Menu
                    mode="inline"
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['dashboard']}
                    inlineCollapsed={isFuncSiderCollapsed}
                    onClick={(item) => setSelectedKey(item.key)}
                >
                    <MenuItem key="1" icon={<MenuIcon src={dashboardMenuIcon} />}>
                        <Link to={'/dashboard'}>Dashboard</Link>
                    </MenuItem>
                    <MenuItem key="2" icon={<MenuIcon src={deviceDirectoryMenuIcon} />}>
                        <Link to={'/device_directory'}>Device directory</Link>
                    </MenuItem>
                    {/* <MenuItem key="3" icon={<MenuIcon src={deviceIdentityMenuIcon}/>}>
                        <Link to={'/device_identity'}>Device identity</Link>
                    </MenuItem> */}
                </Menu>
            </PageSider>
        </>
    );
};

export default FunctionSider;