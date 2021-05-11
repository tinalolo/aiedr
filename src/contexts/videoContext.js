import React, { useState, createContext, useContext } from 'react';

export const Context = createContext();

export const useVideoStore = () => useContext(Context);

/**
 * video panel related data, including event and liveStream data
 * 
 */

export const VideoProvider = ({ children }) => {
    //event related data
    const [eventPlayList, setEventPlayList] = useState([]);
    const [isMotionEditMode, setIsMotionEditMode] = useState(false);

    //liveStream related data
    const [motionList, setMotionList] = useState([]);
    const [selectedMotionId, setSelectedMotionId] = useState('');

    //cameraList related data
    const [cameraList, setCameraList] = useState([]);


    const [snapshots, setSnapshots] = useState(new Map());
    const [selectedCameraSnapshot, setSelectedCameraSnapshot] = useState();

    //勾選累加
    const [checkOne, setCheckOne] = useState(0);


    /*useEffect(() => {
        console.log('test: ', motionList);

        return (lastValue) => {
            console.log('last value: ', lastValue);
        };
    }, [motionList]);*/

    return (
        <Context.Provider
            value={{
                eventPlayList,
                setEventPlayList,
                motionList,
                setMotionList,
                isMotionEditMode,
                setIsMotionEditMode,
                cameraList,
                setCameraList,
                selectedMotionId,
                setSelectedMotionId,
                selectedCameraSnapshot,
                setSelectedCameraSnapshot,
                snapshots,
                setSnapshots,
                checkOne,
                setCheckOne
            }}
        >
            {children}
        </Context.Provider>
    );
};
