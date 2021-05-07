import React, {useState, useEffect} from 'react';
import TopBar from './TopBar/TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import Alert from './Alert';
import {I18nextProvider} from 'react-i18next';
import i18n  from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
import Splitter from "./splitter/Splitter";
import Content from "./Content";
import './css/App.css';
import Cache from "./lib/Cache";
import IManifestData from "./interface/IManifestData";
import PresentationApi from "./fetch/PresentationApi";
import TreeBuilder from "./navigation/treeView/TreeBuilder";
import ITree from "./interface/ITree";
import ManifestData from "./entity/ManifestData";
import Navigation from "./navigation/Navigation";
import {getLocalized, isSingleManifest} from "./lib/ManifestHelpers";
import './lib/i18n';

interface IProps {
    config: IConfigParameter;
}

declare let global: {
    config: Config;
};


export default function App(props: IProps) {

    Cache.ee.setMaxListeners(100);
    global.config = new Config(props.config);


    const [currentManifest, setCurrentManifest] = useState<IManifestData | undefined>(undefined);
    const [currentFolder, setCurrentFolder] = useState<IManifestData | undefined>(undefined);
    const [tree, setTree] = useState<ITree | undefined>(undefined);
    const [authDate, setAuthDate] = useState<number>(0);
    const [q] = useState< string | null>(PresentationApi.getGetParameter('q', window.location.href));

    const setCurrentManifest0 = (id?: string) => {

        if (!id) {
            id = PresentationApi.getIdFromCurrentUrl();
        }
        if (!id) {
            return;
        }
        const url = id;

        PresentationApi.get(
            url,
            (currentManifest: IManifestData) =>  {
                ManifestHistory.pageChanged(
                    currentManifest.request ?? currentManifest.id,
                    getLocalized(currentManifest.label)
                );

                if (currentManifest.type === 'Collection') {
                    const currentFolder = currentManifest;
                    TreeBuilder.get(currentFolder.id, undefined, (tree) => {
                        setCurrentManifest(currentManifest);
                        setCurrentFolder(currentFolder);
                        setTree(tree);
                    });
                } else if (!isSingleManifest(currentManifest)) {
                    PresentationApi.get(
                        currentManifest.parentId,
                        (currentFolder: IManifestData) => {
                            TreeBuilder.get(currentFolder.id, undefined, (tree) => {
                                setCurrentManifest(currentManifest);
                                setCurrentFolder(currentFolder);
                                setTree(tree);
                            });
                        }
                    )
                } else {
                    const currentFolder = new ManifestData();
                    currentFolder.type = 'Manifest';
                    setCurrentManifest(currentManifest);
                    setCurrentFolder(currentFolder);
                }

                document.title = getLocalized(currentManifest.label);
            }
        );
    }



    useEffect(() => {
        const tokenReceived = () => {
            setAuthDate(Date.now());
            setCurrentManifest0();
        }

        const refresh = () => {
            setCurrentManifest0();
        }

        Cache.ee.addListener('token-changed', tokenReceived);
        i18n.changeLanguage(global.config.getLanguage());
        i18n.options.fallbackLng = global.config.getFallbackLanguage();
        i18n.on('languageChanged', refresh);

        window.addEventListener('popstate', function(event) {
            const backId = ManifestHistory.goBack();
            if (backId) {
                setCurrentManifest0(backId)
            }
        });

        setCurrentManifest0();

        return () => {
            Cache.ee.removeListener('token-changed', tokenReceived);
            i18n.off('languageChanged', refresh);
        }
    }, []);


    return <I18nextProvider i18n={i18n}>
        <Alert />
        <Login setCurrentManifest={setCurrentManifest0}/>
        <TopBar key={authDate} currentManifest={currentManifest} />
        {(!currentManifest || !currentFolder) ?
            <></> :
            <Splitter
                id="main"
                a={<Navigation
                    tree={tree}
                    currentManifest={currentManifest}
                    currentFolder={currentFolder}
                    setCurrentManifest={setCurrentManifest0}
                    q={q}
                />}
                b={<Content
                    key={currentManifest.id}
                    currentManifest={currentManifest}
                    currentFolder={currentFolder}
                    setCurrentManifest={setCurrentManifest0}
                    authDate={authDate}
                />}
                direction="vertical"
            />
        }
    </I18nextProvider>;
}
