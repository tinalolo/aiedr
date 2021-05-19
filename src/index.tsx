import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.sass';

import { IntlProvider } from 'react-intl';
import { twLang } from './assets/i18n/tw';
import { enLang } from './assets/i18n/en';



const Root = () => {
    const lang = localStorage.getItem('lang') || navigator.language;
    const messages = lang === 'en-US' ? enLang : twLang;
    localStorage.setItem('lang', lang);
  
    return (
        <React.StrictMode>
            <IntlProvider locale={lang} key={lang} messages={messages} defaultLocale='tw'>
                <App />
            </IntlProvider>
        </React.StrictMode>
    );
};

ReactDOM.render(<Root/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
