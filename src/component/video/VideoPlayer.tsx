import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';

import useAxios from 'src/hooks/useAxios';
import { AxiosRequestConfig } from 'axios';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import { EventItem } from 'src/interface/api/response/getEvents';
import { getEventVideoConfig } from 'src/api';
import { StyledSpin } from 'src/atoms/StyledSpin';
import { dashboardIcon } from 'src/assets/index';

interface Props {
    event: EventItem;
}

const CameraInfoContainer = styled.div`
    padding: 24px 0 0 48px;
`;
const CameraInfoBox = styled.div`
    display: flex;
`;

const CameraTitle = styled.div`
    display: flex;
    align-items: center;
    color: #00AAAA;
    margin-bottom: 8px;
    font-size: 20px;
`;
const CameraInfo = styled.div`
    display: flex;
    color: white;
    font-size: 16px;
    margin-top: 8px;
`;
const CameraSubTitleBox = styled.div`
    margin-right: 16px;
    
`;

const CameraSubTitle = styled.div`
    font-weight: bold;
    margin-bottom: 24px;
`;

const DescriptionBox = styled.div`

`;
const Description = styled.div`
    margin-bottom: 24px;
`;

// const VideoLengthTab = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 96px;
//     height: 25px;
//     background: #222222;
//     color: white;
//     border-radius: 20px;
//     opacity: 1;
//     margin-bottom: 20px;
// `;

// const CameraTitleDivider = styled.div`
//     margin: 0 8px 0 8px; 
//     border-left: 1px solid #00AAAA; 
//     height: 20px;
// `;

// const CameraInfoDivider = styled.div`
//     margin: 0 32px 0 32px; 
//     border-left: 1px solid #fcf8f8; 
//     height: 140px;
// `;

// const EventDetectedText = styled.div`
//     margin-bottom: 10px;
// `;

// const EventDetectedBox = styled.div`
//     display: flex;
// `;

const VideoContainer = styled.div`
    height: 0;
    width: 100%; 
    padding-bottom: 56.25%; 
    position: relative;
`;

const VideoLoadingSpin = styled(StyledSpin)`
    position: absolute;
    left: 50%;
    top: 50%;
    color: #B4B4B4;
    transform: translate(-50%, -50%);

    &.ant-spin-lg .ant-spin-dot {
        font-size: 80px;
    }

    @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }
`;

const VideoLoadingIcon = styled.img`
    position: absolute;
    left: 0;
    top: 0;
`;

// const EventText = styled.div`
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `;


const VidioPlayer = (props: Props) => {
    const { event } = props;
    const { eventPlayList } = useDashboardStore();
    const { apiCaller } = useAxios();
    const [videoSource, setVideoSource] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFail, setIsFail] = useState<boolean>(false);

    const cancelSource = axios.CancelToken.source();

    const getEventVideo = async () => {
        const response = await apiCaller({
            ...getEventVideoConfig({
                deviceSerialNumber: event.deviceSerialNumber,
                filename: event.videoPath
            }),
            cancelToken: cancelSource.token
        } as AxiosRequestConfig, false);

        if (response.responseStatus < 400 && response.responseData.size > 0) {
            setVideoSource(window.URL.createObjectURL(response.responseData));
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setIsFail(true);
        }
    };

    useEffect(() => {
        getEventVideo();

        return () => cancelSource.cancel('Cancel to get the video');
    }, []);

    useEffect(() => {
        return () => {
            if (videoSource !== '') {
                URL.revokeObjectURL(videoSource);
            }
        };
    }, [videoSource]);

    return (
        <div style={eventPlayList.length === 1 ? {width: '100%'} : {width: '50%'}}>
            <VideoContainer>
                {isFail && !isLoading &&
                    <VideoLoadingSpin
                        size="large"
                        tip='無影像資料'
                        indicator={
                            <img src={dashboardIcon.videoNoData}></img>
                        }
                    />
                }
                {isLoading &&
                    <VideoLoadingSpin
                        size="large"
                        tip='影像讀取中...'
                        indicator={
                            <div>
                                <VideoLoadingIcon src={dashboardIcon.videoLoadingCamera} style={{
                                    top: '6px',
                                    left: '4px'
                                }} />
                                <VideoLoadingIcon src={dashboardIcon.videoLoadingCircle} style={{
                                    animationName: 'spin',
                                    animationDuration: '5000ms',
                                    animationIterationCount: 'infinite',
                                    animationTimingFunction: 'linear',
                                    height: '100%',
                                    width: '100%'
                                }}
                                />
                            </div>
                        }
                    />
                }
                {!isLoading && !isFail &&
                    <video
                        autoPlay
                        controls
                        src={videoSource}
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        onPlay={() => setIsLoading(false)}
                        // onPlaying={() => console.log('Playing')}
                        // onCanPlay={() => console.log('Can play')}
                        // onLoad={() => console.log('Load')}
                        // onLoadStart={() => console.log('Load Start')}
                        // onLoadedData={() => console.log('Loaded Data')}
                        // onPause={() => console.log('pause')}
                        // onAbort={() => console.log('abort')}
                        onError={() => setIsFail(true)}
                    >
                        Your browser does not support the video tag.
                    </video>
                } 
            </VideoContainer>
            {   eventPlayList.length === 1 &&
                <CameraInfoContainer>
                    <CameraTitle>
                        <div>{event.camera}</div>  
                    </CameraTitle>
                    <CameraInfoBox>
                        <CameraInfo>
                            <CameraSubTitleBox>
                                <CameraSubTitle>Date : </CameraSubTitle>
                                {/* <CameraSubTitle>Duration : </CameraSubTitle> */}
                                <CameraSubTitle>Motion :</CameraSubTitle>
                            </CameraSubTitleBox>
                            <DescriptionBox>
                                <Description>{moment(event.eventSince).local().format('YYYY/MM/DD HH:mm:ss')}</Description>
                                {/* <VideoLengthTab>00:00:08</VideoLengthTab> */}
                                <Description>{event.eventType}</Description>
                            </DescriptionBox>
                        </CameraInfo>
                        {/* <CameraInfoDivider /> */}
                        {/* <CameraInfo>
                            <CameraSubTitleBox>
                                <CameraSubTitle>Event Detected : </CameraSubTitle>
                            </CameraSubTitleBox>
                            <DescriptionBox>
                                <EventDetectedText>person</EventDetectedText>
                                <EventDetectedText>chair</EventDetectedText>
                                <EventDetectedText>oven</EventDetectedText>
                                <EventDetectedText>pottedplant</EventDetectedText>
                            </DescriptionBox>
                            <DescriptionBox>
                                <EventDetectedText>80.01%</EventDetectedText>
                                <EventDetectedText>31.65%</EventDetectedText>
                                <EventDetectedText>44.33%</EventDetectedText>
                                <EventDetectedText>41.17%</EventDetectedText>
                            </DescriptionBox>
                        </CameraInfo> */}
                    </CameraInfoBox>   
                </CameraInfoContainer>}
            {   (eventPlayList.length !== 1) &&
                    <CameraInfoContainer>
                        <CameraTitle>
                            <div>{event.camera}</div>  
                            {/* <CameraTitleDivider></CameraTitleDivider> */}
                            {/* <EventText style={{maxWidth: '200px'}}>{`Event - ${event.eventId}`}</EventText>  */}
                        </CameraTitle>
                        <CameraInfoBox>
                            <CameraInfo>
                                <CameraSubTitleBox>
                                    <CameraSubTitle>Date : </CameraSubTitle>
                                    {/* <CameraSubTitle>Duration : </CameraSubTitle> */}
                                    <CameraSubTitle>Motion :</CameraSubTitle>
                                    {/* { eventPlayList.length === 2 && <CameraSubTitle>Event Detected : </CameraSubTitle>} */}
                                </CameraSubTitleBox>
                                <DescriptionBox>
                                    <Description>{moment(event.eventSince).local().format('YYYY/MM/DD HH:mm:ss')}</Description>
                                    {/* <VideoLengthTab>00:00:08</VideoLengthTab> */}
                                    <Description>{event.eventType}</Description>
                                    {/* {  eventPlayList.length === 2 &&
                                        <EventDetectedBox>
                                            <DescriptionBox>
                                                <EventDetectedText>person</EventDetectedText>
                                                <EventDetectedText>chair</EventDetectedText>
                                                <EventDetectedText>oven</EventDetectedText>
                                                <EventDetectedText>pottedplant</EventDetectedText>
                                            </DescriptionBox>
                                            <DescriptionBox>
                                                <EventDetectedText>80.01%</EventDetectedText>
                                                <EventDetectedText>31.65%</EventDetectedText>
                                                <EventDetectedText>44.33%</EventDetectedText>
                                                <EventDetectedText>41.17%</EventDetectedText>
                                            </DescriptionBox>
                                        </EventDetectedBox>
                                    } */}
                                </DescriptionBox>
                            </CameraInfo>
                        </CameraInfoBox>   
                    </CameraInfoContainer>
            }
        </div>
    );
};

export default VidioPlayer;