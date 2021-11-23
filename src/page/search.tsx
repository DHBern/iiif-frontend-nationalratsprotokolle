import React from 'react';
import { Translation } from 'react-i18next';
import Search from "../search/search";
import Main from "../main/main";
import * as DOMPurify from "dompurify";

export default function PageSearch() {
    return (
        <Translation ns="common">
            {(t) => (
                <Main>
                    <>
                        <h1>{t('pageSearchH1')}</h1>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t('searchIntroductionText'))
                        }} />
                        <Search />
                    </>
                </Main>
            )}
        </Translation>
    );
}
