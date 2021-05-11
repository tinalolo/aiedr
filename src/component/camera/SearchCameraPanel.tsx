import React, { useState } from 'react';
import styled from 'styled-components';
import { AxiosRequestConfig } from 'axios';
import { SearchOutlined } from '@ant-design/icons';

import useAxios from 'src/hooks/useAxios';
import { getCamerasConfig } from 'src/api';
import { useVideoStore } from 'src/contexts/videoContext';
import { StyledInput } from 'src/atoms/StyledInput';
import { StyledButton } from 'src/atoms/StyledButton';
import { StyledRadio } from 'src/atoms/StyledRadio';
import { useStore } from 'src/contexts/cameraContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import { GetCamerasResponse } from 'src/interface/api/response/getCameras';
import { isEmptyData } from 'src/helper/tool';



const Container = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    height: 100%;
`; 

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
`;

const Text = styled.div`
    margin-right: 16px;
`;

const CameraInput = styled(StyledInput)`

`;

const SearchBarContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: 100%;
`;
const SearchButton = styled(StyledButton)`
    &.ant-btn {
        height: 36px;
        font-size: 16px;
        padding: 5px 45px;  
    }   
`;

const RadioContainer = styled.div`
    margin: 12px 40px 16px 0;
`;

const CameraStatusRadio = styled(StyledRadio)`
`;

const CameraStatusRadioOptions = [
    { label: 'All', value: -1, style: {color: 'white'}},
    { label: 'Online', value: 1, style: {color: 'white'} },
    { label: 'Offline', value: 0, style: {color: 'white'} }
];


const SearchEventPanel = () => {

    const { apiCaller } = useAxios();
    const { 
        setShowCameraTotalTag,
        setTotalRows,
        setCurrentRangeIndex,
        setBaseCamera
    } = useStore();
    const { setCameraList } = useVideoStore();
    const { cameraSearchState, setCameraSearchState } = useDashboardStore();

    const [cameraName, setCameraName] = useState(cameraSearchState.name);
    const [location, setLocation] = useState(cameraSearchState.location);
    const [cameraStatus, setCameraStatus] = useState(cameraSearchState.deviceState);

    const handleSearchClicked = () => {
        searchCameras();
    };


    const searchCameras = async () => {
        setShowCameraTotalTag(true);

        const params = cameraStatus === -1 ? {
            name: cameraName,
            location: location
        } : {
            name: cameraName,
            location: location,
            state: cameraStatus
        };

        const response = await apiCaller(getCamerasConfig(params) as AxiosRequestConfig);
        const result : GetCamerasResponse = response.responseData;

        if( result.cameras ) {
            setCameraSearchState({
                name: cameraName,
                location: location
            });
            setCameraList(result.cameras);
            setTotalRows(result.totalRows);
            setCurrentRangeIndex(result.currentRangeIndex);
            if(!isEmptyData(result.cameras)) {
                setBaseCamera(result.cameras[0].uuid);
            }
        }
    };

   

    

    return (
        <Container>
            <InputContainer>
                <Text>Location :</Text>
                <CameraInput 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter Keywords" 
                    style={{width: '260px'}}
                />
            </InputContainer>
            <InputContainer>
                <Text>Camera :</Text>
                <CameraInput 
                    value={cameraName}
                    onChange={(e) => setCameraName(e.target.value)}
                    placeholder="Enter Camera Name" 
                    style={{width: '260px'}}
                />
            </InputContainer>
            <RadioContainer>
                <CameraStatusRadio.Group 
                    options={CameraStatusRadioOptions}
                    onChange={(e) => setCameraStatus(e.target.value)}
                    value={cameraStatus}
                    style={{ color: 'white'}}
                />
            </RadioContainer>
            <SearchBarContainer>
                <SearchButton 
                    onClick={handleSearchClicked} 
                    type="primary" 
                    icon={<SearchOutlined />}
                >
                    Search
                </SearchButton>
            </SearchBarContainer>
        </Container>
    );
};

export default SearchEventPanel;