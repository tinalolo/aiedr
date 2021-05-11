import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, List as antdList } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined, VerticalLeftOutlined, VerticalRightOutlined, CloseOutlined } from '@ant-design/icons';
import { AxiosRequestConfig } from 'axios';

import SearchEventPanel from 'src/component/event/SearchEventPanel';
import EventCard from 'src/component/event/EventCard';
import { StyledDrawer } from 'src/atoms/StyledDrawer';
import { EventItem } from 'src/interface/api/response/getEvents';
import { useStore } from 'src/contexts/eventsContext';
import { useDashboardStore } from 'src/contexts/dashboardContext';
import useAxios from 'src/hooks/useAxios';
import { getEventsConfig } from 'src/api';
import { GetEventsResponse } from 'src/interface/api/response/getEvents';
import { isEmptyData } from 'src/helper/tool';




interface Props {
    allEventList: EventItem[];
    handleEventSelect: Function;
}

const Container = styled.div`

`;

const EventFilterBar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #409CFC;
    height: 56px;
    font-size: 16px;
    cursor: pointer;
`;

const EventListContainer = styled.div`

`;

const Drawer = styled(StyledDrawer)`
    &.ant-drawer-body {
        background: #293140;
    }
`;

const EventList = styled(antdList)`
    .ant-list-pagination {
        text-align: left;
        color: white;
        padding-left: 90px;
    }
    .ant-pagination-simple .ant-pagination-simple-pager {
        color: white;
    }
    .ant-pagination-simple .ant-pagination-simple-pager input {
        background-color: transparent;
    }
    .ant-pagination-item-link {
        color: white;
    }

    &.ant-list {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;
    }
    
    .ant-list-pagination {
        margin: 24px 0 24px 0
    }

    .ant-spin-container {
      height: calc(100vh - 64px - 64px - 36px - 56px - 57px - 74px);
      overflow-y: auto;
    }
`;

const IconButton = styled(Button)`
    &.ant-btn-icon-only {
        width: 24px;
        height: 24px;
        font-size: 12px;
    }
    &.ant-btn-icon-only > * {
        font-size: 12px;
    }
`;      

const SearchEventTotalRag = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 60px;
    height: 24px;
    border-radius: 12px;
    padding: 3px 12px 1px 12px;
    margin-left: 8px;
    color: white;
    background-color: #409CFC;
`;

const TotalTag = styled.span`
    font-size: 12px;
    position: absolute;
    color: white;
    bottom: 29px;
    right: 24px;
`;





const AllEventsPanel = (props: Props) => {
  
    const { allEventList, handleEventSelect } = props;

    const {
        eventList, 
        setEventList, 
        currentRangeIndex, 
        setCurrentRangeIndex, 
        totalRows, setTotalRows, 
        baseEvent, 
        setBaseEvent,
        showEventTotalTag,
        setshowEventTotalTag
    } = useStore();

    const {initSinceDate, initUntilDate, eventSearchInit, eventSearchState } = useDashboardStore();

    const { apiCaller } = useAxios();

    const [searchBarOpen, setSearchBarOpen] = useState(false);

    const maxRangeIndex = Math.ceil(totalRows / 200); 
    const totalPages = Math.ceil(totalRows / 8);
    console.log('maxRangeIndex', maxRangeIndex); 

    const getEventsWithAction = async (action: 'first' | 'previous' | 'next' | 'last') => {

        const response = await apiCaller(getEventsConfig({
            ...eventSearchState,
            since: eventSearchState.since.valueOf(),
            until: eventSearchState.until.valueOf(),
            base: baseEvent,
            currentRangeIndex: currentRangeIndex,
            action: action
        }) as AxiosRequestConfig);
        const result : GetEventsResponse = response.responseData;
        if( result?.events ) {
            setEventList(result.events);
            setTotalRows(result.totalRows);
            setCurrentRangeIndex(result.currentRangeIndex);
            // if(!isEmptyData(result.events)) {
            //     setBaseEvent(result.events[0].eventId);
            // }
        }
    };

    const getEventsInit = async () => {
        const response = await apiCaller(getEventsConfig ({
            since: initSinceDate.valueOf(),
            until: initUntilDate.valueOf()
        }) as AxiosRequestConfig);
        const result : GetEventsResponse = response.responseData;
        if( result?.events ) {
            eventSearchInit();
            setEventList(result.events);
            setTotalRows(result.totalRows);
            setCurrentRangeIndex(result.currentRangeIndex);
            if(!isEmptyData(result.events)) {
                setBaseEvent(result.events[0].eventId);
            }
        }
    };

    const handleSearchTotalTagClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        getEventsInit();
        setshowEventTotalTag(false);
        event.stopPropagation();
    };

    console.log('currentRangeIndex', currentRangeIndex);

    return (
        <Container>
            <EventFilterBar onClick={() => setSearchBarOpen(!searchBarOpen)}>
                <span>Search Event</span>
                {   showEventTotalTag && 
                    <SearchEventTotalRag onClick={(e) => handleSearchTotalTagClick(e)}>
                        {eventList.length}
                        <CloseOutlined style={{ fontSize: '8px' }} />
                    </SearchEventTotalRag>
                }
        
            </EventFilterBar>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <EventListContainer>
                    <EventList
                        dataSource={allEventList.sort((itemA, itemB) => itemB.eventSince - itemA.eventSince)}
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 8,
                            simple: true
                        }}
                        renderItem={(item) => (<EventCard eventItem={item as EventItem} handleEventSelect={handleEventSelect} />)}
                    />
                    <IconButton 
                        disabled={currentRangeIndex === maxRangeIndex}
                        onClick={() => getEventsWithAction('next')}
                        style={{ position: 'absolute', bottom: '24px', right: 'calc(45px + 35px + 32px)' }} 
                        type="link" 
                        icon={<DoubleRightOutlined style={{ color: 'white' }} />} 
                    />
                    <IconButton 
                        disabled={currentRangeIndex === maxRangeIndex}
                        onClick={() => getEventsWithAction('last')}
                        style={{ position: 'absolute', bottom: '24px', right: 'calc(45px + 35px)' }} 
                        type="link" 
                        icon={<VerticalLeftOutlined style={{ color: 'white' }} />} 
                    />
                    <IconButton 
                        disabled={currentRangeIndex === 1}
                        onClick={() => getEventsWithAction('previous')}
                        style={{ position: 'absolute', bottom: '24px', left: '60px' }} 
                        type="link" 
                        icon={<DoubleLeftOutlined style={{ color: 'white' }} />} 
                    />
                    <IconButton 
                        disabled={currentRangeIndex === 1}
                        onClick={() => getEventsWithAction('first')}
                        style={{ position: 'absolute', bottom: '24px', left: '28px' }} 
                        type="link" 
                        icon={<VerticalRightOutlined style={{ color: 'white' }} />} 
                    />
                    <TotalTag>
                        {`${totalPages} pages`}
                    </TotalTag>

                </EventListContainer>

                <Drawer
                    placement="top"
                    closable={false}
                    onClose={() => setSearchBarOpen(false)}
                    visible={searchBarOpen}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                    drawerStyle={{ background: '#293140' }}
                >
                    <SearchEventPanel />
                </Drawer>

            </div>

        </Container>
    );
};

export default AllEventsPanel;
