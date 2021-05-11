export interface GetCamerasRequest {
    name?: string;
    location?: string;
    state?: number;
    base?: string;
    currentRangeIndex?: number;
    action?: 'next' | 'previous' | 'first' | 'last';
}
