import React, { useEffect, useState } from 'react';
import { Translation } from 'react-i18next';
import IManifestData from "../interface/IManifestData";
import RangeSlider from 'rangeSlider/rangeSlider';
import TimelineCalendar from './calendar';
import TimelineResults from './results';
import Config from '../lib/Config';
import { getGroupedManifestsByDate, filterManifestsByDateRange } from './util';

declare let global: {
    config: Config;
};

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
    const { manifest, selectedYear, selectedMonth } = props;
    const [filterRange, setFilterRange] = useState<number[]>(global.config.getOverviewYearSliderDefaultRange());
    const [groupedManifests, setGroupedManifests] = useState<LooseObject>({});
    const [filteredManifests, setFilteredManifests] = useState<LooseObject>({});
    const [minYear, setMinYear] = useState<number>(0);
    const [maxYear, setMaxYear] = useState<number>(0);

    useEffect(() => {
        let newRange: number[];
        let grpManifests: LooseObject = {};
        let minY: number;
        let maxY: number;
        let yearsArray: string[];

        if (manifest?.manifests) {
            grpManifests = getGroupedManifestsByDate(manifest.manifests);
            yearsArray = Object.keys(grpManifests);
            minY = parseInt(yearsArray[0]);
            maxY = parseInt(yearsArray[yearsArray.length - 1]);
            newRange = [
                Math.max(minY, filterRange[0]), Math.min(maxY, filterRange[1])
            ];
            if (newRange !== filterRange) {
                setFilterRange(newRange);
            }
            setMinYear(minY);
            setMaxYear(maxY);
            setGroupedManifests(grpManifests);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manifest]);

    useEffect(() => {
        setFilteredManifests(filterManifestsByDateRange(groupedManifests, filterRange[0], filterRange[1]));
    }, [groupedManifests, filterRange]);

    return (
        <Translation ns="common">
            {(t) => (
                <>
                    {(Object.keys(groupedManifests).length > 0) && (
                        <>
                            <h2>{t('pageOverviewH2')}</h2>
                            <RangeSlider
                                marks={Object.keys(groupedManifests).map((value: string) => ({ value: parseInt(value) }))}
                                value={filterRange}
                                setValue={setFilterRange}
                                min={minYear}
                                max={maxYear}
                                valueLabelDisplay="on"
                            />
                        </>
                    )}
                    {Object.keys(filteredManifests).length > 0 ? (
                        <table className="aiii-timeline-results table">
                            <tbody>
                                {Object.keys(filteredManifests).map((year) => (
                                    <React.Fragment key={year}>
                                        <TimelineCalendar year={year} manifestsByMonth={filteredManifests[year]} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                                        <TimelineResults year={year} manifestsByMonth={filteredManifests[year]} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : null}
                </>
            )}
        </Translation>
    )
};

export default Timeline;