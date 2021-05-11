import { baseUrl } from 'src/api';

import { LoginRequest } from 'src/interface/api/request/login';

export const userLoginConfig = (payload: LoginRequest) => {

    const { ...data} = payload;        
    return ({
        url: `${baseUrl}/dev/api/v1/device/login`, 
        method: 'POST',
        data: {
            ...data
        }
    });
};