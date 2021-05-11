import React, { useState } from 'react';
import styled from 'styled-components';
import { Moment } from 'moment';
import useAxios from 'src/hooks/useAxios';
import { getEventsConfig } from 'src/api';
import { AxiosRequestConfig } from 'axios';

import { DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { StyledInput } from 'src/atoms/StyledInput';
import { StyledCheckbox } from 'src/atoms/StyledCheckbox';
import { StyledButton } from 'src/atoms/StyledButton';

import { useStore } from 'src/contexts/eventsContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import { GetEventsResponse } from 'src/interface/api/response/getEvents';
import { isEmptyData } from 'src/helper/tool';



const Container = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`; 

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
`;
const CheckBoxContainer = styled.div`
    display: flex;
    width: 260px;
`;
const MotionContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`;
const Text = styled.div`
    margin-right: 16px;
`;

const CameraInput = styled(StyledInput)`

`;

const CheckBox = styled(StyledCheckbox)`
`;

const SearchBarContainer = styled.div`
    width: 100%;
    text-align: center;
`;
const SearchButton = styled(StyledButton)`
    &.ant-btn {
        height: 36px;
        font-size: 16px;
        padding: 5px 45px;  
    }
    
`;


const SearchEventPanel = () => {

    const { apiCaller } = useAxios();
    const { 
        setEventList, 
        setshowEventTotalTag, 
        setBaseEvent,
        setCurrentRangeIndex,
        setTotalRows
    } = useStore();

    const { eventSearchState, setEventSearchState } = useDashboardStore();

    const [startDate, setStartDate] = useState(eventSearchState.since);
    const [endDate, setEndDate] = useState(eventSearchState.until);
    const [cameraName, setCameraName] = useState(eventSearchState.camera);
    const [ROI, setROI] = useState(eventSearchState.eventTypes.roi);
    const [lineCrossing, setLineCrossing] = useState(eventSearchState.eventTypes.crossLine);

    const handleSearchClicked = () => {
        searchEvents();
    };


    const saveSearchState = () => {
        setEventSearchState({
            since: startDate, 
            until: endDate,
            camera: cameraName,
            eventTypes: {roi: ROI, crossLine: lineCrossing}
        });
    };


    const searchEvents = async () => {
        const response = await apiCaller(getEventsConfig({
            since: startDate.valueOf(), 
            until: endDate.valueOf(),
            camera: cameraName,
            eventTypes: {roi: ROI, crossLine: lineCrossing}
            // base: baseEvent,
            // currentRangeIndex: currentRangeIndex
        }) as AxiosRequestConfig);

        setshowEventTotalTag(true);
        const result : GetEventsResponse = response.responseData;
        
        if( result?.events ) {
            saveSearchState();
            setEventList(result.events);
            setTotalRows(result.totalRows);
            setCurrentRangeIndex(result.currentRangeIndex);
            if(!isEmptyData(result.events)) {
                setBaseEvent(result.events[0].eventId);
            }
        }
    };

   

    

    return (
        <Container>
            <InputContainer>
                <Text>Start Date :</Text>
                <DatePicker  
                    value={startDate} 
                    onChange={(date) => setStartDate(date as Moment)}
                    showTime  
                    style={{width: '260px'}}
                />
            </InputContainer>
            <InputContainer>
                <Text>End Date :</Text>
                <DatePicker  
                    value={endDate}  
                    onChange={(date) => setEndDate(date as Moment)}
                    showTime 
                    style={{width: '260px'}}/>
            </InputContainer>
            <InputContainer>
                <Text>Camera :</Text>
                <CameraInput 
                    value={cameraName}
                    onChange={(e) => setCameraName(e.target.value)}
                    placeholder="Enter Camera Name" 
                    style={{width: '260px'}}/>
            </InputContainer>
            <MotionContainer>
                <Text>Motion :</Text>
                <CheckBoxContainer>
                    <CheckBox defaultChecked value={ROI} onChange={(e) => setROI(e.target.checked)}>ROI</CheckBox>
                    <CheckBox defaultChecked value={lineCrossing} onChange={(e) => setLineCrossing(e.target.checked)}>Line Crossing</CheckBox>
                </CheckBoxContainer>
            </MotionContainer>
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