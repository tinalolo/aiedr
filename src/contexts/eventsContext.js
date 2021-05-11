import React, { useState, createContext, useContext } from 'react';

export const Context = createContext();

export const useStore = () => useContext(Context);



export const EventProvider = ({ children }) => {
    const [newEventCount, setNewEventCount] = useState(0);
    const [eventList, setEventList] = useState([]);
    const [selectedEventList, setSelectedEventList] = useState([]);
    const [currentRangeIndex, setCurrentRangeIndex] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [baseEvent, setBaseEvent] = useState('');
    const [showEventTotalTag, setshowEventTotalTag] = useState(false);

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
                eventList,
                setEventList,
                currentRangeIndex,
                setCurrentRangeIndex,
                totalRows,
                setTotalRows,
                baseEvent,
                setBaseEvent,
                showEventTotalTag,
                setshowEventTotalTag,
                newEventCount,
                setNewEventCount,
                selectedEventList,
                setSelectedEventList
            }}
        >
            {children}
        </Context.Provider>
    );
};
