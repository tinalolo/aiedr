import React from 'react';
import {  Route,  useLocation } from 'react-router-dom';
import { RouteModel } from './routerConfig';

interface Props {
    config: RouteModel[];
}

const RouterGuard = (props: Props) => {
    const { config } = props;
    const location = useLocation();
    const targetRouter = config.find((route: RouteModel) => route.path === location.pathname);
	
    return (
        <Route exact={true} path={location.pathname} component={targetRouter?.component} />
    );
};

export default RouterGuard;
