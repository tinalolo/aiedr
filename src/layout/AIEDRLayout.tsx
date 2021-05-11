import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";

import { renderRoutes } from 'src/helper/routerHelper';
import { RouterViewComponentProps } from 'src/router/routerConfig';

import AIEDRHeader from 'src/layout/AIEDRHeader';
import FunctionSider from 'src/layout/FunctionSider';
import Loading from 'src/component/utility/Loading';
import { ContextProvider } from 'src/contexts/globalContext'
import { DashboardProvider } from 'src/contexts/dashboardContext';

const Container = styled.div`
    height: 100%;
`


const AIEDRLayout = (props: RouterViewComponentProps) => {
    const history = useHistory();

    useEffect(() => {
        history.push("/dashboard"); //TODO: 待login 功能實作後移至 login
    }, [])
    
    return (
        <>
            <ContextProvider>
                <Container>
                    <Loading />
                    <AIEDRHeader />
                    <FunctionSider />
                    <DashboardProvider>
                        {renderRoutes(props.route.routes)}
                    </DashboardProvider>
                </Container>
            </ContextProvider>
        </>
    )
}


export default AIEDRLayout;