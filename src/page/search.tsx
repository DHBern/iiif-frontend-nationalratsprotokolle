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
                        <div style={{marginTop: '80px'}}>
                            <h3 dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                                __html: DOMPurify.sanitize(t('searchIntroductionText'))
                            }} />
                        </div>
                        <h1>{t('pageSearchH1')}</h1>
                        <Search />
                    </>
                </Main>
            )}
        </Translation>
    );
}
