export interface GetCamerasResponse {
    cameras: CameraItem[];
    currentRangeIndex: number;
    totalRows: number;
}

export interface CameraItem {
    motions: MotionItem[];
    uuid: string;
    name: string;
    location: string;
    deviceState: 0 | 1 | 2;
    deviceSerialNumber: string;
    editRangeCount: number;
    configTag: string;
    value:string;
}

export interface MotionItem {
    motionId: string;
    motionName: string;
    coordinates: { x: number, y: number }[],
    motionType: string;
}
