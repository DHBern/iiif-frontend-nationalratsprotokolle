import React, { Dispatch, SetStateAction } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { Icon, LinearProgress, TextField } from '@material-ui/core';
import { ISearchResults, ISolrRequest } from 'interface/IOcrSearchData';
import { menuItems } from '../navigation/navigation';
import { replaceSearchParameters } from '../util/url';
import { isSolrFrequencySortable } from 'util/solr';
import Config from '../lib/Config';

declare let global: {
    config: Config;
};

interface IProps extends RouteComponentProps<any> {
    queryParams: ISolrRequest,
    setQueryParams: (qp: ISolrRequest) => void,
    searchResults: ISearchResults | undefined,
    setSearchResults: (sr: ISearchResults) => void,
    sort: string,
    setSort: Dispatch<SetStateAction<string | null>>,
    errors: string[],
    setErrors: (e: string[]) => void,
}

interface IState {
    query: string,
    isSearchPending: boolean,
    sources: string[],
}

class SearchFormSimple extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const queryParams = Object.fromEntries(new URLSearchParams(props.location.search));

        this.state = {
            query: queryParams.q || '',
            isSearchPending: false,
            sources: ['gbooks', 'lunion'],
        };
    }

    defaultQueryParams: ISolrRequest = global.config.getSolrFieldConfig();

    componentDidMount() {
        if (this.state.query !== '') {
            this.onSubmit();
        }
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        const queryIsSet = this.state.query || (prevState.query !== this.state.query && prevState.query !== '');
        const queryParamsChanges = JSON.stringify(prevProps.queryParams) !== JSON.stringify(this.props.queryParams);

        if (queryIsSet && queryParamsChanges) {
            this.onSubmit();
        }
    }

    onSubmit(evt?: React.SyntheticEvent) {
        const { sources, query } = this.state;
        const { queryParams, history, setQueryParams, setSearchResults, errors, setErrors, sort, setSort } = this.props;
        const trimmedQuery = query.trim();
        const start = queryParams?.start || '1';
        const fq = [];
        if (query === '') {
            evt?.preventDefault();
            return;
        }
        if (evt) {
            evt.preventDefault();
            history.push(replaceSearchParameters({ q: query, page: null }));
        }
        const params = {
            ...queryParams,
            q: query,
            fl: this.defaultQueryParams.fl
        };
        if (Array.isArray(sources) && sources.length === 1) {
            fq.push(`source:${sources[0]}`);
        }
        if (fq.length > 0) {
            params.fq = fq.join(' AND ');
        }
        if (start !== '0') {
            params.start = start;
        }
        if(sort === 'frequency') {
            const termfrequency = `termfreq(ocr_text,'${trimmedQuery}')`

            if (isSolrFrequencySortable(trimmedQuery)) {
                params.fl = `${this.defaultQueryParams.fl},freq:${termfrequency}`;
                params.sort = `${termfrequency} desc`;
            } else {
                delete (params.sort);
                setSort(null);
            }
        } else if (!['relevance'].includes(sort)) {
            params.sort = sort;
        } else {
            delete (params.sort);
            setSort(null);
        }

        fetch(`${process.env.REACT_APP_SOLR_API_BASE}?${new URLSearchParams(params)}`)
            .then((resp) => resp.json())
            .then((data: ISearchResults) => {
                this.setState({ isSearchPending: false })
                setSearchResults(data);
                // remove error 400BadSolrRequest if set
                setErrors(errors.filter((error) => error !== '400BadSolrRequest'));
            })
            .catch((err) => {
                console.error(err);
                this.setState({ isSearchPending: false });
                setSearchResults(undefined as any);
                setErrors([...errors, '400BadSolrRequest']);
            });
        this.setState({
            isSearchPending: true
        });
        setQueryParams(params);
    }

    render() {
        const {
            isSearchPending,
            sources,
            query,
        } = this.state;

        const {
            searchResults,
            queryParams
        } = this.props

        const advancedSearchMenuItem = menuItems.find((item) => item.name === 'SearchAdvanced');

        return (
            <Translation ns="common">
                {(t) => (
                    <>
                        <form className="search-form" onSubmit={this.onSubmit.bind(this)}>
                            <div className="search-form-inner">
                                <div className="search-form-input-wrap">
                                    <TextField
                                        className={`mdc-text-field ${this.props.errors.find((err) => err === '400BadSolrRequest') ? 'is-invalid' : ''}`}
                                        disabled={isSearchPending || sources.length === 0}
                                        label={t('searchFormInputLabel')}
                                        value={query}
                                        variant="outlined"
                                        onChange={(ev) => this.setState({ query: ev.currentTarget.value })}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <Icon>search</Icon>
                                        }}
                                    />
                                    <div className="mdc-linear-progress-wrap">
                                        {isSearchPending && <LinearProgress className="mdc-linear-progress" />}
                                    </div>
                                </div>
                                <div className="search-form-info">
                                        <p className="mdc-typography search-form-info__text" style={{ opacity: (!isSearchPending && searchResults && queryParams.q) ? '1' : '0' }}>
                                            {t('searchFormFoundMatches', {
                                                numFound: searchResults?.response?.numFound,
                                                QTime: searchResults?.responseHeader?.QTime,
                                            })}
                                        </p>
                                        {advancedSearchMenuItem && (
                                            <p className="mdc-typography search-form-info__link">
                                                <Link to={`${advancedSearchMenuItem.to}${query && `?q=${query}`}`}>
                                                    {t(`navItem${advancedSearchMenuItem.name}`)}
                                                </Link>
                                            </p>
                                        )}
                                    </div>
                            </div>
                        </form>
                    </>
                )}
            </Translation>
        )
    }
}

export default withRouter(SearchFormSimple);
