import React from 'react';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
import { Translation } from 'react-i18next';
import { getLocalized } from "../lib/ManifestHelpers";
import { IManifestReference } from "../interface/IManifestData";


interface IManifestReferenceByMonth {
    [key: string]: IManifestReference
}

interface IProps {
    year: string,
    selectedYear: string | undefined,
    selectedMonth: string | undefined,
    manifestsByMonth: IManifestReferenceByMonth[]
}

const TimelineResults = function (props: IProps) {
    const { year, selectedMonth, selectedYear, manifestsByMonth } = props;
    const isExpanded = year === selectedYear;

    return (
        <Translation ns="common">
            {(t) => (
            <tr className="aiii-timeline-results">
                <td className="nopadding noborder" colSpan={13}>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div className={`aiii-timeline-results__inner`} initial="collapsed" animate="expanded" exit="collapsed" variants={{
                                expanded: { opacity: 1, height: 'auto' },
                                collapsed: { opacity: 0, height: 0, transition: { duration: 0.15 } },
                            }}>
                                <table className="table table-striped table-bordered nomargin">
                                    <thead>
                                        <tr>
                                            <th>{t('timelineResultsDate')}</th>
                                            <th>{t('timelineResultsTitle')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(manifestsByMonth).map((month) => (
                                            manifestsByMonth[month].map((manifest: IManifestReference) => {
                                                const date = moment(manifest.navDate);
                                                const dateMonth = date.month().toString();
                                                const dateYear = date.year().toString();
                                                return (dateYear === selectedYear && dateMonth === selectedMonth) && (
                                                    <tr key={manifest.id}>
                                                        <td>{date.format(t('timelineResultsDateFormat'))}</td>
                                                        <td>
                                                            <a href={`/protocol?manifest=${manifest.id}`}>{getLocalized(manifest.label)}</a>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </td>
            </tr>
            )}
        </Translation>
    );
};

export default TimelineResults;