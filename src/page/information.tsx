import React from 'react';
import { Translation } from 'react-i18next';
import Main from "../main/main";
import * as DOMPurify from "dompurify";
import browserImage from "../images/scrn-browser.png";
import miradorImage from "../images/scrn-mirador.png";

export default function PageOverview() {
    DOMPurify.addHook('afterSanitizeAttributes', function (node: any) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener');
        }
    });
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
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoBrowserBeforeImage'))
                        }} />
                        <img alt={t('infoBrowserImageAlt')} src={browserImage} />
                        <div className="italic" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoBrowserImageAlt'))
                        }} />

                        <h2>{t('infoMiradorH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMirador'))
                        }} />
                        <ul dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMiradorList'))
                        }}>
                        </ul>
                        <img alt={t('infoMiradorImageAlt')} src={miradorImage} />
                        <div className="italic" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMiradorImageAlt'))
                        }} />
                    </>
                </Main>
            )}
        </Translation>
    );
}
