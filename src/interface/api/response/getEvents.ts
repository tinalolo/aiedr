export interface GetEventsResponse {
    events: EventItem[];
    currentRangeIndex: number;
    totalRows: number;
      
}

export interface EventItem {
    eventId: string;
    eventType: 'ROI' | 'CROSSLINE';
    eventSince: number;
    eventUntil: number;
    description: {
        content: string;
    };
    descriptionPath: string;
    videoPath: string;
    deviceSerialNumber: string;
    camera: string;
    createTime: number;
    selected?: boolean; //前端加上的field
}