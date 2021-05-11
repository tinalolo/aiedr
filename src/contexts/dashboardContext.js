import React, { useState, createContext, useContext } from 'react';
import moment from 'moment';

export const Context = createContext();

export const useDashboardStore = () => useContext(Context);



export const DashboardProvider = ({ children }) => {

    const initSinceDate = moment().subtract(1, 'days');
    const initUntilDate = moment();

    const initEventSearchState = { 
        since: initSinceDate,
        until: initUntilDate,
        camera: '',
        eventTypes: {
            roi: true, 
            crossLine: true
        }
    };

    const initCameraSearchState = {
        name: '',
        location: '',
        deviceState: 1
    };

    const eventSearchInit = () => {
        setEventSearchState(initEventSearchState);
    };

    const [selectedEventList, setSelectedEventList] = useState([]);
    const [eventPlayList, setEventPlayList] = useState([]);
    const [eventSearchState, setEventSearchState] = useState(initEventSearchState);
    const [cameraSearchState, setCameraSearchState] = useState(initCameraSearchState);
    const [cameraPlayItem, setCameraPlayItem] = useState({});

    // const eventComposer = (eventList) => {
    //     setEventList(eventList.map((item) => {
    //         return {
    //             ...item,
    //             selected: false
    //         }
    //     }))
    // }


    return (
        <Context.Provider
            value={{
                eventSearchInit,
                initSinceDate,
                initUntilDate,
                eventSearchState,
                setEventSearchState,
                cameraSearchState,
                setCameraSearchState,
                selectedEventList,
                setSelectedEventList,
                eventPlayList,
                setEventPlayList,
                cameraPlayItem,
                setCameraPlayItem
            }}
        >
            {children}
        </Context.Provider>
    );
};
