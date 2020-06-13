import * as React from 'react';
import * as DOMPurify from 'dompurify';
import Cache from './lib/Cache';
import IManifestData from './interface/IManifestData';
import Config from './lib/Config';
import {Translation} from 'react-i18next';
import './css/manifestations-modal.css';
import './css/file-info.css';
import FileIcon from '@material-ui/icons/DescriptionOutlined';
import {ReactComponent as IIIFLogo} from './icons/iiif.svg';

interface IHTMLAnchorElement {
    nodeName: string;
    target?: string;
}

interface IProps {
    currentManifest: IManifestData;
}

declare let global: {
    config: Config;
};

class FileInfo extends React.Component<IProps, {}> {

    constructor(props: any) {

        super(props);

        this.showManifestationsModal = this.showManifestationsModal.bind(this);
    }

    render() {
        if (this.props.currentManifest.restricted) {
            return '';
        }

        const manifestData = this.props.currentManifest;
        const metadataView = [];

        // Add a hook to make all links open a new window
        DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
            // set all elements owning target to target=_blank
            if ('target' in node) {
                node.setAttribute('target', '_blank');
                // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
                node.setAttribute('rel', 'noopener noreferrer');
            }
        });

        if (manifestData.description !== undefined) {
            metadataView.push(<div key="description">
                <div className="label">
                    <Translation ns="common">{(t, { i18n }) => <p>{t('description')}</p>}</Translation>
                </div>
                <div className="value"dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                    __html: DOMPurify.sanitize(manifestData.description, global.config.getSanitizeRulesSet())
                }} />
            </div>);
        }

        if (manifestData.metadata !== undefined) {
            for (const key in manifestData.metadata) {
                if (manifestData.metadata.hasOwnProperty(key)) {
                    const metadataItem = manifestData.metadata[key];
                    metadataView.push(<div key={key}>
                        <div className="label">{metadataItem.label}</div>
                        <div className="value"dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                                __html: DOMPurify.sanitize(metadataItem.value, global.config.getSanitizeRulesSet())
                            }} />
                    </div>);
                }
            }
        }

        if (manifestData.attribution) {
            metadataView.push(<div key="attribution">
                <div className="label">
                    <Translation ns="common">{(t, { i18n }) => <p>{t('attribution')}</p>}</Translation>
                </div>
                <div className="value" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                    __html: DOMPurify.sanitize(manifestData.attribution, global.config.getSanitizeRulesSet())
                }} />
            </div>);
        }

        if (manifestData.license !== undefined) {
            metadataView.push(<div key="termsOfUsage">
                <div className="label">
                    <Translation ns="common">{(t, { i18n }) => <p>{t('license')}</p>}</Translation>
                </div>
                <div className="value"><a href={manifestData.license}>{manifestData.license}</a></div>
            </div>);
        }

        const logo = manifestData.logo;
        if (logo) {
            metadataView.push(<img key="providerLogo" id="provider-logo" src={logo} alt="Logo" title="Logo"/>);
        }

        if (
            manifestData.manifestations.length > 0 ||
            (manifestData.resource.manifestations && manifestData.resource.manifestations.length > 0)
        ) {
            metadataView.push(
                <div key="manifestation">
                    <div id="show-manifestation" onClick={this.showManifestationsModal}>
                        <Translation ns="common">{(t, { i18n }) => <p>{t('showFile')}</p>}</Translation>
                    </div>
                </div>
            );
        }

        return (
            <div id="file-info">
                <h3>{manifestData.label}</h3>
                {metadataView}
                <a id="iiif-logo" href={manifestData.id} target="_blank" rel="noopener noreferrer">
                    <IIIFLogo title="IIIF-Manifest" width={32} height={'100%'} /><br />
                </a>
            </div>
        );
    }

    addBlankTarget(input: string) {
        const tmp = document.createElement('div');
        tmp.innerHTML = input;
        for (let i = 0; i < tmp.children.length; i++) {
            const node: IHTMLAnchorElement = tmp.children[i];
            if (node.nodeName === 'A') {
                node.target = '_blank';
            }
        }
        return tmp.innerHTML;
    }

    showManifestationsModal() {

        const bodyJsx = [];
        let manifestations = [];
        const rawManifestations = this.props.currentManifest.manifestations;
        const resource = this.props.currentManifest.resource;
        if (rawManifestations.length > 0) {
            manifestations = rawManifestations;
        } else if (this.props.currentManifest.resource.manifestations && resource.manifestations.length > 0) {
            manifestations = resource.manifestations;
        }

        for (const i in manifestations) {
            if (manifestations.hasOwnProperty(i)) {
                const manifestation = manifestations[i];
                bodyJsx.push(
                    <div key={i} className="file-manifestation" onClick={() => this.openFile(manifestation.url)}>
                        <FileIcon />
                        {manifestation.label}
                    </div>
                );
            }
        }

        const alertArgs = {
            titleJsx: <Translation ns="common">{(t, { i18n }) => <p>{t('fileManifestations')}</p>}</Translation>,
            bodyJsx
        };
        Cache.ee.emit('alert', alertArgs);
    }

    openFile(url: string) {
        const win = window.open(url, '_target');
        if (win) {
            win.focus();
        }
    }
}

export default FileInfo;
