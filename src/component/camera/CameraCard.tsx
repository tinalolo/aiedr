import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AxiosRequestConfig } from 'axios';
import { StyledCheckbox } from 'src/atoms/StyledCheckbox';

import useAxios from 'src/hooks/useAxios';
import { useVideoStore } from 'src/contexts/videoContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import { dashboardIcon } from 'src/assets/index';
import { CameraItem } from 'src/interface/api/response/getCameras';
import { enableStreaming } from 'src/api/index';
import { configConsumerProps } from 'antd/lib/config-provider';

export enum CameraStatus {
    offline = 0,
    online,
    unknown
}

const { cameraCardEditZoneDefault, cameraCardEditZone } = dashboardIcon;


const Container: any = styled.div`
    display: flex;
    width: 100%;
    height: 84px;
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
// const CheckBox: any = (props: any) => {
//     if(props.active) {
//         return styled(StyledCheckbox)`
//             .ant-checkbox-inner {
//                 border-radius: 50%;
//                 background: #5C698D;
//                 border: 1px solid #747D95;
//             }  
//         `;
//     } else {
//         return styled(StyledCheckbox)`
//             .ant-checkbox-inner {
//                 border-radius: 50%;
//             }  
//         `;
//     }
// };

const CheckBoxOnline = styled(StyledCheckbox)`
    .ant-checkbox-inner {
        // border-radius: 50%;
    }  
`;

const CheckBoxOffline = styled(StyledCheckbox)`
    .ant-checkbox-inner {
        // border-radius: 50%;
        background: #5C698D;
        border: 1px solid #747D95;
    }  

    .ant-checkbox-checked {
        .ant-checkbox-inner {
            background-color: #1890ff;
            border-color: #1890ff;
        }
    }
`;




const InfoContainer = styled.div`
    padding:  12px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
`;
// const TimeContainer = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
// `;
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

const EditArea: any = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
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

const EditCameraButtonIcon = styled.img`
`;

const MotionCount = styled.div`
    position: absolute;
    bottom: 6px;
    left: 20px;
`;

const CameraStatusSight: any = styled.div`
    align-self: center;
    margin: 0 4px 0 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props: any) => props.status ? '#13FF2A' : '#5C698D'};
`;

// const cameraStatusSight = (state: number) => {
//     switch(state) {
//         case CameraStatus.offline :
//             return styled.div`
//                 align-self: center;
//                 margin: 0 4px 0 4px;
//                 width: 16px;
//                 height: 16px;
//                 border-radius: 50%;
//                 background: #5C698D;
//             `;

//         case CameraStatus.online :
//             return styled.div`
//                 align-self: center;
//                 margin: 0 4px 0 4px;
//                 width: 16px;
//                 height: 16px;
//                 border-radius: 50%;
//                 background: #13FF2A;
//         `;

//         case CameraStatus.unknown :
//             return '';
//     }
// };


/* background: ${(props: any) => {
        switch(props.status) {
            case CameraStatus.offline :
                return '#5C698D';

            case CameraStatus.online :
                return '#13FF2A';

            case CameraStatus.unknown :
                return '';
            
            default: return '';
        }
    }} */

const CheckBox = styled(StyledCheckbox)`
`;

interface Props {
    cameraItem: CameraItem;
    // checkOne: any;
    // handleCameraSelect_true: Function;
    // handleCameraSelect_false: Function;
}


const CameraCard = (props: Props) => {
    const { cameraItem } = props;
    const { apiCaller } = useAxios();

    // const [checkOne, setCheckOne] = useState(0);//溝一個在家一個
    const { setIsMotionEditMode, setMotionList, setSelectedCameraSnapshot, snapshots, setCheckOne, checkOne } = useVideoStore();
    const { cameraPlayItem, setCameraPlayItem } = useDashboardStore();

    const isSelected = cameraItem.uuid === cameraPlayItem?.uuid;
    const motionCount = cameraItem.motions.length;

    const handleCameraClicked = async (items:any) => {
        const { uuid, deviceSerialNumber } = cameraItem;
        // cameraItem
        debugger;
        // setCameraPlayItem(
        //     {
        //         motions: 'MotionItem[]',
        //         uuid: '123',
        //         name: 'string',
        //         location: 'string',
        //         deviceState: 0 | 1 | 2,
        //         deviceSerialNumber: 'string',
        //         editRangeCount: 2,
        //         configTag: 'string'
        //     }
        // )
        setCameraPlayItem(cameraItem);//影響顯示的資料
        console.log('snapshots', snapshots);

        if (snapshots.get(uuid)) {//成功抓到進來
            setSelectedCameraSnapshot(snapshots.get(uuid));
            apiCaller(enableStreaming({ serialNumber: deviceSerialNumber, cameraUuid: uuid }) as AxiosRequestConfig, false);
            // apiCaller(enableStreaming({ serialNumber: 'unit-test-sameple1', cameraUuid: '569d5af0-5614-11eb-ae93-0242ac130001' }) as AxiosRequestConfig, false);
        } else {
            setSelectedCameraSnapshot(undefined);
            // (config = {} as AxiosRequestConfig, hasSpin: boolean = true)
            const result = await apiCaller(enableStreaming({ serialNumber: deviceSerialNumber, cameraUuid: uuid }) as AxiosRequestConfig, false);
            // const result = await apiCaller(enableStreaming({ serialNumber: 'unit-test-sameple1', cameraUuid: '569d5af0-5614-11eb-ae93-0242ac130001' }) as AxiosRequestConfig, false);
            const { snapshot } = result.responseData;//從useAxios來的
            if (!snapshots.get(uuid) && snapshot !== undefined) {
                snapshots.set(uuid, snapshot);
                setSelectedCameraSnapshot(snapshot);
                // let testSnapshot = '...';
                // snapshots.set(uuid, testSnapshot);
                // setSelectedCameraSnapshot(testSnapshot);
                // console.log('image: ', testSnapshot.length);
            }
        }
    };

    const handleCameraSelect_true = (e:any) => {
        debugger;
        setCheckOne(checkOne + 1)
        handleCameraClicked(e.target)
    }

    const handleCameraSelect_false = (e:any) => {
        setCheckOne(checkOne - 1)
        handleCameraClicked(e.target)
    }

    const handleMotionEdit = () => {
        setIsMotionEditMode(true);
        setMotionList(cameraItem.motions || []);
    };

    useEffect(() => {
        return () => {
            setIsMotionEditMode(false);
        };
    }, []);

    //console.log('motionList', motionList);




    return (
        <Container isShowVideo={isSelected}>{/*// 原本有 onClick={handleCameraClicked}*/}
            {/* <CheckBoxContainer>
                <CheckBox defaultChecked value={ROI} onChange={(e) => setROI(e.target.checked)}>ROI</CheckBox>
                <CheckBox defaultChecked value={lineCrossing} onChange={(e) => setLineCrossing(e.target.checked)}>Line Crossing</CheckBox>
            </CheckBoxContainer> */}
            <CheckBoxContainer>
                {/* //cameraItem.deviceState=0.1.2 */}
                {/* {cameraItem.deviceState === CameraStatus.online ?
                    <CheckBoxOnline checked={isSelected} /> :
                    <CheckBoxOffline checked={isSelected} />
                } */}
                {/* {console.log(cameraItem.deviceState)}//0
                {console.log(CameraStatus.online)}//1 */}
                <CheckBox value={cameraItem.uuid}
                    onChange={(e) => {//從cameraPanel傳進來的handleCameraSelect
                        e.target.checked ? handleCameraSelect_true(e) : handleCameraSelect_false(e)
                    }}>
                </CheckBox>
            </CheckBoxContainer>
            <InfoContainer>
                <Text>{cameraItem.name}</Text>
                <Text>{cameraItem.location}</Text>
            </InfoContainer>
            {/* //亮燈狀態 */}
            <CameraStatusSight status={cameraItem.deviceState} />
            {/* 顯示右邊的數字 */}
            {
                <EditArea isShowVideo={isSelected} onClick={handleMotionEdit}>
                    <EditCameraButtonIcon src={motionCount ? cameraCardEditZone : cameraCardEditZoneDefault}></EditCameraButtonIcon>
                    <MotionCount>{motionCount}</MotionCount>
                </EditArea>
            }
        </Container>
    );
};

export default CameraCard;