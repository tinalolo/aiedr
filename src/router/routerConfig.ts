import { RouteComponentProps } from 'react-router-dom';
import AIEDRLayout from 'src/layout/AIEDRLayout';
import Dashboard from 'src/page/Dashboard';
import Page2 from 'src/page/DeviceDirectory';

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
            },
            {
                id: 1,
                path: '/device_directory',
                component: Page2,
                auth: true,
                exact: true,
                meta: {
                    name: 'device directory',
                    route: 'device_directory'
                }
            },
            {
                id: 1,
                path: '/device_identity',
                component: Page2,
                auth: true,
                exact: true,
                meta: {
                    name: 'device identity',
                    route: 'device_identity'
                }
            }
        ]
    }
];