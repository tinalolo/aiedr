import { JWT, baseUrl, baseSLUrl } from 'src/api';

import { GetEventsRequest, GetEventVideoRequest } from 'src/interface/api/request';

// Web API 2.3
export const getEventsConfig = (payload: GetEventsRequest) => {
    
    const { base, camera, ...params } = payload;        
    return ({
        headers: {'Authorization': `Bearer ${JWT}`},
        url: `${baseUrl}/dev/api/v1/events`, 
        method: 'GET',
        params: {
            ...params,
            base: base || undefined,
            camera: camera || undefined
        }
    });
};

// SL API 1.2
export const getEventVideoConfig = (payload: GetEventVideoRequest) => {
    console.log('payload', payload);
    const { filename } = payload;
    return ({
        headers: {'Authorization': `Bearer ${JWT}`},
        // Due to filename already contains deviceSerialNumber, it only need to use file name as API path
        // If filename does contains deviceSerialNumber, then payload of API should be modified.
        // url: `${baseSLUrl}/dev/api/v1/event/video/${deviceSerialNumber}/${filename}`,
        url: `${baseSLUrl}/dev/api/v1/event/video/${filename}`,
        method: 'GET',
        responseType: 'blob'
    });
};