import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { routerConfig } from 'src/router/routerConfig';
import { renderRoutes } from 'src/helper/routerHelper';


const Router: React.FC = () => {
    const component = ( 
        <BrowserRouter >
            {renderRoutes(routerConfig)}
        </BrowserRouter>
    );
    return component;
};

export default Router;