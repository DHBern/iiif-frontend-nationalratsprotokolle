import React, { useEffect, useState, useRef } from 'react';
import { Translation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Pagination from '../pagination/pagination';
import SearchForm from "../search/form";
import SearchResults from "../search/results";
import { ISearchResults, ISolrRequest } from 'interface/IOcrSearchData';
import Config from '../lib/Config';
import './search.css';

declare let global: {
    config: Config;
};

const Search = () => {
    const qpPage = new URLSearchParams(useLocation().search).get('page');
    const rowsPerPage = parseInt(global.config.getSolrFieldConfig().rows);
    const [queryParams, setQueryParams] = useState<ISolrRequest>(global.config.getSolrFieldConfig());
    const [searchResults, setSearchResults] = useState<ISearchResults | undefined>(undefined);
    const [page, setPage] = useState<number>(qpPage ? parseInt(qpPage) : 1);
    const searchRef = useRef(null);

    const numFound = parseInt((searchResults?.response?.numFound || '0').toString());
    const totalPages = Math.ceil(numFound / rowsPerPage);

    useEffect(() => {
        const newPage = qpPage ? parseInt(qpPage) : 1;
        const newStart = (newPage - 1) * rowsPerPage;
        setPage(newPage);
        setQueryParams({...queryParams, start: String(newStart)});
    }, [qpPage]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Translation ns="common">
            {(t) => (
                <div className="search" ref={searchRef}>
                    <SearchForm queryParams={queryParams} setQueryParams={setQueryParams} searchResults={searchResults} setSearchResults={setSearchResults} />
                    {totalPages > 1 && <Pagination page={page} count={totalPages} rowsPerPage={rowsPerPage} showFirstButton showLastButton />}
                    <SearchResults queryParams={queryParams} searchResults={searchResults} />
                    {totalPages > 1 && <Pagination page={page} count={totalPages} rowsPerPage={rowsPerPage} showFirstButton showLastButton scrollToRefOnClick={searchRef} />}
                </div>
            )}
        </Translation>
    );
}

export default Search;