import moment from 'moment';
import { IManifestReference } from "../interface/IManifestData";

interface LooseObject {
    [key: string]: any
}

export const getGroupedManifestsByDate = (manifests: IManifestReference[]) => {
    let groupedManifests: LooseObject = {};

    manifests.map((manifest: IManifestReference) => {
        if (!manifest.navDate) return null;

        const date = moment(manifest.navDate);
        const month = date.month().toString();
        const year = date.year().toString();


        groupedManifests = {
            ...groupedManifests,
            [year]: {
                ...((groupedManifests && groupedManifests[year]) || {}),
                [month]: [
                    ...((groupedManifests && groupedManifests[year] && groupedManifests[year][month]) || []),
                    manifest
                ]
            }
        };

        return null;
    });

    return groupedManifests;
}


export const filterManifestsByDateRange = (groupedManifests: LooseObject, minYear: number, maxYear: number) => {
    let filteredManifests: LooseObject = {};

    Object.keys(groupedManifests).map((yearString: string) => {
        const year: number = parseInt(yearString);

        if (year >= minYear && year <= maxYear) {
            filteredManifests[year] = groupedManifests[year];
        }

        return null;
    });

    return filteredManifests;
}