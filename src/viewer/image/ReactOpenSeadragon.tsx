import React, {useRef, useEffect, useState, useContext} from 'react';
import * as OpenSeadragon from 'openseadragon';
import ImageApi from '../../fetch/ImageApi';
import ViewerSpinner from '../ViewerSpinner';
import Token from "../../lib/Token";
//import {AnnotationType} from "../../fetch/SearchApi";
//import Cache from "../../lib/Cache";
import i18next from 'i18next';
import './openSeadragon.css';
import {Options, Viewer} from "openseadragon";
import ImageButtons from "./ImageButtons";
import {AppContext} from "../../AppContext";
import {AnnotationType} from "../../fetch/SearchApi";

interface IProps {
    source: any[];
}

const buttons = [
    {
        id: 'home',
        t: 'common:zoomReset'
    },
    {
        id: 'zoom-in',
        t: 'common:zoomIn'
    },
    {
        id: 'zoom-out',
        t: 'common:zoomOut'
    },
    {
        id: 'fullpage',
        t: 'common:toggleFullScreen'
    },
    {
        id: 'rotate-right',
        t: 'common:rotateRight'
    }
]

export default function ReactOpenSeadragon(props: IProps) {

    const {page, setPage, currentAnnotation, searchResult} = useContext(AppContext);
    const viewer = useRef<Viewer | undefined | null>(undefined);
    const id = useRef<number>(Math.random());


    const [spinner, setSpinner] = useState<boolean>(true);
    const [showButtons, setShowButtons] = useState<boolean>(true);


    useEffect(() => {
        if (currentAnnotation)
        {
            setPage(currentAnnotation.page);
        }
    }, [currentAnnotation, setPage]);

    // change page
    useEffect(() => {

        if (!viewer.current) {
            return;
        }

        setSpinner(true);
        const oldImage = viewer.current.world.getItemAt(0);
        viewer.current.world.removeItem(oldImage);

        ImageApi.get(props.source[page].id, function(result: any) {

            if (!viewer.current) {
                return;
            }

            viewer.current.addTiledImage({
                tileSource: result,
                success: () => {
                    setSpinner(false);
                }
            });
        });

    }, [page, props.source]);

    // redraw annotations
    useEffect(() => {
        if (!viewer.current) {
            return;
        }

        viewer.current.clearOverlays();

        for (const r of searchResult) {
            const annotation = r.resource;
            if (annotation.page !== page) {
                continue;
            }

            const elt = document.createElement("div");
            elt.className = "aiiif-highlight";

            if (currentAnnotation && annotation.id === currentAnnotation.id) {
                elt.className += ' active';
            }

            const imageWidth = props.source[annotation.page].width;
            viewer.current.addOverlay({
                element: elt,
                location: new OpenSeadragon.Rect(
                    annotation.x/imageWidth,
                    annotation.y/imageWidth,
                    annotation.width/imageWidth,
                    annotation.height/imageWidth)
            });
        }

    });

    // init viewer
    useEffect(() => {
        if(viewer.current !== undefined) {
            return;
        }

        viewer.current = null;


        ImageApi.get(props.source[page].id, function(result: any) {

            if (result[0] && result[0].statusCode === 401) {
                viewer.current = undefined;
                return;
            }

            const options: Options = {
                id: 'openseadragon-' + id.current,
                defaultZoomLevel: 0,
                tileSources: result,
                showNavigationControl: true,
                showNavigator: false,
                showRotationControl: true,
                maxZoomPixelRatio: 2,
                controlsFadeDelay: 250,
                controlsFadeLength: 250,
                navigatorPosition: 'BOTTOM_RIGHT',
                animationTime:  1.2,
                visibilityRatio:  0.5,
                blendTime:  0,
                zoomInButton: 'zoom-in-button-'+ id.current,
                zoomOutButton: 'zoom-out-button-'+ id.current,
                homeButton: 'home-button-'+ id.current,
                fullPageButton: 'fullpage-button-'+ id.current,
                rotateRightButton: 'rotate-right-button-'+ id.current,
                ajaxWithCredentials: false,
                minZoomLevel: 0.3,
                viewportMargins: {left: 12, top: 12, right: 12, bottom: 12}
            };

            if (result.authService && result.authService.token && Token.has(result.authService.token)) {
                options['ajaxHeaders'] = {
                    Authorization: 'Bearer ' + Token.get(result.authService.token)
                };
            }

            OpenSeadragon.setString("Tooltips.Home", i18next.t('common:zoomReset'));
            OpenSeadragon.setString("Tooltips.ZoomOut",i18next.t('common:zoomOut'));
            OpenSeadragon.setString("Tooltips.ZoomIn",  i18next.t('common:zoomIn'));
            OpenSeadragon.setString("Tooltips.FullPage",  i18next.t('common:toggleFullScreen'));
            OpenSeadragon.setString("Tooltips.RotateRight",  i18next.t('common:rotateRight'));

            viewer.current = new OpenSeadragon.Viewer(options);
            viewer.current.addHandler('tile-drawn', () => {
                setSpinner(false);
            });

        });
    });

    useEffect(() => {

        const changeLanguage = () => {
            for (const b of buttons) {
                const element = document.getElementById(b.id + '-button-' + id.current.toString());
                if (element) {
                    element.title = i18next.t(b.t);
                }
            }
        }

        i18next.on('languageChanged', changeLanguage);

        return () => {
            if (viewer.current) {
                viewer.current.removeAllHandlers('tile-drawn');
            }
            i18next.off('languageChanged', changeLanguage);
        }
    })

    return <div id={'openseadragon-' + id.current.toString()} className="aiiif-openseadragon" key={props.source[0]}
                onMouseEnter={() => setShowButtons(true)}
                onMouseLeave={() => setShowButtons(false)} >
        <ImageButtons data={props.source} viewerId={id.current}  show={showButtons}/>
        <ViewerSpinner show={spinner} />
    </div>;
}
