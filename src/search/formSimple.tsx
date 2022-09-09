import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { Icon, LinearProgress, TextField } from '@material-ui/core';
import { ISearchResults, ISolrRequest } from 'interface/IOcrSearchData';
import { replaceSearchParameters } from '../util/url';

interface IProps extends RouteComponentProps<any> {
    queryParams: ISolrRequest,
    setQueryParams: (qp: ISolrRequest) => void,
    searchResults: ISearchResults | undefined,
    setSearchResults: (sr: ISearchResults) => void
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
        const start = this.props.queryParams?.start || '1';
        const sort = this.props.queryParams?.sort || '';
        const fq = [];
        if (evt) {
            evt.preventDefault();
            this.props.history.push(replaceSearchParameters({ q: query, page: null }));
        }
        const params = {
            ...this.props.queryParams,
            q: query,
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
        if (!['relevance', 'null', null].includes(sort)) {
            params.sort = sort;
        } else {
            delete(params.sort);
        }

        fetch(`${process.env.REACT_APP_SOLR_API_BASE}?${new URLSearchParams(params)}`)
            .then((resp) => resp.json())
            .then((data: ISearchResults) => {
                this.setState({ isSearchPending: false })
                this.props.setSearchResults(data);
            })
            .catch((err) => {
                console.error(err);
                this.setState({ isSearchPending: false });
                this.props.setSearchResults(undefined as any); // TODO Refactor
            });
        this.setState({
            isSearchPending: true
        });
        this.props.setQueryParams(params);
    }

    render() {
        const {
            isSearchPending,
            sources,
            query,
        } = this.state;

        const {
            searchResults
        } = this.props

        return (
            <Translation ns="common">
                {(t) => (
                    <>
                        <form className="search-form" onSubmit={this.onSubmit.bind(this)}>
                            <div className="search-form-inner">
                                <TextField
                                    className="mdc-text-field"
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

                                <p className="mdc-typography" style={{ opacity: (!isSearchPending && searchResults) ? '1' : '0' }}>
                                    {t('searchFormFoundMatches', {
                                        numFound: searchResults?.response?.numFound,
                                        QTime: searchResults?.responseHeader?.QTime,
                                    })}
                                </p>
                            </div>
                        </form>
                    </>
                )}
            </Translation>
        )
    }
}

export default withRouter(SearchFormSimple);
