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
    data: IManifestData | null;
}

class App extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        Cache.ee.setMaxListeners(100);

        global.config = new Config(this.props.config);

        this.state = {data: null}

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

        this.open = this.open.bind(this);
    }

    render() {
        return (
            <I18nextProvider i18n={i18n}>
                <Alert />
                <Login/>
                <TopBar />
                {this.renderMain()}
            </I18nextProvider>
        );
    }

    renderMain() {
        return <Splitter
            id="main"
            a={<TreeView />}
            b={<Content data={this.state.data}/>}
            direction="vertical"
        />;
    }

    componentDidMount() {
        window.addEventListener('popstate', function(event) {
            ManifestHistory.goBack();
        });
        Cache.ee.addListener('update-file-info', this.open);
    }

    open(manifestData: any) {
        this.setState({data: manifestData});
    }

    componentWillUnmount() {
        Cache.ee.removeListener('update-file-info', this.open);
    }
}

export default App;
