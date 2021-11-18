import React, { useEffect, useContext } from 'react';
import i18next from 'i18next';
import './mirador.css';

import Mirador from 'mirador';
import ocrHelperPlugin from '@4eyes/mirador-ocr-helper';
// https://github.com/ProjectMirador/mirador/commit/2759fccc641b40b9fff0b9da5ef83d6ecd0e3dd2#diff-90d821e4b96f948716bc831f305dea317c3c9e49c8270798d85017859044de0c
//@ts-ignore
import * as actions from 'mirador/dist/es/src/state/actions/index.js';

import { AppContext } from "../../AppContext";

export default function ReactMirador() {
    const { currentManifest } = useContext(AppContext);
    const { searchParams } = new URL(window.location.href);
    const canvasImageName = searchParams.has('cv') ? searchParams.get('cv') : '';
    const collectionParts = canvasImageName?.split('-');
    const collectionName = collectionParts ? collectionParts[0] : '';
    const canvasId = `${process.env.REACT_APP_MANIFEST_API_BASE}${collectionName}/canvasses/${canvasImageName}`;

    // init viewer
    useEffect(() => {
        let viewerInstance = null;
        let windows = {};

        if (currentManifest && currentManifest.id) {
            if (searchParams.has('cv')) {
                windows = {
                    loadedManifest: searchParams.get('manifest'),
                    canvasId,
                };
            } else {
                windows = {
                    manifestId: currentManifest.id
                }
            }
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
                thumbnailNavigation: {
                    defaultPosition: 'far-right',
                },
                windows: [
                    windows,
                ],
                language: i18next.language
            };

            viewerInstance = Mirador.viewer(config, [...ocrHelperPlugin]);
            const { store } = viewerInstance;

            if (searchParams.has('q')) {
                const state = store.getState();
                const targetId = Object.keys(state.windows)[0];
                const companionWindows: any = Object.values(state.companionWindows)
                    .filter((obj: any) => obj.content !== 'thumbnailNavigation');

                new Promise((resolve) => resolve(
                    store.dispatch(
                        actions.updateCompanionWindow(
                            targetId,
                            companionWindows[0].id,
                            {
                                content: 'search',
                                position: 'left'
                            }
                        )
                    )
                )).then(() => {
                    const searchUrl = `${process.env.REACT_APP_MANIFEST_SEARCH_URL}/${collectionName}?q=${searchParams.get('q')}`;

                    new Promise((resolve) => resolve(
                        store.dispatch(
                            actions.fetchSearch(
                                targetId,
                                companionWindows[0].id,
                                searchUrl
                            )
                        )
                    )).then(() => {
                        store.dispatch(
                            actions.setCanvas(
                                targetId,
                                canvasId
                            )
                        );
                    })
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentManifest]);

    return (currentManifest) ? <div id={'mirador'} className="aiiif-mirador" key={currentManifest.id}></div> : null;
}
