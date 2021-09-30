import React from 'react';
import i18next from 'i18next';
import './mirador.css';
import IManifestData from "../../interface/IManifestData";

import Mirador from 'mirador';
import ocrHelperPlugin from '@4eyes/mirador-ocr-helper';

interface IProps {
  manifest: IManifestData;
}
interface IState {
  manifest: IManifestData;
}
export default class ReactMirador extends React.Component<IProps, IState> {

  private miradorInstance: any;

  constructor(props: IProps) {

    super(props);

    this.state = {
      manifest: props.manifest
    };
  }
  // init viewer
  componentDidMount() {
    const config = {
      id: 'mirador',
      workspace: {
        allowNewWindows: false,
        isWorkspaceAddVisible: false
      },
      window: {
        allowClose: true,
        textOverlay: {
          enabled: true,
          visible: true,
        },
        sideBarOpenByDefault: true,
        panels: {
          info: true
        }
      },
      windows: [
        {
          canvasIndex: 8,
          manifestId: this.state.manifest.id,
        },
      ],
      language: i18next.language
    };

    this.miradorInstance = Mirador.viewer(config, [...ocrHelperPlugin]);

    // i18next.on('languageChanged', this.languageChanged.bind(this))
  };

  languageChanged() {
    console.log({i: this.miradorInstance})

    this.miradorInstance.store.dispatch({type: 'UPDATE_CONFIG',
      language: i18next.language,
    });
  }

  render() {
    return <div id={'mirador'} className="aiiif-mirador" key={this.state.manifest.id}></div>;
  }
}
