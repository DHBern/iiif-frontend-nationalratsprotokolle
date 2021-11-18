import React from 'react';
import { Translation } from 'react-i18next';
import Search from "../search/search";
import Main from "../main/main";

export default function PageSearch() {
    return (
        <Translation ns="common">
            {(t) => (
                <Main>
                    <>
                        <h1>{t('pageSearchH1')}</h1>
                        <Search />
                    </>
                </Main>
            )}
        </Translation>
    );
}
