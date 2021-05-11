import * as React from 'react';
import Splitter from "../splitter/Splitter";
import Content2 from "./Content2";
import {useContext} from "react";
import {AppContext} from "../AppContext";
import {isSingleManifest} from "../lib/ManifestHelpers";
import TabButtons from "../infoBar/tabButtons";
import InfoBar from "../infoBar/infoBar";
import TreeView from "../treeView/TreeView";
import Content3 from "./Content3";

export default function Content1() {

    const {currentManifest, tab} = useContext(AppContext);

    if (!currentManifest) {
        return <></>;
    }

    if (isSingleManifest(currentManifest)) {
        if (tab === '') {
            return <>
                <div className="aiiif-infobar">
                    <TabButtons />
                    <Content3 key={currentManifest.id}/>
                </div>
            </>;
        }

        return <Splitter
            id="main"
            a={<div className="aiiif-navigation">
                <div className="aiiif-infobar">
                    <TabButtons />
                    <InfoBar />
                </div>
            </div>}
            b={<Content2 key={currentManifest.id}/>}
            direction="vertical"
        />;
    }

    return <Splitter
        id="main"
        a={<div className="aiiif-navigation"><TreeView /></div>}
        b={<Content2 key={currentManifest.id}/>}
        direction="vertical"
    />;
}
