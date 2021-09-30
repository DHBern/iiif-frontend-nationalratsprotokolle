import React from 'react';
import {
    Switch,
    Route,
} from "react-router-dom";
import Alert from "../Alert";
import Login from "../Login";
import FederationHeader from '../federation/header';
import FederationFooter from '../federation/footer';
import PageOverview from "../page/overview";
import PageSearch from "../page/search";
import PageProtocolVariant3 from "../page/protocol/variant3";
import PageNotFound from "../page/notfound";

require('../topBar/topbar.css');

export default function Main() {
    return <>
        <Alert />
        <Login />
        <FederationHeader />
        <Switch>
            <Route exact path="/">
                <PageOverview />
            </Route>
            <Route path="/search">
                <PageSearch />
            </Route>
            <Route path="/protocol">
                <PageProtocolVariant3 />
            </Route>
            <Route path="*">
                <PageNotFound />
            </Route>
        </Switch>
        <FederationFooter />
    </>;

}