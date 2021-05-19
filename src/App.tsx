import React from 'react';
import { ThemeProvider } from 'styled-components';
import { ResetStyles, GlobalStyles } from './globalStyles';
import Router from 'src/router/Router';
import theme from './theme';

function App() {

    return (
        <ThemeProvider theme={theme}>
            <ResetStyles />
            <GlobalStyles />
            <Router />
        </ThemeProvider>
    );
}

export default App;
