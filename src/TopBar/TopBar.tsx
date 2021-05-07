import * as React from 'react';
import Cache from '../lib/Cache';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {Translation} from 'react-i18next';
import './topbar.css';
import Token from "../lib/Token";
import ExternalSearch from "./ExternalSearch";
import IManifestData from "../interface/IManifestData";
import {isSingleManifest} from "../lib/ManifestHelpers";

interface IProps {
    currentManifest?: IManifestData;
}

export default function TopBar(props: IProps) {

    let bar = 'navBar';
    if (props.currentManifest && isSingleManifest(props.currentManifest)) {
        bar = 'infoBar';
    }

    return <div className="aiiif-topbar">
        <div className="aiiif-icon-button" onClick={() => Cache.ee.emit('toggle-splitter-main')}>
            <NavBarIcon />
            <Translation ns="common">{(t, { i18n }) => <p>{t(bar)}</p>}</Translation>
        </div>
        <LanguageSwitcher />
        <ExternalSearch />
        {Token.hasActiveToken() &&
            <div className="aiiif-icon-button" onClick={() => Token.logout()}>
                <LogoutIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('logout')}</p>}</Translation>
            </div>
        }
    </div>;
}
