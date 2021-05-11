import React, { Fragment, useState, createContext } from 'react';
import { Redirect, Route, Prompt, withRouter, useLocation } from 'react-router-dom';
import { RouteModel } from './routerConfig'

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
