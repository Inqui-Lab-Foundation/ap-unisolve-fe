import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import './i18n';
import Home from './home/home';


const Routers = () => {
    
    return (
        <>
            <Router>
                <Switch>
                    <Route exact={true} path="/" render={() => <Home />} />
                </Switch>
            </Router>
        </>
    );
};

export default Routers;
