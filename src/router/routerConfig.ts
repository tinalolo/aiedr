import { RouteComponentProps } from 'react-router-dom';
import AIEDRLayout from 'src/layout/AIEDRLayout';
import Dashboard from 'src/page/Dashboard';//TODO 之後要刪掉
import Login from 'src/page/Login';//新增
import LiveStreaming from 'src/page/LiveStreaming';//新增
import Event from 'src/page/Event';//新增
import AiSetting from 'src/page/AiSetting';//新增
import DeviceDirectory from 'src/page/DeviceDirectory';

export interface RoutesMeta {
	name: string;
	route: string;
}

export interface RouteModel<TMeta = { [key: string]: string | number | boolean; }> {
	id?: number;
	path: string;
	exact?: boolean;
	auth?: boolean;
	// eslint-disable-next-line no-undef
	component: () => JSX.Element;
	meta?: RoutesMeta;
	routes?: RouteModel<TMeta>[];
}

export interface RouterViewComponentProps<TMeta = { [key: string]: string | number | boolean; }> extends RouteComponentProps {
	route: RouteModel<TMeta>;
  }
  

export const routerConfig = [
    {
        path: '/',
        component: AIEDRLayout,
        routes: [
            // login 新增的
            {
                id: 1,
                path: '/login',
                component: Login,
                auth: true,
                exact: true,
                meta: {
                    name: 'login',
                    route: 'login'
                }
            },
            // 原本的dashboard 要拆成兩個page-Event/Live
            {
                id: 1,
                path: '/liveStreaming',
                component: LiveStreaming,
                auth: true,
                exact: true,
                meta: {
                    name: 'liveStreaming',
                    route: 'liveStreaming'
                }
            },
            {
                id: 1,
                path: '/event',
                component: Event,
                auth: true,
                exact: true,
                meta: {
                    name: 'event',
                    route: 'event'
                }
            },
            //新增的
            {
                id: 1,
                path: '/aiSetting',
                component: AiSetting,
                auth: true,
                exact: true,
                meta: {
                    name: 'aiSetting',
                    route: 'aiSetting'
                }
            },
            // 左邊devie directory 原本的
            {
                id: 1,
                path: '/device_directory',
                component: DeviceDirectory,
                auth: true,
                exact: true,
                meta: {
                    name: 'device directory',
                    route: 'device_directory'
                }
            },
            // // 左邊dashboard 原本的 //TODO 之後要刪掉
            {
                id: 1,
                path: '/dashboard',
                component: Dashboard,
                auth: true,
                exact: true,
                meta: {
                    name: 'dashboard',
                    route: 'dashboard'
                }
            }
        ]
    }
];