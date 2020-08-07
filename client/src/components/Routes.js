import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import {Home} from "./Home/Home";
import {Main} from './Main'
import {hst} from '../global/global';


export default class Routes extends Component {
    render() {
        return (
            <Router history={hst}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/Main" component={Main} />
                </Switch>
            </Router>
        )
    }
}