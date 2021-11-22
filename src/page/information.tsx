import React from 'react';
import { Translation } from 'react-i18next';
import Main from "../main/main";
import * as DOMPurify from "dompurify";
import {getLocalized, sanitizeRulesSet} from "../lib/ManifestHelpers";
import browserImage from "../images/scrn-browser.png";
import miradorImage from "../images/scrn-mirador.png";

export default function PageOverview() {
    return (
        <Translation ns="common">
            {(t) => (
                <Main>
                    <>
                        <h1>{t('pageInformationH1')}</h1>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoIntro'), sanitizeRulesSet)
                        }} />

                        <h2>{t('infoSearchH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoSimple'), sanitizeRulesSet)
                        }} />
                        <ul dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: t('infoSimpleList')
                        }}>
                        </ul>

                        <h2>{t('infoResultH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoResult'), sanitizeRulesSet)
                        }} />

                        <h2>{t('navItemOverview')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoBrowserBeforeImage'), sanitizeRulesSet)
                        }} />
                        <img alt={t('infoBrowserImageAlt')} src={browserImage} />
                        <div className="italic" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoBrowserImageAlt'), sanitizeRulesSet)
                        }} />

                        <h2>{t('infoMiradorH2')}</h2>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMirador'), sanitizeRulesSet)
                        }} />
                        <ul dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: t('infoMiradorList')
                        }}>
                        </ul>
                        <img alt={t('infoMiradorImageAlt')} src={miradorImage} />
                        <div className="italic" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('infoMiradorImageAlt'), sanitizeRulesSet)
                        }} />
                    </>
                </Main>
            )}
        </Translation>
    );
}
