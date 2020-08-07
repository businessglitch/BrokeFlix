import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import Routes from './components/Routes';


ReactDOM.render(
    <Router>
        <App/>
        <Routes />
    </Router>,
    document.getElementById('root')
);




