import { useState } from 'react'; 
import ReconnectingWebSocket from 'reconnecting-websocket';
import { JWT, baseSocketUrl } from 'src/api';


const useSocket = () => {
    

    // const [response, setResponse] = useState({} as any);
    // const [response, setResponse] = useState({} as AxiosResponse<any>);


    


    const webSocketCaller = ( wsUrl: string ) => {
        const ws = new ReconnectingWebSocket(`${baseSocketUrl}${wsUrl}`);
        let response: any = [];
        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({
                action: 'initial',
                data: JWT
            }));
        });  
        ws.addEventListener('message', (msg) => {
            console.log('socket message', msg);
        });
        ws.addEventListener('close', () => {
            console.log(`socket closed: ${wsUrl}`);
        });
        ws.addEventListener('error', error => {
            console.log(`socket error: ${error}`);
        })

        return response;
    }

        return ({
            webSocketCaller
            // error
        });
    };

    export default useSocket;

   

