import * as React from 'react';
import styled from 'styled-components';
import { Table as antdTable, Button as antdButton, Upload, Tooltip } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';


import useAxios from 'src/hooks/useAxios';
import { StyledHeader } from 'src/atoms/StyledHeader';
import { StyledSelect } from 'src/atoms/StyleSelect';
import { StyledInput } from 'src/atoms/StyledInput';
import  useNotification from 'src/hooks/useNotification';
import { getCamerasConfig, putCameraConfig } from 'src/api';
import { AxiosRequestConfig } from 'axios';
import { CameraItem, GetCamerasResponse } from 'src/interface/api/response';
import { useEffect } from 'react';
import { useState } from 'react';
import { GetCamerasRequest } from 'src/interface/api/request';
import { isEmptyData } from 'src/helper/tool';




const Header =  styled(StyledHeader)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 4px 5px #00000063;
    border-top: 4px solid;
    border-image-source: linear-gradient(90deg, #007ADF 0%, #0BBBBA 100%);
    border-image-slice: 1;
`;

const HeaderTitle = styled.div`
    font-size: 24px;
`;

const Body = styled.div`
    height: calc(100vh - 64px - 4em);
    display: flex;
    flex-direction: column;
    padding: 0 60px;
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    height: 72px;
`;

const CamerasStatusDropdown = styled(StyledSelect)`
    width: 144px;
    margin-right: 12px;
    &.ant-select .ant-select-selector {
        border: 2px solid #C8C8C8;
        border-radius: 3px;
    }
`;

const Table = styled(antdTable)`
    .tableInner {
        min-height: calc(100vh - 350px);
    }
    tr:nth-child(odd){
        background: #F0F0F0 ;
    };
    .ant-table-tbody > tr > td {
        padding: 6px 16px;
    }
    .ant-table-cell-fix-right {
        background: transparent;
    }
    thead[class*="ant-table-thead"] th{
        background-color: #3E465D;
        color: white;
        padding: 4px 16px;
    }

    .ant-table .ant-table-tbody > tr:hover > td {
        background: #c5e7ff;
    }
    
    /* .ant-table-cell-scrollbar {
        background-color: #A9B3BF !important;
    } */

`;
const UploadButton = styled(antdButton)`
  &.ant-btn-icon-only {
    border: none;
    background-color: transparent;
    box-shadow: none;
  }
`;

const SearchButton = styled(antdButton)`
    &.ant-btn-primary {
        background: transparent linear-gradient(180deg, #3BACFE 0%, #1384D7 100%) 0% 0% no-repeat padding-box;
        border-radius: 5px;
    }
`;

const CameraNameInput = styled(StyledInput)`
    height: 40px;
    width: 420px; 
    margin-right: 12px;
    border: 2px solid #C8C8C8;
    border-radius: 3px;
`;







const DeviceDirectory = () => {

    const { apiCaller } = useAxios();
    const { openNotificationSuccess, openNotificationError } = useNotification();
    const [cameraList, setCameraList] = useState([] as CameraItem[]);
    const [camerastatus, setCamerastatus] = useState(-1);
    const [cameraName, setCameraName] = useState('');
    const { Option } = StyledSelect;
    
    let cameraSearchState: GetCamerasRequest = {};

    const handleCameraConfigUpdate = (uuid: string, configTag: string) => {
        const _cameraList = JSON.parse(JSON.stringify(cameraList));
        const cameraEditedItem = _cameraList.find((item: CameraItem) => item.uuid === uuid);
        if(cameraEditedItem) {
            cameraEditedItem.configTag = configTag;
            setCameraList(_cameraList);
        }
    };


    const uploadConfigHandler = async (uuid: string, configfile: FormData) => {
        const response = await apiCaller(putCameraConfig({
            uuid: uuid,
            cameraConfig: configfile
        }) as AxiosRequestConfig);

        if(response.responseStatus === 200) {
            openNotificationSuccess({
                message: 'Your settings have been saved.',
                style: {
                    width: 440,
                    fontSize: '16px'
                }
            });
            handleCameraConfigUpdate(uuid, response.responseData?.configTag);
            
            
        } else {
            openNotificationError({
                message: 'Your file upload failed.',
                style: {
                    width: 440,
                    fontSize: '16px'
                }
            });
        }
    };

    const getCameras = async (action: 'search' | 'init') => {
        switch(action) {
            case 'search': 
                {
                    const response = await apiCaller(getCamerasConfig(cameraSearchState) as AxiosRequestConfig);
                    const result : GetCamerasResponse = response.responseData;
                    if( result?.cameras ) {
                        setCameraList(result.cameras);
                    }
                }
                break;
            
            case 'init': 
                {
                    const response = await apiCaller(getCamerasConfig({}) as AxiosRequestConfig);
                    const result : GetCamerasResponse = response.responseData;
                    if( result?.cameras ) {
                        setCameraList(result.cameras);
                    }
                }
                break;
            
            default: return;
        }
        
    };

    const handleSearch = () => {
        cameraSearchState.name = cameraName;
        cameraSearchState.state = camerastatus;
        getCameras('search');
    };

    const columns = [
        {
            title: 'Device Name',
            dataIndex: 'deviceSerialNumber',
            key: 'deviceSerialNumber'
        },
        {
            title: 'Camera Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Status',
            dataIndex: 'deviceState',
            key: 'deviceState',
            render: (status: number) => {
                switch(status) {
                    case 0:
                        return <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{background: '#A5A5A5', borderRadius: '50%', width: '15px', height: '15px',  marginRight: '24px'}}></div>
                            <div style={{color: '#A5A5A5'}}>Offline</div>
                        </div>;
                    case 1:
                        return <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{background: '#00CC60', borderRadius: '50%', width: '15px', height: '15px',  marginRight: '24px'}}></div>
                            <div style={{color: '#00CC60'}}>Online</div>
                        </div>;
                    case 2:
                        return <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{background: '#F2863E', borderRadius: '50%', width: '15px', height: '15px',  marginRight: '24px'}}></div>
                            <div style={{color: '#F2863E'}}>Unknown</div>
                        </div>;
                }
                    
            }
        },
        {
            title: 'Config Tag',
            dataIndex: 'configTag',
            key: 'configTag'
        
        },
        {
            title: 'Latest Update',
            dataIndex: 'configUpdateTime',
            key: 'update'
        },
        {
            title: 'Action',
            key: 'uploadConfig',
            fixed: 'right',
            width: 100,
            render: (cameraItem: CameraItem) => <Upload 
                accept=".json" 
                showUploadList={false}
                beforeUpload={file => {
                    const formData = new FormData();
                    formData.append('cameraConfig', file);
                    console.log('configTag', file);
                    console.log('cameraItem', cameraItem);
                    uploadConfigHandler(cameraItem.uuid, formData);
        
                    // Prevent upload
                    return false;
                }}
            >
                <Tooltip title="Upload Config File">
                    <UploadButton icon={<UploadOutlined />} />
                </Tooltip>
            </Upload>
        }
    ];

   

    useEffect(() => {
        getCameras('init');
    }, []);
    
    return (
        <>
            <Header>
                <HeaderTitle>Device directory</HeaderTitle>
            </Header>
            <Body>
                <SearchContainer>
                    <CameraNameInput placeholder="Enter the device or camera name" onChange={(e) => setCameraName(e.target.value)}/>
                    <CamerasStatusDropdown onChange={(value) => setCamerastatus(Number(value))} defaultValue="-1" size="large">
                        <Option value="-1">All</Option> 
                        <Option value="1">Online</Option> 
                        <Option value="0">Offline</Option> 
                    </CamerasStatusDropdown> 
                    <SearchButton onClick={handleSearch} size="large" type="primary" icon={<SearchOutlined style={{color: 'white'}}/>}>Search</SearchButton>
                </SearchContainer>
                { !isEmptyData(cameraList) &&
                    <Table 
                        columns={columns as any} 
                        dataSource={cameraList} 
                        scroll={{x: 900, y: document.body.clientHeight - 350}} 
                        pagination={{position: ['bottomCenter']}}
                    />
                }
                
            </Body>
        </>
    );
};

export default DeviceDirectory; 