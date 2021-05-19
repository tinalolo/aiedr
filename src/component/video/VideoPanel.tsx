import React from 'react';
import styled from 'styled-components';


import VideoPlayer from 'src/component/video/VideoPlayer';
import { EventItem } from 'src/interface/api/response/getEvents';
import { useDashboardStore } from 'src/contexts/dashboardContext';


const VideoContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 64px - 64px);
    overflow-y: auto;
`;

const VideoPanel = () => {

    const { eventPlayList } = useDashboardStore();
    return (
        <VideoContainer>
            {
                eventPlayList.map((item: EventItem) => <VideoPlayer key={item.eventId} event={item}></VideoPlayer>)
            }
        </VideoContainer>
    );
};

export default VideoPanel;