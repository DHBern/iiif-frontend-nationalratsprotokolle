import React from 'react';
import {Translation, useTranslation} from 'react-i18next';
import Main from "../main/main";
import * as DOMPurify from "dompurify";
import browserImageDe from "../images/de-scrn-browser.png";
import miradorImageDe from "../images/de-scrn-mirador.png";
import browserImageEn from "../images/en-scrn-browser.png";
import miradorImageEn from "../images/en-scrn-mirador.png";
import browserImageFr from "../images/fr-scrn-browser.png";
import miradorImageFr from "../images/fr-scrn-mirador.png";
import browserImageIt from "../images/it-scrn-browser.png";
import miradorImageIt from "../images/it-scrn-mirador.png";

export default function PageOverview() {
    DOMPurify.addHook('afterSanitizeAttributes', function (node: any) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener');
        }
    });
    const { i18n } = useTranslation();
    let browserImage = browserImageDe; // fallback
    let miradorImage = miradorImageDe; // fallback
    switch(i18n.language) {
        case 'de':
            browserImage = browserImageDe;
            miradorImage = miradorImageDe;
            break;
        case 'en':
            browserImage = browserImageEn;
            miradorImage = miradorImageEn;
            break;
        case 'fr':
            browserImage = browserImageFr;
            miradorImage = miradorImageFr;
            break;
        case 'it':
            browserImage = browserImageIt;
            miradorImage = miradorImageIt;
            break;
    }
    return (
        <Translation ns="common">
            {(t) => (
                <Main>
                    <>
                        <h1>{t('pageInformationH1')}</h1>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoIntro'))
                        }} />

                        <h2>{t('infoSearchH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoSimple'))
                        }} />
                        <ul dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoSimpleList'))
                        }}>
                        </ul>

                        <h2>{t('infoResultH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoResult'))
                        }} />

                        <h2>{t('navItemOverview')}</h2>
                        <div >
                            <p dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoBrowserBeforeImage'))
                        }} />

                        <img alt={t('infoBrowserImageAlt')} src={browserImage} />
                        </div>

                        <h2>{t('infoMiradorH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMirador'))
                        }} />
                        <ul dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMiradorList'))
                        }}>
                        </ul>
                        <img alt={t('infoMiradorImageAlt')} src={miradorImage} />

                        <div>
                            <p dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMiradorImageLegend'))
                        }} />
                        </div>
                        <h2>{t('infoDataH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoData'))
                        }} />
                        <h2>{t('infoHandH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoHand'))
                        }} />
                        <h2>{t('infoMachineH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMachine'))
                        }} />
                    </>
                </Main>
            )}
        </Translation>
    );
}
