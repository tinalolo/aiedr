import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import { AxiosRequestConfig } from 'axios';

import useAxios from 'src/hooks/useAxios';
import { JWT, baseSocketUrl, getEventsConfig } from 'src/api';
import { StyledBadge } from 'src/atoms/StyledBadge';
import SelectedPanel from 'src/component/event/SelectedPanel';
import AllEventsPanel from 'src/component/event/AllEventsPanel';
import { useStore } from 'src/contexts/eventsContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import useNotification from 'src/hooks/useNotification';
import { GetEventsResponse, EventItem } from 'src/interface/api/response/getEvents';
import { isEmptyData } from 'src/helper/tool';
import ReconnectingWebSocket from 'reconnecting-websocket';

const { TabPane } = Tabs;

const StyledTabs = styled(Tabs)`
    .ant-tabs {
        overflow: none;
    }

    .ant-tabs-nav {
        margin: 0;
    }

    .ant-tabs-nav-list{ 
        width: 100%;
        background: #363D53;
        color: white;
        opacity: 1;
        
    }

    .ant-tabs-tab {
        width: 50%;
        display: flex;
        justify-content: center;
    };

    .ant-tabs-nav .ant-tabs-ink-bar {
        height: 6px;
    }
`;

const Container = styled.div`
    height: 100%;
    background: #363D53;
    display: flex;
    flex-direction: column;
`;


const NewEventPanel = styled.div`
    display: flex;
    align-items: center;
    align-self: center;
    justify-content: center;
    width: 369px;
    height: 36px;
    background: #293140;
    border-radius: 16px;
    opacity: 1;
    color: white;
    font-size: 16px;
    cursor: pointer;
    
`;

// const NewEventNumber = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     width: 45px;
//     height: 26px;
//     background: #363D53;
//     border-radius: 12px;
//     opacity: 1;
//     margin-left: 12px;
// `

const NewEventBadge = styled(StyledBadge)`
    margin-left: 12px;
    .ant-badge-count {
        color: white;
        height: 26px;
        padding: 4px 18px;
        border-radius: 13px;
        font-size: 16px;
        /* background: #363D53; */
        background: ${prop => prop.count ? '#409CFF' : '#363D53'};
        border: none;
        box-shadow: none;
    }
`;



const EventPanel = () => {

    const { apiCaller } = useAxios();
    // const { webSocketCaller } = useSocket();
    const {
        eventList,
        setEventList,
        // selectedEventList,
        // setSelectedEventList,
        setCurrentRangeIndex,
        setTotalRows,
        setBaseEvent,
        newEventCount,
        setNewEventCount
    } = useStore();

    const {
        initSinceDate,
        initUntilDate,
        eventSearchState,
        eventSearchInit,
        selectedEventList,
        setSelectedEventList,
        eventPlayList,
        setEventPlayList
    } = useDashboardStore();

    const { openNotificationInfo } = useNotification();

    const getEvents = async (action: 'search' | 'init') => {
        switch (action) {
            case 'search':
                {
                    const response = await apiCaller(getEventsConfig({
                        ...eventSearchState,
                        since: eventSearchState.since.valueOf(),
                        until: eventSearchState.until.valueOf()
                    }) as AxiosRequestConfig);

                    const result: GetEventsResponse = response.responseData;
                    if (result?.events) {
                        if (!isEmptyData(result.events) && isEmptyData(selectedEventList)) { //第一次進入頁面時自動選取前四筆 event, 播放第一筆 event
                            let initSelectedEvents = [];
                            for (let i = 0; i < 4; i++) {
                                if (result.events[i]?.eventId) {
                                    initSelectedEvents.push(result.events[i]);
                                }
                            }
                            setSelectedEventList(initSelectedEvents);
                            if (result.events[0]?.eventId && isEmptyData(eventPlayList) && isEmptyData(selectedEventList)) {
                                const _eventPlayList = JSON.parse(JSON.stringify(eventPlayList));
                                _eventPlayList.push(result.events[0]);
                                setEventPlayList(_eventPlayList);
                            }
                        }
                        setEventList(result.events);
                        setTotalRows(result.totalRows);
                        setCurrentRangeIndex(result.currentRangeIndex);
                        if (!isEmptyData(result.events)) {
                            setBaseEvent(result.events[0].eventId);
                        }
                    }
                }
                break;
            case 'init':
                {
                    const response = await apiCaller(getEventsConfig({
                        since: initSinceDate.valueOf(),
                        until: initUntilDate.valueOf()
                    }) as AxiosRequestConfig);

                    const result: GetEventsResponse = response.responseData;

                    if (result?.events) {
                        // if(!isEmptyData(result.events)) {
                        //     let initSelectedEvents = [];
                        //     for(let i = 0; i < 4; i++) {
                        //         if(result.events[i]?.eventId) {
                        //             initSelectedEvents.push(result.events[i]);
                        //         }
                        //     }
                        //     setSelectedEventList(initSelectedEvents);
                        //     // if(result.events[i]?.eventId) {
                        //     //     const _eventPlayList = JSON.parse(JSON.stringify(eventPlayList));
                        //     //     _eventPlayList.push(result.events[0]);
                        //     //     setEventPlayList(_eventPlayList);
                        //     // }
                        // }

                        eventSearchInit();
                        setEventList(result.events);
                        setTotalRows(result.totalRows);
                        setCurrentRangeIndex(result.currentRangeIndex);
                        if (!isEmptyData(result.events)) {
                            setBaseEvent(result.events[0].eventId);
                        }
                    }
                }
                break;

            default: return;
        }
    };



    useEffect(() => {
        const ws = new ReconnectingWebSocket(`${baseSocketUrl}/dev/api/v1/ws/event_count`);

        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({
                action: 'initial',
                data: JWT
            }));
        });
        ws.addEventListener('message', (msg) => {

            if (msg?.data) {
                const data = JSON.parse(msg.data);
                if (data.action === 'eventCount') {
                    setNewEventCount((prevCount: number) => prevCount + data.data);
                }
            }
        });
        ws.addEventListener('close', () => {
            // console.log(`socket closed: ${wsUrl}`);
        });
        ws.addEventListener('error', error => {
            console.log(`socket error: ${error}`);
        });

        return () => {
            ws.close();
        };
    }, []);


    useEffect(() => {
        getEvents('search');
    }, []);



    const handleEventSelect = (id: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const _selectedEventList = JSON.parse(JSON.stringify(selectedEventList as EventItem[]));
        if (event) {
            event.stopPropagation();
        }

        if (isEmptyData(_selectedEventList)) {
            _selectedEventList.push(eventList.find((item: EventItem) => item.eventId === id));
        } else {
            if (_selectedEventList.map((item: EventItem) => item.eventId).includes(id)) { //該 event 已經是 selected
                const newSelectedEventList = _selectedEventList.filter((item: EventItem) => item.eventId !== id);
                setSelectedEventList(newSelectedEventList);
                const _eventPlayList: EventItem[] = JSON.parse(JSON.stringify(eventPlayList));
                const newEventPlayList = _eventPlayList.filter((item: EventItem) => item.eventId !== id);
                setEventPlayList(newEventPlayList);
                return;
            } else {
                _selectedEventList.push(eventList.find((item: EventItem) => item.eventId === id));
            }
        }

        const currentEventCount = _selectedEventList.length;

        if (currentEventCount > 4) {  //最多只能選取四筆
            openNotificationInfo({
                message: 'Maximum limit of selected list exceeded.',
                style: {
                    width: 440,
                    fontSize: '16px'
                }
            });
        } else {
            setSelectedEventList(_selectedEventList);
        }


    };


    const handleEventPlay = (event: EventItem) => {
        const _eventPlayList: EventItem[] = JSON.parse(JSON.stringify(eventPlayList));
        if (_eventPlayList.map((item) => item.eventId).includes(event.eventId)) {
            setEventPlayList(_eventPlayList.filter((item) => item.eventId !== event.eventId));
        } else {
            _eventPlayList.push(event);
            setEventPlayList(_eventPlayList);
        }
    };

    const handleNewEventClick = () => {
        setNewEventCount(0);
        getEvents('init');
    };





    return (
        <Container>
            <NewEventPanel onClick={handleNewEventClick}>
                <div>New event</div>
                <NewEventBadge showZero count={newEventCount}></NewEventBadge>
            </NewEventPanel>
            <StyledTabs defaultActiveKey="1" centered={true} size="large" tabBarGutter={1}>
                <TabPane tab={`Selected(${selectedEventList.length})`} key="1">
                    <SelectedPanel
                        selectedEventList={selectedEventList}
                        handleEventSelect={handleEventSelect}
                        handleEventPlay={handleEventPlay}
                    />
                </TabPane>
                <TabPane tab="All Events" key="2">
                    <AllEventsPanel
                        allEventList={eventList}
                        handleEventSelect={handleEventSelect}
                    />
                </TabPane>
            </StyledTabs>
        </Container>
    );
};

export default EventPanel;