import React, { useEffect } from 'react';
import i18next from 'i18next';
import './mirador.css';
import IManifestData from "../../interface/IManifestData";

import Mirador from 'mirador';
import ocrHelperPlugin from '@4eyes/mirador-ocr-helper';

interface IProps {
    manifest: IManifestData;
}

export default function ReactMirador({manifest}: IProps) {
    // init viewer
    useEffect(() => {
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
                manifestId: manifest.id,
              },
            ],
            language: i18next.language
          };
          
          Mirador.viewer(config, [...ocrHelperPlugin]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return <div id={'mirador'} className="aiiif-mirador" key={manifest.id}></div>;
}
