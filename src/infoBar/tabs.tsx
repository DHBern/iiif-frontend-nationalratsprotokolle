import React, {useContext} from "react";
import Metadata from "./tabs/metadata";
import Download from "./tabs/download";
import Pages from "./tabs/pages";
import Share from "./tabs/share";
import Search from "./tabs/Search";
import {AppContext} from "../AppContext";
import i18next from "i18next";


export default function Tabs() {

    const {currentManifest, tab} = useContext(AppContext);
    if (!currentManifest || tab === '') {
        return <></>;
    }

    let content;
    let tab2 = tab;
    if (tab === 'download') {
        content = <Download />
    } else if (tab === 'pages' && currentManifest.resource && currentManifest.resource.type === 'imageService') {
        content = <Pages />
    } else if (tab === 'search' && currentManifest.search) {
        content = <Search />;
    } else if (tab=== 'share') {
        content = <Share />
    } else {
        tab2 = 'metadata';
        content = <Metadata  />;
    }

    return <>
        <div className="aiiif-tab-container">
            <h2>{i18next.t('common:' + tab2)}</h2>
            {content}
        </div>
    </>
}
