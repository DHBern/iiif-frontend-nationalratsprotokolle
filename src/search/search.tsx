import React, { useEffect, useState, useRef } from 'react';
import { Translation } from 'react-i18next';
import { useQueryState } from '../util/hooks';
import Pagination from '../pagination/pagination';
import SearchForm from "../search/form";
import SearchResults from "../search/results";
import SearchSimpleFilters from "../search/simpleFilters";
import { ISearchResults, ISolrRequest } from 'interface/IOcrSearchData';
import Config from '../lib/Config';
import './search.css';

declare let global: {
    config: Config;
};

const Search = () => {
    const [queryParams, setQueryParams] = useState<ISolrRequest>(global.config.getSolrFieldConfig());
    const [searchResults, setSearchResults] = useState<ISearchResults | undefined>(undefined);
    const [page, setPage] = useQueryState('page', '1');
    const [rows, setRows] = useQueryState('rows', global.config.getSolrFieldConfig().rows);
    const searchRef = useRef(null);

    const numFound = parseInt((searchResults?.response?.numFound || '0').toString());
    const totalPages = Math.ceil(numFound / Number(rows));

    useEffect(() => {
        setPage(null);
        setQueryParams({ ...queryParams, rows: rows, start: String(0) });
    }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const newStart = (Number(page) - 1) * Number(rows);
        setQueryParams({ ...queryParams, rows: rows, start: String(newStart) });
    }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Translation ns="common">
            {(t) => (
                <div className="search" ref={searchRef}>
                    <SearchForm queryParams={queryParams} setQueryParams={setQueryParams} searchResults={searchResults} setSearchResults={setSearchResults} />
                    {numFound > 0 && <SearchSimpleFilters rows={Number(rows)} setRows={setRows} />}
                    {totalPages > 1 && <Pagination page={Number(page)} count={totalPages} rowsPerPage={Number(rows)} showFirstButton showLastButton />}
                    <SearchResults queryParams={queryParams} searchResults={searchResults} />
                    {totalPages > 1 && <Pagination page={Number(page)} count={totalPages} rowsPerPage={Number(rows)} showFirstButton showLastButton scrollToRefOnClick={searchRef} />}
                </div>
            )}
        </Translation>
    );
}

export default Search;