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
                        <p>To be defined</p>
                    </>
                </Main>
            )}
        </Translation>
    );
}
