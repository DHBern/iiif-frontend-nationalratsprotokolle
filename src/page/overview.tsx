import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Translation } from 'react-i18next';
import PresentationApi from "../fetch/PresentationApi";
import Timeline from "../timeline/timeline";
import Main from "../main/main";
import IManifestData from 'interface/IManifestData';


export default function PageOverview() {
    const [manifest, setManifest] = useState<IManifestData | undefined>(undefined);
    const [year, setYear] = useState<string | undefined>(undefined);
    const [month, setMonth] = useState<string | undefined>(undefined);
    const url = process.env.REACT_APP_DEFAULT_COLLECTION_MANIFEST;
    const location = useLocation();

    useEffect(() => {
        const queryParams = Object.fromEntries(new URLSearchParams(location.search));
        setYear(queryParams.year);
        setMonth(queryParams.month);
    }, [location])

    if (url && !manifest) {
        PresentationApi.get(url).then((fetchedManifest: IManifestData) => {
            setManifest(fetchedManifest);
        })
    }

    return (
        <Main>
            <Translation ns="common">
                {(t) => (
                    <>
                        <h1>{t('pageOverviewH1')}</h1>
                        {manifest && (
                            <Timeline manifest={manifest} selectedYear={year} selectedMonth={month} />
                        )}
                        {!url && (
                            <p>{t('pageOverviewManifestUndefined')}</p>
                        )}
                    </>
                )}
            </Translation>
        </Main>
    );
}
