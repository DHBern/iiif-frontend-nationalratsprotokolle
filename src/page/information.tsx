import React from 'react';
import { Translation } from 'react-i18next';
import Main from "../main/main";

export default function PageOverview() {
    return (
        <Translation ns="common">
            {(t) => (
                <Main>
                    <>
                        <h1>{t('pageInformationH1')}</h1>
                        <p>{t('infoIntroP1')}</p>
                        <p>{t('infoIntroP2')}</p>
                        <p>{t('infoIntroP3')}</p>

                        <h2>{t('infoSearchH2')}</h2>
                        <p>{t('infoSimpleP1')}</p>
                        <p>{t('infoSimpleP2')}</p>
                        <p>{t('infoSimpleP3')}</p>
                        <ul>
                            <li>{t('infoSimpleL1')}</li>
                            <li>{t('infoSimpleL2')}</li>
                            <li>{t('infoSimpleL3')}</li>
                        </ul>

                        <h2>{t('infoResultH2')}</h2>
                        <p>{t('infoResultP1')}</p>
                        <p>{t('infoResultP2')}</p>

                        <h2>{t('navItemOverview')}</h2>
                        <p>{t('infoBrowserP1')}</p>
                        <span>IMAGE TODO</span>
                    </>
                </Main>
            )}
        </Translation>
    );
}
