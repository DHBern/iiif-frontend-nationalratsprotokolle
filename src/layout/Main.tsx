import React, { useEffect } from 'react';
import {
    Switch,
    Route,
    Redirect,
    useLocation,
} from "react-router-dom";
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import Alert from "../Alert";
import Login from "../Login";
import FederationHeader from '../federation/header';
import FederationFooter from '../federation/footer';
import PageOverview from "../page/overview";
import PageSearch from "../page/search";
import PageSearchAdvanced from 'page/searchAdvanced';
import PageInformation from "../page/information";
import PageProtocolVariant3 from "../page/protocol/protocol";
import PageNotFound from "../page/notfound";

require('../topBar/topbar.css');

export default function Main() {
    const {pathname, search, hash} = useLocation();
    const { enableLinkTracking, trackPageView } = useMatomo()

    enableLinkTracking()

    useEffect(() => {
        trackPageView();
    }, [pathname, search, hash]) // eslint-disable-line react-hooks/exhaustive-deps

    return <>
        <Alert />
        <Login />
        <FederationHeader />
        <Switch>
            <Route exact path="/">
                <Redirect to="/search" />
            </Route>
            <Route path="/search">
                <PageSearch />
            </Route>
            <Route path="/searchadvanced">
                <PageSearchAdvanced />
            </Route>
            <Route path="/browser">
                <PageOverview />
            </Route>
            <Route path="/protocol">
                <PageProtocolVariant3 />
            </Route>
            <Route path="/information">
                <PageInformation />
            </Route>
            <Route path="*">
                <PageNotFound />
            </Route>
        </Switch>
        <FederationFooter />
    </>;

}
