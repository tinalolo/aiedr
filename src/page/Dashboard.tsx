// 中間右邊dashboard以下包含的page
import React, { useState } from 'react';
import styled from 'styled-components';
import { StyledSwitch } from 'src/atoms/StyledSwitch';
import { StyledText } from 'src/atoms/StyledText';

import EventPanel from 'src/component/event/EventPanel';
import CameraPanel from 'src/component/camera/CameraPanel';
import { EventProvider } from 'src/contexts/eventsContext';
import { CameraProvider } from 'src/contexts/cameraContext';
import { VideoProvider } from 'src/contexts/videoContext';
import { StyledHeader } from 'src/atoms/StyledHeader';
import VideoPanel from 'src/component/video/VideoPanel';
import LiveStreamingPanel from 'src/component/liveStreaming/LiveStreamingPanel';


const Body = styled.div`
    background: rgba(0,0,0,0.1);
    height: calc(100vh - 64px - 4em);
    display: flex;
`;

const Header = styled(StyledHeader)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 4px  solid #007ADF;
`;

const VideoContainer = styled.div`
    flex-grow: 1;
    background-color: #2C303B;
`;

const SearchList = styled.div`
    min-width: 414px;
`;

const Switch = styled(StyledSwitch)`
    &.ant-switch {
        background-color: #3B86FC ;
    }

    &.ant-switch-checked {
        background-color: #00AAAA ;
    }
`;

const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
`;

const LiveText: any = styled(StyledText)`
    margin-left: 12px;
    font-weight: bold;
    color: ${(prop: any) => prop.isEventPanel === true ? '#00AAAA' : '#3E465D'};
`;

const EventText: any = styled(StyledText)`
    margin-right: 12px;
    font-weight: bold;
    color: ${(prop: any) => prop.isEventPanel === true ? '#3E465D' : '#3B86FC'};
`;

const HeaderTitle = styled.div`
    font-size: 24px;
`;


const DashBoard = () => {

    const [isEventPanel, setIsEventPanel] = useState(false);

    return (
        <>
            <Header>
                <HeaderTitle>Dashboard</HeaderTitle>
                <SwitchContainer>
                    <EventText isEventPanel={isEventPanel}>Event</EventText>
                    <Switch onChange={() => setIsEventPanel(!isEventPanel)} />
                    <LiveText isEventPanel={isEventPanel}>Live</LiveText>
                </SwitchContainer>
            </Header>
            <Body>
                <VideoProvider>
                    {/* //左邊塊 */}
                    <VideoContainer>
                        {/* <FormattedMessage id='hello'/> */}
                        {!isEventPanel
                            ? <VideoPanel></VideoPanel>
                            : <LiveStreamingPanel></LiveStreamingPanel>
                        }

                    </VideoContainer>
                    {/* //右邊塊 */}
                    <SearchList>
                        {!isEventPanel
                            ? <EventProvider>
                                <EventPanel />
                            </EventProvider>
                            : <CameraProvider>
                                <CameraPanel />
                            </CameraProvider>
                        }
                    </SearchList>
                </VideoProvider>
            </Body>
        </>
    );
};

export default DashBoard;