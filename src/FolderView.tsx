import * as React from 'react';
import Loading from './Loading';
import Item from './Item';
import Manifest from './lib/Manifest';
import ManifestHistory from './lib/ManifestHistory';
import Cache from './lib/Cache';
import IManifestData from './interface/IManifestData';
import {Translation} from 'react-i18next';
import ViewSymbolsIcon from "@material-ui/icons/ViewComfy";
import ViewListIcon from "@material-ui/icons/ViewList";

interface IState {
    data: IManifestData | null;
    selected: string | undefined;
    mode: string;
}

interface IProps {
    data: IManifestData | null;
}

class FolderView extends React.Component<IProps, IState> {

    constructor(props: any) {

        super(props);

        this.state = {
            data: null,
            mode: 'icon-view',
            selected: this.props.data ? this.props.data.id : undefined
        };

        this.openFolder = this.openFolder.bind(this);
        this.showListView = this.showListView.bind(this);
        this.showIconView = this.showIconView.bind(this);
    }


    render() {
        if (!this.state.data) {
            return (
                <Loading/>
            );
        }

        if (this.state.data.restricted) {
            return <div id="folder-view-container" />;
        }

        const files = this.state.data.manifests;
        const folders = this.state.data.collections;

        if (files.length === 0 && folders.length === 0) {

            return (
                <div id="folder-view-container">
                    <div>
                        <h1>{this.state.data.label}</h1>
                        <div className="empty">
                            <Translation ns="common">{(t, { i18n }) => <p>{t('emptyFolder')}</p>}</Translation>
                        </div>
                    </div>
                </div>
            );
        }

        const content = [];
        for (const folder of folders) {
            content.push(
                <Item item={folder} selected={this.state.selected} key={folder.id} />
            );
        }
        for (const file of files) {
            content.push(
                <Item item={file} selected={this.state.selected} key={file.id} />
            );
        }

        const folderViewClassNames = 'folder-view ' + this.state.mode;

        return (
            <div id="folder-view-container">
                <nav className="bar">
                    <div className="icon-button" onClick={this.showIconView}>
                        <ViewSymbolsIcon />
                        <Translation ns="common">{(t, { i18n }) => <p>{t('iconView')}</p>}</Translation>
                    </div>
                    <div className="icon-button" onClick={this.showListView}>
                        <ViewListIcon />
                        <Translation ns="common">{(t, { i18n }) => <p>{t('listView')}</p>}</Translation>
                    </div>
                </nav>
                <div>
                    <h1>{this.state.data.label}</h1>
                    <div className={folderViewClassNames}>{content}</div>
                </div>

            </div>
        );
    }

    openFolder(itemId: string | boolean | null, selectedData: any, pageReload: Boolean | null) {

        if (typeof itemId !== 'string') {
            const alertArgs = {
                title: 'Error',
                body: 'No manifest ID given!'
            };
            Cache.ee.emit('alert', alertArgs);
            return;
        }

        const t = this;
        const url: string = itemId;

        Manifest.get(
            url,
            (manifestData: any) =>  {

                if (typeof manifestData === 'string') {
                    alert(manifestData);
                    return;
                }

                if (manifestData.type !== 'sc:Collection') {
                    if (!manifestData.parentId) {
                        t.openImaginaryRootFolder(manifestData);
                        return;
                    }

                    t.openFolder(manifestData.parentId, manifestData, false);
                    return;
                }

                let selected = null;
                if (selectedData) {
                    selected = selectedData.id;
                } else {
                    selectedData = manifestData;
                }

                t.setState({
                    data: manifestData,
                    selected
                });
                if (pageReload !== false) {
                    ManifestHistory.pageChanged(manifestData.id, manifestData.label);
                }

                if (manifestData.restricted === true) {
                    document.title = manifestData.label;
                }

                Cache.ee.emit('update-current-folder-id', manifestData.id);
                Cache.ee.emit('update-file-info', selectedData);
            }
        );

    }

    openImaginaryRootFolder(manifestData: IManifestData) {
        const imaginaryRootManifestData: IManifestData = {
            collections: [],
            id: '-',
            manifests: [manifestData],
            type: 'sc:Collection',
            label: '',
            logo: '',
            attribution: '',
            manifestations: [],
            parentId: '',
            resource: [],
            restricted: false,
            metadata: [],
            license: '',
            description: ''
        };

        this.setState({
            data: imaginaryRootManifestData,
            selected: manifestData.id
        });

        Cache.ee.emit('update-file-info', manifestData);
    }

    showListView() {
        this.setState({mode: 'list-view'});
    }

    showIconView() {
        this.setState({mode: 'icon-view'});
    }

    componentDidMount() {
        Cache.ee.addListener('open-folder', this.openFolder);

        const id = Manifest.getIdFromCurrentUrl();
        this.openFolder(id, null, null);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('open-folder', this.openFolder);
    }
}

export default FolderView;
