import React from 'react';
import i18next from 'i18next';
import Config from '../lib/Config';
import './search.css';

declare let global: {
    config: Config;
};

interface IProps {
    rows: number,
    setRows: React.Dispatch<React.SetStateAction<string|null>>,
    sort: string,
    setSort: React.Dispatch<React.SetStateAction<string|null>>,
}

const SearchSorting = (props: IProps) => {
    const { rows, setRows, sort, setSort } = props;
    const availableRows = global.config.getAvailableSearchRows();
    const availableSorts = global.config.getAvailableSearchSorts();

    return (
        <div className='simple-filters'>
            <div className="simple-filters__rows">
            <div className="simple-filters__row simple-filters__row--left">
            <label>{i18next.t('searchFormOrderBy')}</label>
                    <select className="form-control" value={sort} onChange={(ev) => setSort(ev.currentTarget.value)}>
                        {availableSorts.map((value) => (
                            <option key={value} value={value}>{i18next.t(`searchFormOrderBy_${value}`)}</option>
                        ))}
                    </select>
                </div>
                <div className="simple-filters__row simple-filters__row--right">
                    <label>{i18next.t('searchFormRowsPerPage')}</label>
                    <select className="form-control" value={rows} onChange={(ev) => setRows(ev.currentTarget.value)}>
                        {availableRows.map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default SearchSorting;