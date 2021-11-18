import React from 'react';
import { Translation } from 'react-i18next';
import SearchForm from "../search/form";
import SearchResults from "../search/results";
import { ISearchResults, ISolrRequest } from 'interface/IOcrSearchData';
import Config from '../lib/Config';
import './search.css';

declare let global: {
    config: Config;
};

interface IProps {
}

interface IState {
    queryParams: ISolrRequest,
    searchResults: ISearchResults | undefined
}

class Search extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    
        this.state = {
            queryParams: global.config.getSolrFieldConfig(),
            searchResults: undefined
        };
    }

    setQueryParams = (qp: ISolrRequest) => {
        this.setState({queryParams: qp})
    }

    setSearchResults = (sr: ISearchResults) => {
        this.setState({searchResults: sr})
    }

    render () {
        const { queryParams, searchResults } = this.state;

        return (
            <Translation ns="common">
                {(t) => (
                    <div className="search">
                        <SearchForm queryParams={queryParams} setQueryParams={this.setQueryParams} searchResults={searchResults} setSearchResults={this.setSearchResults} />
                        <SearchResults queryParams={queryParams} searchResults={searchResults} />
                    </div>
                )}
            </Translation>
        );
    }
}

export default Search;