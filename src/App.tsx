import React from 'react';
import TopBar from './TopBar/TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import Alert from './Alert';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import i18n  from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
import TreeView from "./treeView/TreeView";
import Splitter from "./splitter/Splitter";
import Content from "./Content";
import './css/App.css';
import Cache from "./lib/Cache";
import IManifestData from "./interface/IManifestData";
import Manifest from "./lib/Manifest";
import TreeBuilder from "./treeView/TreeBuilder";
import ITree from "./interface/ITree";

const commonEn = require('./translations/en/common.json');
const commonDe = require('./translations/de/common.json');
const commonNl = require('./translations/nl/common.json');

interface IProps {
    config: IConfigParameter;
}

declare let global: {
    config: Config;
};

interface IState {
    currentManifest?: IManifestData;
    currentFolder?: IManifestData;
    tree?: ITree;
}

class App extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        Cache.ee.setMaxListeners(100);

        global.config = new Config(this.props.config);

        this.state = {}

        i18n.use(initReactI18next).init({
            lng: global.config.getLanguage(),
            fallbackLng: global.config.getFallbackLanguage(),
            interpolation: { escapeValue: false },  // React already does escaping
            resources: {
                de: {
                    common: commonDe
                },
                en: {
                    common: commonEn
                },
                nl: {
                    common: commonNl
                }
            }
        });

        this.setCurrentManifest = this.setCurrentManifest.bind(this);
    }

    render() {
        return (
            <I18nextProvider i18n={i18n}>
                <Alert />
                <Login setCurrentManifest={this.setCurrentManifest} />
                <TopBar />
                {this.renderMain()}
            </I18nextProvider>
        );
    }

    renderMain() {

        if (!this.state.currentManifest || !this.state.currentFolder) {
            return;
        }

        return <Splitter
            id="main"
            a={<TreeView
                key={this.state.currentFolder.id}
                currentFolderId={this.state.currentFolder.id}
                tree={this.state.tree}
                setCurrentManifest={this.setCurrentManifest}
            />}
            b={<Content
                key={this.state.currentManifest.id}
                currentManifest={this.state.currentManifest}
                currentFolder={this.state.currentFolder}
                setCurrentManifest={this.setCurrentManifest}
            />}
            direction="vertical"
        />;
    }

    componentDidMount() {
        const t = this;
        window.addEventListener('popstate', function(event) {
            const backId = ManifestHistory.goBack();
            if (backId) {
                t.setCurrentManifest(backId)
            }
        });
        const id = Manifest.getIdFromCurrentUrl();
        if (id) {
            this.setCurrentManifest(id);
        }
        Cache.ee.addListener('token-received', this.clearTree);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('token-received', this.clearTree);
    }

    setCurrentManifest(id: string) {
        const t = this;


        Manifest.get(
            id,
            (currentManifest: IManifestData) =>  {

                ManifestHistory.pageChanged(id, currentManifest.label);


                if (currentManifest.type === 'sc:Collection') {
                    const currentFolder = currentManifest;
                    TreeBuilder.get(currentFolder.id, undefined, (tree) => {
                        t.setState({currentManifest, currentFolder, tree});
                    });
                } else {
                    Manifest.get(
                        currentManifest.parentId,
                        (currentFolder: IManifestData) => {
                            TreeBuilder.get(currentFolder.id, undefined, (tree) => {
                                t.setState({currentManifest, currentFolder, tree});
                            });
                        }
                    )
                }
                /*



              if (pageReload !== false) {
                   ManifestHistory.pageChanged(manifestData.id, manifestData.label);
               }*/

                if (currentManifest.restricted === true) {
                    document.title = currentManifest.label;
                }
            }
        );
    }

    clearTree() {
        this.setState({tree: undefined});
    }
}

export default App;
