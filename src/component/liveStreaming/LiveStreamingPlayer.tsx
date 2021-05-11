import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';

import { addUneditablePolygon, addEditablePolygon, addCanvas, canvasReSize, findPolygon, getPolygonPosition, canvasClear, lineCrossing } from './fabricjs';

import { useVideoStore } from 'src/contexts/videoContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import { dashboardIcon } from 'src/assets/index';
import { StyledSpin } from 'src/atoms/StyledSpin';
import { fabric } from 'fabric';
import { MotionItem } from 'src/interface/api/response/getCameras';

import useAxios from 'src/hooks/useAxios';
import { AxiosRequestConfig } from 'axios';
import { sendSteamHeartbeat } from 'src/api/index';

const Container = styled.div`
    height: 0;
    width: 100%; 
    padding-bottom: 56.25%; 
    position: relative;
    background-color: #222222;
`;

const VideoLoadingDiv = styled.div`
    padding-bottom: 56.25%;
`;

const VideoSnapshotImg = styled.img`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
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

const LiveStreamingPlayer = () => {
    const { cameraPlayItem } = useDashboardStore();
    const { motionList, setMotionList, isMotionEditMode, setSelectedMotionId, selectedCameraSnapshot } = useVideoStore();

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditBySelf, setIsEditBySelf] = useState<boolean>(false);
    const [isFail, setIsFail] = useState<boolean>(false);
    const [modifiedMotionItem, setModifiedMotionItem] = useState<any>();

    const { apiCaller } = useAxios();
    const ref = useRef<HTMLDivElement>(null);

    //當motionList變動時，加入Polygon
    useEffect(() => {
        //console.log('motionListChange: ', motionList);
        //console.log('canvas: ', canvas);
        console.log('isEditBySelf when motionList useEffect:', isEditBySelf);
        if (isEditBySelf) {
            setIsEditBySelf(false);
        } else {
            if (canvas) {
                console.log('canvas._objects: ', canvas._objects);
                canvasClear(canvas);
                drawPolygon();
            }
        }
    }, [motionList, canvas]);

    function drawPolygon() {
        //console.log('motionList', motionList);
        motionList.forEach((item: MotionItem) => {
            if (!findPolygon(canvas, item.motionId)) {
                //console.log('addPolygon');
                //LineCrossing把兩點座標轉換成四點座標
                if (item.motionType === lineCrossing) {
                    let coordinate: { x: number, y: number }[];
                    const centerPoint: { x: number, y: number } = {
                        x: (item.coordinates[1].x + item.coordinates[0].x) / 2,
                        y: (item.coordinates[1].y + item.coordinates[0].y) / 2
                    };
                    console.log('centerPoint: ', centerPoint);
                    const angle = 360 - getAngle(item.coordinates[0].x - centerPoint.x, item.coordinates[0].y - centerPoint.y, 0, -150);
                    console.log('angle: ', angle);
                    coordinate = [
                        { x: centerPoint.x + 2, y: centerPoint.y - 150 },
                        { x: centerPoint.x - 2, y: centerPoint.y - 150 },
                        { x: centerPoint.x - 2, y: centerPoint.y + 150 },
                        { x: centerPoint.x + 2, y: centerPoint.y + 150 }
                    ];
                    //console.log('coordinate: ', coordinate);
                    addPolygon(item.motionId, item.motionName, coordinate, 'edit', item.motionType, angle);
                } else {
                    addPolygon(item.motionId, item.motionName, item.coordinates, 'edit', item.motionType, 0);
                }
                //console.log('canvas?._objects: ', canvas?._objects);
            }
        });
        canvasReSize(canvas, ref.current?.clientWidth, ref.current?.clientHeight);
    }

    function getAngle(x1: number, y1: number, x2: number, y2: number) {
        const dot = x1 * x2 + y1 * y2;
        const det = x1 * y2 - y1 * x2;
        const angle = Math.atan2(det, dot) / Math.PI * 180;
        return (angle + 360) % 360;
    }

    function useWindowSize() {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            function updateSize() {
                setSize([ref.current?.clientWidth as number, ref.current?.clientHeight as number]);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);


        return size;
    }

    const [width, height] = useWindowSize();

    useEffect(() => {
        setIsFail(false);
        setIsLoading(true);

        let heartbeatIntervalId = setInterval(() => {
            console.log(new Date().toISOString() + 'send heartbeat, cameraid:' + cameraPlayItem.uuid);
            apiCaller(sendSteamHeartbeat({ uuid: cameraPlayItem.uuid }) as AxiosRequestConfig, false);
        }, Number(process.env.REACT_APP_STREAMING_HEARTBEAT_FRQUENCY));
        return () => {
            clearInterval(heartbeatIntervalId);
        };
    }, [cameraPlayItem]);

    useEffect(() => {
        //console.log('width: ',width);
        //console.log('height: ',height);
        canvasReSize(canvas, width, height);
    }, [width, height]);

    //進入編輯模式時，加入Canvas
    useEffect(() => {
        if (isMotionEditMode) {
            //setCanvas(addCanvas(ref.current?.clientWidth, ref.current?.clientHeight));
            if (!canvas) {
                setCanvas(addCanvas(ref.current?.clientWidth, ref.current?.clientHeight));
                //canvasReSize(canvas, ref.current?.clientWidth, ref.current?.clientHeight);
            }
        }
        const canvasContainerElement: any = document.getElementsByClassName('canvas-container');
        if (canvasContainerElement[0]) {
            canvasContainerElement[0].style.display = isMotionEditMode ? '' : 'none';
            canvasContainerElement[0].style.top = 0;
        }
    }, [isMotionEditMode]);

    // useEffect(() => { //TODO: 監聽 dom 本身而非 window 大小
    //     if(canvas) {
    //         console.log('width', width);
    //         // console.log('zoon', canvas.getZoom());
    //         // cvs.setDimensions({width: width, height: height}, {cssOnly: true});
    //         const newZoom = canvas.getZoom() + 0.1;
    //         canvas.setZoom(newZoom);
    //         // const canvas = document.getElementById("my-canvas");  
    //         // canvas.setDimensions({width: width, height: height}, {cssOnly: true});
    //         canvas.setHeight(height);
    //         canvas.setWidth(width);
    //         canvas.renderAll();
    //     }
    // }, [ref.current])

    useEffect(() => {
        if (isMotionEditMode) {
            const polygon = modifiedMotionItem;
            //把Polygon的座標寫回motionList
            const _motionList = JSON.parse(JSON.stringify(motionList));
            console.log('origin motionList: ', motionList.map((item: MotionItem) => item.coordinates));
            console.log('modified polygon: ', polygon);

            //避免Polygon修改座標時觸發重畫Polygon
            setIsEditBySelf(true);
            console.log('isEditBySelf:', isEditBySelf);

            _motionList.forEach((item: MotionItem) => {
                if (item.motionId === polygon.id) {
                    item.coordinates = getPolygonPosition(polygon);
                }
            });

            //console.log('polygon2: ', polygon);
            console.log('modified motionList: ', _motionList.map((item: MotionItem) => item.coordinates));
            setMotionList(_motionList);
        }
    }, [modifiedMotionItem]);

    const addPolygon = (id: string, name: string, point: { x: number, y: number }[], mode: string = '', type: string = '', angle: number) => {
        if (canvas) {
            const polygon: any = mode === 'edit' ?
                addEditablePolygon(id, name, point, canvas, type, angle,
                    (polygon: any) => {
                        console.log('setModifiedMotionItem');
                        setModifiedMotionItem({ id: polygon.id, points: polygon.points, type: polygon.type, aCoords: polygon.aCoords });
                    },
                    (polygon: any) => {
                        //將選取的Polygon反應到MotionControlBar
                        setSelectedMotionId(polygon.id);
                    }
                ) : addUneditablePolygon(id, '', point, type);
            if (mode === 'edit') {
                polygon.status = 'new';
            } else {
                polygon.status = 'old';
            }
            canvas.setActiveObject(polygon);
            canvas.add(polygon);
            if (angle !== 0) {
                polygon.rotate(angle);
                canvas.renderAll();
            }
        }
    };

    return (
        <Container id="container" ref={ref}>
            { isFail && !selectedCameraSnapshot &&
                <VideoLoadingDiv>
                    <VideoLoadingSpin
                        size="large"
                        tip='無影像資料'
                        indicator={
                            <img src={dashboardIcon.videoNoData}></img>
                        }
                    />
                </VideoLoadingDiv>
            }
            { isFail && selectedCameraSnapshot &&
                <VideoSnapshotImg src={`data:image/jpeg;base64,${selectedCameraSnapshot}`} />
            }
            { !isFail &&
                <VideoLoadingDiv>
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
                </VideoLoadingDiv>
            }
            < ReactPlayer
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0, display: isLoading ? 'none' : 'block' }}
                // url={`https://www.youtube.com/watch?v=XULUBg_ZcAU${(Math.random() * 10).toFixed()}`}
                url={`https://ec2-52-73-246-3.compute-1.amazonaws.com/hls/${cameraPlayItem.uuid}.m3u8`}
                controls
                playing
                muted
                onPlay={() => setIsLoading(false)}
                onError={() => setIsFail(true)}
            />
            {/* <video controls width="100%" height="100%" preload="none" style={{position: 'absolute', top: 0, left: 0}}>  
                <source src="http://10.35.217.25:1234/hls/test2.m3u8" type="application/x-mpegURL" />
                Your browser does not support the video tag.  
            </video> */}
            <canvas id='my-canvas' style={{ position: 'absolute', border: '1px solid #ccc', width: '100%', height: '100%', display: isMotionEditMode ? '' : 'none' }} />
            {/*<button style={{height:'20px',width:'100px',position: 'absolute'}} onClick = {onClick} >
                button`
        </button>*/}
        </Container>
    );
};

export default LiveStreamingPlayer;