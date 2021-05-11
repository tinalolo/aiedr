import React from 'react';
import styled from 'styled-components';
import { StyledButton } from 'src/atoms/StyledButton';
import { CloseOutlined } from '@ant-design/icons';
import { useVideoStore } from 'src/contexts/videoContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import { dashboardIcon } from 'src/assets';
import { v4 as uuidv4 } from 'uuid';
import { defaultVedioWidth, defaultVedioHeight } from './fabricjs';
import { MotionItem } from 'src/interface/api/response/getCameras';
import useAxios from 'src/hooks/useAxios';
import { putCameraMotionsConfig } from 'src/api';
import { AxiosRequestConfig } from 'axios';


import confirmModalTest from 'src/component/utility/ConfirmModal';
import { isEmptyData } from 'src/helper/tool';
import useNotification from 'src/hooks/useNotification';


const Container = styled.div`
    width: 100%;
    background: #2C303B;
    padding: 16px 24px 0 24px;
`;
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;
const Body = styled.div`
    
`;

const MotionHeader = styled.div`
    display: flex;
    color: #7B8191;
    font-weight: bold;
`;
const MotionDivider = styled.div`
    border-bottom: 3px solid gray;
`;

const MotionBody = styled.div`
`;
const MotionContentDivider = styled.div`
    border-bottom: 1px solid gray;
`;

const CameraInfoContainer = styled.div`
    display: flex;
    margin: 12px 0;
`;
const CameraInfoLeftBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const CameraInfoDivider = styled.div`
    border-left: 1px solid white;
    margin: 0 24px;
    
`;

const CameraInfoRightBox = styled.div`
    display: flex;
    color: white;
`;
const TitleBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-weight: bold;
    margin-right: 16px;
`;

const InfoBox = styled.div`

`;



const CameraName = styled.div`
    color: #00AAAA;
    font-size: 20px;
`;
const CameraStatusTag = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 68px;
    height: 28px;
    color: #1CFFD1;
    border: 2px solid #1CFFD1;
    border-radius: 14px;
    font-size: 12px;
`;


const ButtonsContainer = styled.div`
    display: flex;
    margin: 12px 0;
`;

const MotionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 12px;
    height: 38px;
    padding: 4px 14px;
    background: transparent linear-gradient(180deg, #22D49D 0%, #039F8A 100%) 0% 0% no-repeat padding-box;
    border-radius: 5px;
    border: none;
    color: white;
    font-size: 18px;
    & > img {
        margin-right: 4px;
    }

    /* &.ant-btn, .ant-btn:hover {
        height: 38px;
        padding: 4px 14px;
        background: transparent linear-gradient(180deg, #22D49D 0%, #039F8A 100%) 0% 0% no-repeat padding-box;
        border-radius: 5px;
        border: none;
        color: white;
        font-size: 18px;
    } */
    /* background: transparent linear-gradient(180deg, #22D49D 0%, #039F8A 100%) 0% 0% no-repeat padding-box;
    border-radius: 5px;
    border: none; */
`;
const SaveButton = styled(StyledButton)`
    margin-right: 12px;
    &.ant-btn, .ant-btn:hover {
        height: 38px;
        padding: 4px 14px;
        background: transparent linear-gradient(180deg, #3BACFE 0%, #1384D7 100%) 0% 0% no-repeat padding-box;
        border-radius: 5px;
        border: none;
        color: white;
        font-size: 18px;
    }
`;
const CancelButton = styled(StyledButton)`
    &.ant-btn, .ant-btn:hover {
            height: 38px;
            padding: 4px 14px;
            background: #2C303B;
            border-radius: 5px;
            border: 1px solid #39AAFC;
            color: #39AAFC;
            font-size: 18px;
        }
    
`;

const CameraNormalNameBox = styled.div`
    margin-bottom: 24px;
`;




const MotionControlBar = () => {

    const { motionList, setMotionList, isMotionEditMode, setIsMotionEditMode, cameraList, setCameraList, selectedMotionId } = useVideoStore();
    const { apiCaller } = useAxios();
    const { cameraPlayItem } = useDashboardStore();
    const { openNotificationSuccess } = useNotification();

    const addRegionHandler = () => {
        const _motionList: MotionItem[] = JSON.parse(JSON.stringify(motionList));
        _motionList.push({
            motionId: uuidv4(),
            motionName: `ROI${(_motionList.length > 0 ? _motionList.reduce((accumulator: any, currentValue: any) => accumulator + (currentValue.motionType == 'ROI' ? 1 : 0), 1) : 1).toString()}`,
            coordinates: [
                { x: 0, y: 0 },
                { x: defaultVedioWidth, y: 0 },
                { x: defaultVedioWidth, y: defaultVedioHeight },
                { x: 0, y: defaultVedioHeight }
            ],
            motionType: 'ROI'
        });
        setMotionList(_motionList);
    };

    const addLineHandler = () => {
        const _motionList: MotionItem[] = JSON.parse(JSON.stringify(motionList));
        _motionList.push({
            motionId: uuidv4(),
            motionName: `LineCrossing${(_motionList.length > 0 ? _motionList.reduce((accumulator: any, currentValue: any) => accumulator + (currentValue.motionType == 'lineCrossing' ? 1 : 0), 1) : 1).toString()}`,
            coordinates: [
                { x: 100, y: 100 },
                { x: 100, y: 400 }
            ],
            motionType: 'lineCrossing'
        });
        setMotionList(_motionList);
    };

    const putMotions = async () => {
        const response = await apiCaller(putCameraMotionsConfig({
            uuid: cameraPlayItem?.uuid,
            motions: motionList
        }) as AxiosRequestConfig);

        if (response.responseStatus === 200) {
            openNotificationSuccess({
                message: 'Your settings have been saved.',
                style: {
                    width: 440,
                    fontSize: '16px'
                }
            });
        }
    };

    const motionSaveHandler = () => {
        const _cameraList = JSON.parse(JSON.stringify(cameraList));
        _cameraList.find((item: any) => item.uuid === cameraPlayItem?.uuid).motions = motionList;
        setCameraList(_cameraList);
        putMotions();
    };

    const handleMotionRemove = (motionId: string) => {
        const newMotionList = motionList.filter((item: MotionItem) => item.motionId !== motionId);
        setMotionList(newMotionList);
    };

    const saveHandler = () => {
        motionSaveHandler();
        setIsMotionEditMode(false);
    };

    const cancelHandler = () => {
        confirmModalTest({
            content: 'Do you want to save the setting ?',
            onCancelHandler: () => setIsMotionEditMode(false),
            onOkHandler: saveHandler
        });
    };



    return (
        <div>
            {/* <confirmModalTest 
                {...confirmModal}
            /> */}
            {/* { confirmModal.visible && confirmModalTest({content: 'sdfsdfsd'})} */}
            {!isEmptyData(cameraPlayItem) && (isMotionEditMode ?
                <Container>
                    <Header>
                        <CameraInfoContainer>
                            <CameraInfoLeftBox>
                                <CameraName>{cameraPlayItem?.name}</CameraName>
                                <CameraStatusTag>{cameraPlayItem?.deviceState === 0 ? 'Offline' : 'Online'}</CameraStatusTag>
                            </CameraInfoLeftBox>
                            <CameraInfoDivider />
                            <CameraInfoRightBox>
                                <TitleBox>
                                    <div>Location :</div>
                                    <div>Zone Count :</div>
                                </TitleBox>
                                <InfoBox>
                                    <div>{cameraPlayItem?.location}</div>
                                    <div>{cameraPlayItem?.motions?.length}</div>
                                </InfoBox>
                            </CameraInfoRightBox>
                        </CameraInfoContainer>
                        <ButtonsContainer>
                            <MotionButton onClick={addRegionHandler}>
                                <img src={dashboardIcon.motionAddRegion} />
                            Region
                            </MotionButton>
                            <MotionButton onClick={addLineHandler}>
                                <img src={dashboardIcon.motionAddLineCrossing} />
                            Line Crossing
                            </MotionButton>
                            <SaveButton onClick={saveHandler}>Save</SaveButton>
                            <CancelButton onClick={cancelHandler}>Cancel</CancelButton>
                        </ButtonsContainer>
                    </Header>
                    <Body>
                        <MotionHeader>
                            <div style={{ width: '10%' }}></div>
                            <div style={{ width: '15%' }}>Motion</div>
                            <div style={{ width: '75%' }}>Coordinate</div>
                        </MotionHeader>
                        <MotionDivider />
                        <MotionBody>
                            {
                                isEmptyData(motionList)
                                    ? <div>
                                        <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            no data
                                        </div>
                                    </div>
                                    : motionList.map((item: MotionItem) => {
                                        return (
                                            <div>
                                                <div style={{ display: 'flex', height: '28px', alignItems: 'center' }}>
                                                    <div style={{ width: '10%', textAlign: 'center', color: 'white', cursor: 'pointer' }} onClick={() => handleMotionRemove(item.motionId)}><CloseOutlined style={{ fontSize: '12px' }} /></div>
                                                    <div style={{ width: '15%', color: item.motionId === selectedMotionId ? '#37A8FA' : 'white' }}>{item.motionName}</div>
                                                    {/* <div style={{width: '75%', color: '#37A8FA'}}>{`${JSON.stringify(item.Coordinate.map((o:any)=>{return {x:Math.round(o.x), y:Math.round(o.y)}}))}`}</div> */}
                                                    <div style={{ width: '75%', color: item.motionId === selectedMotionId ? '#37A8FA' : 'white' }}>
                                                        {item.coordinates.map((o: any) => {
                                                            return <span key={o.x}>{`( ${Math.round(o.x)} , ${Math.round(o.y)} ) `}</span>;
                                                        })}
                                                    </div>
                                                </div>
                                                <MotionContentDivider />
                                            </div>
                                        );
                                    })

                            }
                        </MotionBody>

                    </Body>
                </Container>
                : <Container>
                    <CameraNormalNameBox>
                        <CameraName>{cameraPlayItem?.name}</CameraName>
                    </CameraNormalNameBox>
                    <CameraInfoRightBox>
                        <TitleBox>
                            <div>Location :</div>
                        </TitleBox>
                        <InfoBox>
                            <div>{cameraPlayItem?.location}</div>
                        </InfoBox>
                    </CameraInfoRightBox>
                </Container>)
            }


        </div>
    );
};

export default MotionControlBar;