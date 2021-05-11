import { JWT, baseUrl } from 'src/api';

import { GetCamerasRequest, PutCameraMotionsRequest, sendStreamHeartbeat, PutCameraConfigRequest } from 'src/interface/api/request';
import { isEmptyData } from 'src/helper/tool';

// Web API 4.1
export const getCamerasConfig = (payload: GetCamerasRequest) => {
    if(isEmptyData(payload)) {
        return ({
            headers: {'Authorization': `Bearer ${JWT}`},
            url: `${baseUrl}/dev/api/v1/cameras`, 
            method: 'GET'
        });
    } else {
        const { location, name, state, ...params } = payload;        
        return ({
            headers: {'Authorization': `Bearer ${JWT}`},
            url: `${baseUrl}/dev/api/v1/cameras`, 
            method: 'GET',
            params: {
                ...params,
                state: state && (state >= 0 ? state : undefined), //state 為 -1 時不帶(等同於 all)
                location: location || undefined,
                name: name || undefined
            }
        });
    }
};

// Web API 4.2
export const sendSteamHeartbeat = (payload: sendStreamHeartbeat) => {
    console.log('payload', payload);
    const { uuid } = payload;
    return ({
        method: 'POST',
        url: `${baseUrl}/dev/api/v1/camera/streaming`,
        headers: {'Authorization': `Bearer ${JWT}`},
        data: { uuid }
    });
};

// Web API 4.3
export const putCameraMotionsConfig = (payload: PutCameraMotionsRequest) => {
    console.log('payload', payload);
    const { uuid, motions } = payload;
    return ({
        method: 'PUT',
        url: `${baseUrl}/dev/api/v1/camera/${uuid}/motions`,
        headers: {'Authorization': `Bearer ${JWT}`},
        data: {motions}
    });
};

// Web API 4.5
export const putCameraConfig = (payload: PutCameraConfigRequest) => {
    console.log('payload', payload);
    const { uuid, cameraConfig } = payload;
    return ({
        method: 'PUT',
        url: `${baseUrl}/dev/api/v1/camera/${uuid}/config`,
        headers: {
            'Content-Type': 'multipart/form-data', 
            'Authorization': `Bearer ${JWT}` 
        },
        data: cameraConfig
    });
};