import React from 'react';
import Loading from './Loading';
import Item from './Item';
import Manifest from './lib/Manifest';
import ManifestHistory from './lib/ManifestHistory';
import {translate, Trans} from 'react-i18next';


class FolderView extends React.Component {

    constructor(props) {

        super(props);


        this.state = {
            data: false,
            selected: null,
            mode: 'icon-view'
        };
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

        let files = this.state.data.manifests;
        let folders = this.state.data.collections;

        if (files.length === 0 && folders.length === 0) {

            return (
                <div id="folder-view-container">
                    <h1>{this.state.data.label}</h1>
                    <div className="empty"><Trans i18nKey="emptyFolder"/></div>
                </div>
            );
        }

        let content = [];
        for (let key in folders) {

            let folder = folders[key];
            content.push(
                <Item item={folder} selected={this.state.selected} key={folder.id} />
            );
        }
        for (let key in files) {

            let file = files[key];
            content.push(
                <Item item={file} selected={this.state.selected} key={file.id} />
            );
        }

        let folderViewClassNames = 'folder-view ' + this.state.mode;

        return (
            <div id="folder-view-container">
                <h1>{this.state.data.label}</h1>
                <div className={folderViewClassNames}>{content}</div>
            </div>
        );
    }

    openFolder(itemId, selectedData, pageReload) {

        if (itemId === false) {
            alert('No manifest ID given!');
            return;
        }

        let url = itemId;
        let t = this;

        Manifest.get(
            url,
            function(manifestData) {

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
                if (selectedData !== undefined) {
                    selected = selectedData.id;
                } else {
                    selectedData = manifestData;
                }

                t.setState({
                    data: manifestData,
                    selected: selected
                });
                if (pageReload !== false) {
                    ManifestHistory.pageChanged(manifestData.id, manifestData.label);
                }

                if (manifestData.restricted === true) {
                    document.title = manifestData.label;
                }

                global.ee.emitEvent('update-current-folder-id', [manifestData.id]);
                global.ee.emitEvent('update-file-info', [selectedData]);
            }
        );

    }

    openImaginaryRootFolder(manifestData) {
        let imaginaryRootManifestData = {
            id: '-',
            type: 'sc:Collection',
            manifests: [manifestData],
            collections: []
        };

        this.setState({
            data: imaginaryRootManifestData,
            selected: manifestData.id
        });

        global.ee.emitEvent('update-file-info', [manifestData]);
    }

    openFolder = this.openFolder.bind(this);


    showListView() {
        this.setState({mode: 'list-view'});
    }

    showIconView() {
        this.setState({mode: 'icon-view'});
    }

    openFolder = this.openFolder.bind(this);
    showListView = this.showListView.bind(this);
    showIconView = this.showIconView.bind(this);

    componentDidMount() {
       global.ee.addListener('show-list-view', this.showListView);
       global.ee.addListener('show-icon-view', this.showIconView);
       global.ee.addListener('open-folder', this.openFolder);
       global.ee.addListener('update-file-info', this.updateFileInfo);

        let id = Manifest.getIdFromCurrentUrl();
        this.openFolder(id);
    }

    componentWillUnmount() {
        global.ee.removeListener('show-list-view', this.showListView);
        global.ee.removeListener('show-icon-view', this.showIconView);
        global.ee.removeListener('open-folder', this.openFolder);
        global.ee.removeListener('update-file-info', this.updateFileInfo);
    }




    updateFileInfo = this.updateFileInfo.bind(this);

    updateFileInfo(manifestData) {
        if (this.state.selected === manifestData.id) {
            return;
        }

        this.setState({
            selected: manifestData.id
        });
    }


}

export default translate('common')(FolderView);