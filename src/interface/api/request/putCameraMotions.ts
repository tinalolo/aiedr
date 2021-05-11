export interface Coordinate {
    x: number;
    y: number;
}

export interface Motion {
    motionId: string;
    motionName: string;
    motionType: string;
    coordinates: [Coordinate];
}

export interface PutCameraMotionsRequest {
    uuid: string;
    motions: [Motion]
}