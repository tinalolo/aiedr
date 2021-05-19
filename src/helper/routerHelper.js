import React from 'react';
import { Switch, Route } from 'react-router-dom';

// routes是props.route.routes傳進來的是陣列
export const renderRoutes = (routes, extraProps = {}, switchProps = {}) => {
    return routes ? (
        <Switch {...switchProps}>
            {/* 解析routes */}
            {routes.map((route, i) => (
                <Route
                    key={route.key || i}
                    path={route.path}
                    exact={route.exact}
                    strict={route.strict}
                    render={props =>
                        route.render ? (
                            route.render({ ...props, ...extraProps, route: route })
                        ) : (
                            // 切換component
                            <route.component {...props} {...extraProps} route={route} />
                        )
                    }
                />
            ))}
        </Switch>
    ) : null;
};

