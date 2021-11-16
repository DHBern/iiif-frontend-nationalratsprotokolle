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
import PageInformation from "../page/information";
import PageProtocolVariant3 from "../page/protocol/protocol";
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
            <Route path="/protocol"
                render={props => (
                    <PageProtocolVariant3 key={props.location.key} />
                  )}
            />
            <Route path="/information"
                render={props => (
                    <PageInformation key={props.location.key} />
                  )}
            />
            <Route path="*">
                <PageNotFound />
            </Route>
        </Switch>
        <FederationFooter />
    </>;

}