import React from 'react';
import styled from 'styled-components';



import LiveStreamingPlayer from 'src/component/liveStreaming/LiveStreamingPlayer';
import MotionControlBar from './MotionControlBar';


const VideoContainer = styled.div`
    height: calc(100vh - 64px - 64px);
    overflow-y: auto;
    width: 100%;
    min-width: 600px;
`;

const LiveStreamingPanel = () => {

    return (
        <VideoContainer>
            <LiveStreamingPlayer />
            <MotionControlBar />
        </VideoContainer>
    );
};

export default LiveStreamingPanel;
