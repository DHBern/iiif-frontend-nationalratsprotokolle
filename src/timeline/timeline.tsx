import React from 'react';
import moment from 'moment';
import IManifestData, { IManifestReference } from "../interface/IManifestData";
import TimelineCalendar from './calendar';
import TimelineResults from './results';
require('./timeline.css');

interface LooseObject {
    [key: string]: any
}

interface IProps {
    manifest: IManifestData | undefined,
    selectedYear: string | undefined,
    selectedMonth: string | undefined,
}

const Timeline = function (props: IProps) {
    const {manifest, selectedYear, selectedMonth} = props;
    let groupedManifests: LooseObject = {};
    
    manifest?.manifests.map((manifest: IManifestReference) => {
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

        return groupedManifests;
    });

    if (Object.keys(groupedManifests).length === 0) {
        return null;
    }

    return (
        <table className="aiii-timeline-results table">
            <tbody>
                {Object.keys(groupedManifests).map((year) => (
                    <React.Fragment key={year}>
                        <TimelineCalendar year={year} manifestsByMonth={groupedManifests[year]} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                        <TimelineResults year={year} manifestsByMonth={groupedManifests[year]} selectedMonth={selectedMonth} selectedYear={selectedYear}  />
                    </React.Fragment>
                ))}
            </tbody>
        </table>    
    );
};

export default Timeline;