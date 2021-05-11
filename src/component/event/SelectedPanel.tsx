import React from 'react';
import styled from 'styled-components';
import EventCard from 'src/component/event/EventCard';
import { EventItem } from 'src/interface/api/response/getEvents';
import isempty from 'lodash.isempty';


interface Props {
    selectedEventList: any;  
    handleEventSelect: Function;
    handleEventPlay: Function;
}

const Container = styled.div`

`;

const NoSelectedTemplate = styled.div`
    text-align: center;
    margin-top: 30%;
    font-size: 16px;
    color: white;
`;

const SelectedPanel = (props: Props) => {

    const { selectedEventList, handleEventSelect, handleEventPlay } = props;
    return (
        <Container>
            { 
                isempty(selectedEventList)
                    ? <NoSelectedTemplate>No Seleted</NoSelectedTemplate>
                    : selectedEventList.map((item: EventItem) => {
                        return (
                            <EventCard key={item.eventId} eventItem={item} handleEventSelect={handleEventSelect} handleEventPlay={handleEventPlay} isSelectedCard></EventCard>
                        );
                    })
            }
        </Container>
    );
};

export default SelectedPanel;
