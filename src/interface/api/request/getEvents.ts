export interface GetEventsRequest {
    since: number;
    until: number;
    camera?: string;
    eventTypes?: EventTypes;
    base?: string;
    currentRangeIndex?: number;
    action?: 'next' | 'previous' | 'first' | 'last';
}

export interface EventTypes {
    roi: boolean;
    crossLine: boolean;
}