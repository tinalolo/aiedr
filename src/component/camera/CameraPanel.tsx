import React, { useState, useEffect } from 'react';
import { Button, List as antdList } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined, VerticalLeftOutlined, VerticalRightOutlined, CloseOutlined } from '@ant-design/icons';
import { getCamerasConfig } from 'src/api';

import styled from 'styled-components';
import { useStore } from 'src/contexts/cameraContext';
import { useVideoStore } from 'src/contexts/videoContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';

import { StyledDrawer } from 'src/atoms/StyledDrawer';
import CameraCard from 'src/component/camera/CameraCard';
import SearchCameraPanel from 'src/component/camera/SearchCameraPanel';
import useAxios from 'src/hooks/useAxios';
import { AxiosRequestConfig } from 'axios';
import { CameraItem, GetCamerasResponse } from 'src/interface/api/response/getCameras';
import { isEmptyData } from 'src/helper/tool';




const Container = styled.div`
    height: 100%;
    background: #363D53;
    display: flex;
    flex-direction: column;
`;

// const NewEventPanel = styled.div`
//     display: flex;
//     align-items: center;
//     align-self: center;
//     justify-content: center;
//     width: 369px;
//     height: 36px;
//     background: #293140;
//     border-radius: 16px;
//     opacity: 1;
//     color: white;
//     font-size: 16px;
// `;

const CameraFilterBar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #409CFC;
    height: 56px;
    font-size: 16px;
    cursor: pointer;
`;

const CameraListContainer = styled.div`

`;

const Drawer = styled(StyledDrawer)`
    .ant-drawer-content {
        height: 232px;
    }
    .ant-drawer-body {
        padding: 24px 24px 18px 24px;
    }
`;

const SearchCameraTotalTag = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 60px;
    height: 24px;
    border-radius: 12px;
    padding: 3px 12px 1px 12px;
    margin-left: 8px;
    color: white;
    background-color: #409CFC;
`;

const CameraList = styled(antdList)`
    .ant-list-pagination {
        text-align: left;
        color: white;
        padding-left: 90px;
    }
    .ant-pagination-simple .ant-pagination-simple-pager {
        color: white;
    }
    .ant-pagination-simple .ant-pagination-simple-pager input {
        background-color: transparent;
    }
    .ant-pagination-item-link {
        color: white;
    }

    &.ant-list {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;
    }
    
    .ant-list-pagination {
        margin: 24px 0 24px 0
    }

    .ant-spin-container {
      height: calc(100vh - 64px - 64px - 56px - 74px);
      overflow-y: auto;
    }
`;

const IconButton = styled(Button)`
    &.ant-btn-icon-only {
        width: 24px;
        height: 24px;
        font-size: 12px;
    }
    &.ant-btn-icon-only > * {
        font-size: 12px;
    }
`;

const TotalTag = styled.span`
    font-size: 12px;
    position: absolute;
    color: white;
    bottom: 29px;
    right: 24px;
`;

interface Props {//新增測試
    checkOne: any;
    // sendAndTry: string;
    // cameraItem: any;
    handleCameraSelect_true: Function;
    handleCameraSelect_false: Function;
}

const CameraPanel = (props: Props) => {
    const { apiCaller } = useAxios();

    // const [checkOne, setCheckOne] = useState(0);//溝一個在家一個
    const [searchBarOpen, setSearchBarOpen] = useState(false);
    const {
        showCameraTotalTag,
        setShowCameraTotalTag,
        totalRows,
        setTotalRows,
        currentRangeIndex,
        setCurrentRangeIndex,
        baseCamera,
        setBaseCamera
    } = useStore();

    const { cameraList, setCameraList } = useVideoStore();
    const { cameraSearchState, setCameraSearchState, setCameraPlayItem, cameraPlayItem } = useDashboardStore();

    const maxRangeIndex = Math.ceil(totalRows / 300);
    const totalPages = Math.ceil(totalRows / 12);

    const getCameras = async (action: 'search' | 'init') => {
        switch (action) {
            case 'search':
                {
                    const response = await apiCaller(getCamerasConfig(cameraSearchState) as AxiosRequestConfig);
                    const result: GetCamerasResponse = response.responseData;
                    if (result?.cameras) {
                        debugger;
                        setShowCameraTotalTag(true);
                        setCameraList(result.cameras);
                        setTotalRows(result.totalRows);
                        setCurrentRangeIndex(result.currentRangeIndex);
                        if (!isEmptyData(result.cameras)) {
                            setBaseCamera(result.cameras[0].uuid);
                            if (isEmptyData(cameraPlayItem)) {
                                setCameraPlayItem(result.cameras[0]);
                            }
                        }
                    }
                }
                break;

            case 'init':
                {
                    const response = await apiCaller(getCamerasConfig({}) as AxiosRequestConfig);
                    const result: GetCamerasResponse = response.responseData;
                    if (result.cameras) {
                        setCameraSearchState({});
                        setCameraList(result.cameras);
                        setTotalRows(result.totalRows);
                        setCurrentRangeIndex(result.currentRangeIndex);
                        if (!isEmptyData(result.cameras)) {
                            setBaseCamera(result.cameras[0].uuid);
                        }
                    }
                }
                break;

            default: return;
        }

    };

    useEffect(() => {
        getCameras('search');
    }, []);


    const handleSearchTotalTagClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        getCameras('init');
        setShowCameraTotalTag(false);
        event.stopPropagation();
    };

    const getCamerasWithAction = async (action: 'first' | 'previous' | 'next' | 'last') => {
        const response = await apiCaller(getCamerasConfig({
            base: baseCamera,
            currentRangeIndex: currentRangeIndex,
            action: action
        }) as AxiosRequestConfig);
        const result: GetCamerasResponse = response.responseData;

        if (result.cameras) {
            setCameraList(result.cameras);
            setTotalRows(result.totalRows);
            setCurrentRangeIndex(result.currentRangeIndex);
        }
    };

    const getContainerHeight = () => {
        debugger;
        const getEle = document.getElementById('container');
        console.log(getEle);
        // getEle.style.width = '50%';
    }

    return (
        <Container>
            <CameraFilterBar onClick={() => setSearchBarOpen(!searchBarOpen)}>
                <span>Search Camera</span>
                {showCameraTotalTag &&
                    <SearchCameraTotalTag onClick={(e) => handleSearchTotalTagClick(e)}>
                        {cameraList.length}
                        <CloseOutlined style={{ fontSize: '8px' }} />
                    </SearchCameraTotalTag>
                }
            </CameraFilterBar>

            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <CameraListContainer>
                    <CameraList
                        dataSource={cameraList}
                        pagination={{
                            pageSize: 12,
                            simple: true
                        }}
                        // 這邊可以用setCheckOne的方式傳進去 handleCameraSelect 
                        renderItem={(item) => (//item自己放的變數
                            <CameraCard
                                cameraItem={item as CameraItem}
                            // handleCameraSelect_true={() => { setCheckOne(checkOne + 1) }}
                            // handleCameraSelect_false={() => { setCheckOne(checkOne - 1) }}
                            // checkOne={checkOne}
                            ></CameraCard>)
                        }
                    />
                    {/* {(checkOne === 2) ? getContainerHeight() : 'xx'} */}
                    {/* {console.log(checkOne)} */}
                    { }
                    {/* IconButton是切換頁面的 */}
                    <IconButton
                        disabled={currentRangeIndex === maxRangeIndex}
                        onClick={() => getCamerasWithAction('next')}
                        style={{ position: 'absolute', bottom: '24px', right: 'calc(45px + 35px + 32px)' }}
                        type="link"
                        icon={<DoubleRightOutlined style={{ color: 'white' }} />}
                    />
                    <IconButton
                        disabled={currentRangeIndex === maxRangeIndex}
                        onClick={() => getCamerasWithAction('last')}
                        style={{ position: 'absolute', bottom: '24px', right: 'calc(45px + 35px)' }}
                        type="link"
                        icon={<VerticalLeftOutlined style={{ color: 'white' }} />}
                    />
                    <IconButton
                        disabled={currentRangeIndex === 1}
                        onClick={() => getCamerasWithAction('previous')}
                        style={{ position: 'absolute', bottom: '24px', left: '60px' }}
                        type="link"
                        icon={<DoubleLeftOutlined style={{ color: 'white' }} />}
                    />
                    <IconButton
                        disabled={currentRangeIndex === 1}
                        onClick={() => getCamerasWithAction('first')}
                        style={{ position: 'absolute', bottom: '24px', left: '28px' }}
                        type="link"
                        icon={<VerticalRightOutlined style={{ color: 'white' }} />}
                    />
                    <TotalTag>
                        {`${totalPages} pages`}
                    </TotalTag>
                </CameraListContainer>
                <Drawer
                    destroyOnClose={true}
                    placement="top"
                    closable={false}
                    onClose={() => setSearchBarOpen(false)}
                    visible={searchBarOpen}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                    drawerStyle={{ background: '#293140' }}
                >
                    <SearchCameraPanel />
                </Drawer>
            </div>
        </Container >

    );
};

export default CameraPanel;