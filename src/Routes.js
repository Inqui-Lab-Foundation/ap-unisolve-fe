import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import './i18n';
import Home from './home/home';
import Terms from './home/termsandconditions';


const Routers = () => {
    
    return (
        <>
            <Router>
                <Switch>
                    <Route exact={true} path="/" render={() => <Home />} />
                    <Route
                        exact={true}
                        path="/termsandconditions"
                        render={() => <Terms />}
                    />
                </Switch>
            </Router>
        </>
    );
};

export default Routers;
