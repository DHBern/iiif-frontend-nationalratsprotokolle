import React from 'react';
import { Translation } from 'react-i18next';
import Search from "../search/search";
import Main from "../main/main";
import * as DOMPurify from "dompurify";

export default function PageSearchAdvanced() {
    return (
        <Translation ns="common">
            {(t) => (
                <Main>
                    <>
                        <div style={{marginTop: '40px', marginBottom: '40px'}}>
                            <h1>{t('headerProjectSubtitle')}</h1>
                            <h3 dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                                __html: DOMPurify.sanitize(t('searchIntroductionText'))
                            }} />
                        </div>
                        <Search mode="advanced" />
                    </>
                </Main>
            )}
        </Translation>
    );
}
