
import React from 'react';
import styled from 'styled-components';
// import { StyledSwitch } from 'src/atoms/StyledSwitch';
// import { StyledText } from 'src/atoms/StyledText';
// import { StyledHeader } from 'src/atoms/StyledHeader';

import { VideoProvider } from 'src/contexts/videoContext';
import VideoPanel from 'src/component/video/VideoPanel';
import { EventProvider } from 'src/contexts/eventsContext';
import EventPanel from 'src/component/event/EventPanel';



// const Header = styled(StyledHeader)`
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     border-top: 4px  solid #007ADF;
// `;

// const HeaderTitle = styled.div`
//     font-size: 24px;
// `;

// const SwitchContainer = styled.div`
//     display: flex;
//     align-items: center;
// `;

// const EventText: any = styled(StyledText)`
//     margin-right: 12px;
//     font-weight: bold;
//     color: ${(prop: any) => prop.isEventPanel === true ? '#3E465D' : '#3B86FC'};
// `;

// const Switch = styled(StyledSwitch)`
//     &.ant-switch {
//         background-color: #3B86FC ;
//     }

//     &.ant-switch-checked {
//         background-color: #00AAAA ;
//     }
// `;

// const LiveText: any = styled(StyledText)`
//     margin-left: 12px;
//     font-weight: bold;
//     color: ${(prop: any) => prop.isEventPanel === true ? '#00AAAA' : '#3E465D'};
// `;

const Body = styled.div`
    background: rgba(0,0,0,0.1);
    height: calc(100vh - 64px - 4em);
    display: flex;
`;

const VideoContainer = styled.div`
    flex-grow: 1;
    background-color: #2C303B;
`;

const SearchList = styled.div`
    min-width: 414px;
`;

const Event = () => {
    // const [isEventPanel, setIsEventPanel] = useState(false);

    return (
        <>
            {/* <Header>
                <HeaderTitle>Dashboard</HeaderTitle>
                <SwitchContainer>
                    <EventText isEventPanel={isEventPanel}>Event</EventText>
                    <Switch onChange={() => setIsEventPanel(!isEventPanel)} />
                    <LiveText isEventPanel={isEventPanel}>Live</LiveText>
                </SwitchContainer>
            </Header> */}
            <Body>
                <VideoProvider>
                    {/* //新的左邊塊 */}
                    <SearchList>
                        <EventProvider>
                            <EventPanel />
                        </EventProvider>
                    </SearchList>
                    {/* //新的右邊塊 */}
                    <VideoContainer>
                        {/* <FormattedMessage id='hello'/> */}
                        <VideoPanel></VideoPanel>
                    </VideoContainer>
                </VideoProvider>
            </Body>
        </>
    );
};

export default Event; 