//
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledLayout } from 'src/atoms/styledLayout';
import { StyledMenu } from 'src/atoms/StyledMenu';
import { Link } from 'react-router-dom';
import { useStore } from 'src/contexts/globalContext';
// import { dashboardIcon } from 'src/assets/index';

const { Item } = StyledMenu;
const { Sider } = StyledLayout;
// const { dashboardNormal, dashboardSelected, deviceDirectoryNormal, deviceDirectorySelected } = dashboardIcon;

const PageSider = styled(Sider)`
    /* min-height: calc(100vh - 64px);
    float: left; */
`;

const MenuItem = styled(Item)`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

// const MenuIcon = styled.img`
//     width: 20px;
//     height: 20px;
//     margin: 10px 15px;
//     visibility: ${prop => prop.src ? 'visible' : 'hidden'};
// `;

const Menu = styled(StyledMenu)`
    /* &.ant-menu-item {
        height: 200px;
    } */

    /* 因為大於（>）只會影響到直接的小孩 最直接的第一層*/
    &.ant-menu > li {
        height: 40px;
    }
    &.ant-menu-horizontal{
        line-height: 40px;
    }
    &.ant-menu-horizontal > .ant-menu-item a  {
        color: black;
        padding: 13px 30px 12px 30px;
    }
    &.ant-menu-horizontal > .ant-menu-item-selected a  {
        color: black;
        padding: 13px 30px 12px 30px;
        background-color: #E6E6E6;
        border-right: 1px black solid;
        border-left: 1px black solid;
        border-top: 0px black solid
    }
    &.ant-menu-horizontal > .ant-menu-item {
        color: black;
        border-bottom: 0px white solid
    }
    &.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item, .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu{
        margin: 0px;
    }
    &.ant-menu-horizontal > .ant-menu-item:hover {
        /* color: black; */
        border-bottom: 0px white solid;
        /* border-right: 1px black solid;
        border-left: 1px black solid;
        border-top: 0px black solid */
    }
    &.ant-menu-horizontal > .ant-menu-item-active:hover {
        color:black;
    }
    /* &.ant-menu-horizontal > .ant-menu-item a:hover {
        color:black;
        background-color: #E6E6E6;
    } */
`;

const FunctionSider = () => {
    const { isFuncSiderCollapsed } = useStore();
    const [selectedKey, setSelectedKey] = useState<string | number>(1);
    // const [dashboardMenuIcon, setDashboardMenuIcon] = useState<string>(dashboardSelected);
    // const [deviceDirectoryMenuIcon, setDeviceDirectoryMenuIcon] = useState<string>(deviceDirectoryNormal);
    // const [deviceIdentityMenuIcon, setDeviceIdentityMenuIcon] = useState<string>(deviceIdentityNormal);


    useEffect(() => {
        switch (selectedKey) {
            case '1':
                // setDashboardMenuIcon(dashboardSelected);
                // setDeviceDirectoryMenuIcon(deviceDirectoryNormal);
                // setDeviceIdentityMenuIcon(deviceIdentityNormal);
                break;
            case '2':
                // setDashboardMenuIcon(dashboardNormal);
                // setDeviceDirectoryMenuIcon(deviceDirectorySelected);
                // setDeviceIdentityMenuIcon(deviceIdentityNormal);
                break;
            case '3':
                // setDashboardMenuIcon(dashboardNormal);
                // setDeviceDirectoryMenuIcon(deviceDirectoryNormal);
                // setDeviceIdentityMenuIcon(deviceIdentitySelected);
                break;
        }
    }, [selectedKey]);

    return (
        <>
            {/* PageSider 左邊藍色sider */}
            <PageSider width={'auto'} collapsed={isFuncSiderCollapsed} collapsible={true} trigger={null} >
                <Menu
                    // mode="inline"
                    mode="horizontal"
                    // theme="dark"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['']}//dashboard
                    inlineCollapsed={isFuncSiderCollapsed}
                    onClick={(item) => setSelectedKey(item.key)}
                    style={{ margin: '0px;' }}
                >
                    <MenuItem key="1">
                        {/* icon={<MenuIcon src={dashboardMenuIcon} />} */}
                        <Link to={'/liveStreaming'}>即時影像</Link>
                        {/* Dashboard */}
                    </MenuItem>
                    <MenuItem key="2">
                        {/* icon={<MenuIcon src={deviceDirectoryMenuIcon} />} */}
                        <Link to={'/event'}>影像事件</Link>
                        {/* Device directory */}
                    </MenuItem>
                    <MenuItem key="3" >
                        <Link to={'/'}>設定</Link>
                        {/* Dashboard */}
                    </MenuItem>
                    <MenuItem key="4" >
                        <Link to={'/device_directory'}>設備目錄</Link>
                        {/* Device directory */}
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