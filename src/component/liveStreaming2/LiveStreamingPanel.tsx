import React from 'react';
import styled from 'styled-components';



//改liveStreaming2
import LiveStreamingPlayer from 'src/component/liveStreaming2/LiveStreamingPlayer';
import MotionControlBar from './MotionControlBar';
import { useVideoStore } from 'src/contexts/videoContext';


const VideoContainer: any = styled.div`
    height: calc(100vh - 64px - 64px);
    /* height: ${(props: any) => (props.changeFifWidth == '3') ? '100vh' : 'calc(100vh - 64px - 64px)'}; */
    overflow-y: auto;
    width: 100%;
    /* width: ${(props: any) => (props.changeFifWidth == '3') ? '50%' : '100%'}; */
    // min-width: 600px;
`;

const TextContainer: any = styled.div`
    /* display:flex;
    flex-wrap: nowrap;
    flex-direction: column; */

    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    &{
        .BigOne{
            flex:0 0 100%
        }
        .BigOther{
            flex:0 0 50%
        }
    }
`;

const OneContainer: any = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
`
const TwoContainer: any = styled.div`
    /* display:flex;
    flex-direction: row;
    flex-wrap: wrap; */

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    flex: 0 0 50%;
`
const ThreeContainer: any = styled.div`
    /* display:flex;
    flex-direction: row;
    flex-wrap: wrap; */

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex: 0 0 50%;
`
const FourContainer: any = styled.div`
    /* display:flex;
    flex-direction: row;
    flex-wrap: wrap; */

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex: 0 0 50%;
`


const LiveStreamingPanel = () => {
    const { checkOne } = useVideoStore();

    return (
        <VideoContainer changeFifWidth={checkOne}>
            <TextContainer>
                { checkOne === 1 || checkOne === 0 ? <><OneContainer><LiveStreamingPlayer className="BigOne" howMany={checkOne} /><MotionControlBar /></OneContainer></> : ''}
                { checkOne === 2 ? 
                    <>
                        <TwoContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /> <MotionControlBar /></TwoContainer>
                        <TwoContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /> <MotionControlBar /></TwoContainer>
                    </>
                    : ''
                }
                { checkOne === 3 ? 
                    <>
                        <ThreeContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </ThreeContainer>
                        <ThreeContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </ThreeContainer>
                        <ThreeContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </ThreeContainer>
                    </>
                    : ''
                }
                { checkOne === 4 ? 
                    <>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                    </>
                    : ''
                }
                { checkOne > 4 ? 
                    <>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                        <FourContainer><LiveStreamingPlayer className="BigOther" howMany={checkOne} /><MotionControlBar /> </FourContainer>
                    </>
                    : ''
                }
            </TextContainer>
            {/* <MotionControlBar /> */}
        </VideoContainer>
    );
};

export default LiveStreamingPanel;
