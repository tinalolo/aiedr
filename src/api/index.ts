export * from 'src/api/device';
export * from 'src/api/camera';
export * from 'src/api/event';
export * from 'src/api/user';

export const baseUrl =  process.env.REACT_APP_BASEURL;
export const baseSLUrl =  process.env.REACT_APP_SL_BASEURL;
export const baseSocketUrl =  process.env.REACT_APP_SOCKET_BASEURL;
export const timeout =  process.env.REACT_APP_API_TIMEOUT;


export const JWT = localStorage.getItem('userToken');









