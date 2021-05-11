import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { StyledCheckbox } from 'src/atoms/StyledCheckbox';
import { MinusOutlined } from '@ant-design/icons';
import { EventItem } from 'src/interface/api/response/getEvents';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import { isEmptyData } from 'src/helper/tool';


interface Props {
    isSelectedCard?: boolean; //是不是 SelectedPanel 的 card
    eventItem: EventItem;
    handleEventSelect: Function;
    handleEventPlay?: Function;
}

enum EventTypes {
    LineCross = 'Line Cross',
    ROI = 'ROI',
    Unknow = 'Unkonw'
}

const Container: any = styled.div`
    display: flex;
    width: 100%;
    height: 88px;
    background: ${(props: any) => props.isShowVideo ? '#2A7474' : '#3E465D'};
    opacity: 1;
    cursor: pointer;
    margin-bottom: 2px;
`;

const CheckBoxContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 68px;
    height: 100%;
`;
const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding:  12px 0px;
    width: calc(100% - 68px - 48px);
`;
const TimeContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CameraContainer = styled.div`
`;
const MotionContainer = styled.div`
    display: flex;
    align-items: center;
`;

// const VideoLengthTab = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 96px;
//     height: 25px;
//     background: #293140;
//     color: white;
//     border-radius: 20px;
//     opacity: 1;
// `;
const Text = styled.div`
    font-size: 16px;
    color: white;
`;
const DeleteArea: any = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: green;
    width: 48px;
    font-size: 16px;
    color: white;
    background: ${(props: any) => props.isShowVideo ? '#2A7474' : '#3E465D'};
    &:hover {
        background: ${(props: any) => props.isShowVideo ? '#449E9E' : '#5C698D'};
    }
`;


const EventCard = (props: Props) => {
    const { isSelectedCard, eventItem, handleEventSelect, handleEventPlay } = props;

    // const { selectedEventList } = useStore();

    const { 
        selectedEventList,
        eventPlayList
    } = useDashboardStore();


    const handleEventClick = () => {
        if(isSelectedCard) {
            handleEventPlay && handleEventPlay(eventItem);
        } else {
            handleEventSelect(eventItem.eventId);
        }
       
    };

    const handleSelectedState = () => {
        if(isEmptyData(selectedEventList)) {
            return false;
        } else {
            return selectedEventList.map((item: EventItem) => item.eventId).includes(eventItem.eventId);
        }
    };

    const handlePlayingState = () => {
        if(isEmptyData(eventPlayList)) {
            return false;
        } else {
            return eventPlayList.map((item: EventItem) => item.eventId).includes(eventItem.eventId);
        }
    };

    const getEventType = (eventType: string) => {
        let result = EventTypes.Unknow;
        switch (eventType) {
            case 'line_cross':
                result = EventTypes.LineCross;
                break;
            case 'roi':
                result = EventTypes.ROI;
                break;
        }
        return result;
    };
    

    return (
        <Container isShowVideo={isSelectedCard && handlePlayingState()} onClick={handleEventClick}>
            <CheckBoxContainer>
                <StyledCheckbox checked={isSelectedCard ? handlePlayingState() : handleSelectedState()}/>
            </CheckBoxContainer>
            <InfoContainer>
                <TimeContainer>
                    <Text>{`${moment(eventItem.eventSince).local().format('YYYY/MM/DD HH:mm:ss')}`}</Text>
                    {/* <VideoLengthTab>00:00:08</VideoLengthTab>  */}
                </TimeContainer>
                <CameraContainer>
                    <Text>{eventItem.camera}</Text>
                    <MotionContainer>
                        {<Text>{getEventType(eventItem.eventType)}</Text>}
                    </MotionContainer>
                </CameraContainer>
            </InfoContainer>
            {
                isSelectedCard 
                    ?   <DeleteArea isShowVideo={handlePlayingState()} onClick={(e: any) => handleEventSelect(eventItem.eventId, e)}>
                        <MinusOutlined />
                    </DeleteArea>
                    :   <div style={{width: '48px'}}></div>
            }
        </Container>
    );
};

export default EventCard;