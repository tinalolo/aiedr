import { JWT, baseUrl, timeout } from 'src/api';

import { enableStreamingRequest } from 'src/interface/api/request';

// Web API 1.6
export const enableStreaming = (payload: enableStreamingRequest) => {
    const { serialNumber, cameraUuid } = payload;
    return ({
        headers: { 'Authorization': `Bearer ${JWT}` },
        url: `${baseUrl}/dev/api/v1/device/streaming`,
        method: 'POST',
        data: {
            serialNumber,
            cameraUuid
        },
        timeout: timeout
    });
};