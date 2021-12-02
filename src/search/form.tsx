import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { Icon, LinearProgress, TextField } from '@material-ui/core';
import RangeSlider from 'rangeSlider/rangeSlider';
import PresentationApi from "../fetch/PresentationApi";
import { ISearchResults, ISolrRequest } from 'interface/IOcrSearchData';
import IManifestData from "../interface/IManifestData";
import { buildManifest } from '../timeline/util';

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
    yearsArray: string[] | undefined,
    filterRange: number[];
}

class SearchForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const queryParams = Object.fromEntries(new URLSearchParams(props.location.search));

        this.state = {
            query: queryParams.q || '',
            isSearchPending: false,
            sources: ['gbooks', 'lunion'],
            yearsArray: undefined,
            filterRange: [0, 0],
        };
    }

    url = process.env.REACT_APP_DEFAULT_COLLECTION_MANIFEST;

    componentDidMount() {
        if (this.url) {
            PresentationApi.get(this.url).then(async (fetchedManifest: IManifestData) => {
                const grpManifest = buildManifest(fetchedManifest);
                const yearsArr = Object.keys(grpManifest);
                this.setState({
                    yearsArray: yearsArr,
                    filterRange: [parseInt(yearsArr[0]), parseInt(yearsArr[yearsArr.length - 1])]
                });
                if (this.state.query) {
                    this.onSubmit();
                }
            })
        }
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (prevState.filterRange !== this.state.filterRange && prevState.filterRange[0] !== 0) {
            this.onSubmit();
        }
    }

    onSubmit(evt?: React.SyntheticEvent) {
        const { sources, query, filterRange } = this.state;
        const fq = [];
        if (evt) {
            evt.preventDefault();
            this.props.history.push(`?q=${query}~`);
        }
        const params = {
            ...this.props.queryParams,
            q: query,
        };
        if (Array.isArray(sources) && sources.length === 1) {
            fq.push(`source:${sources[0]}`);
        }
        if (Array.isArray(filterRange)) {
            const from = `${filterRange[0]}-01-01T00:00:00Z`;
            const to = `${filterRange[1]}-12-31T23:59:59Z`;

            fq.push(`date:[${from} TO ${to}]`);
        }
        if (fq.length > 0) {
            params.fq = fq.join(' AND ');
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
            yearsArray,
            filterRange,
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

                                {yearsArray && (
                                    <React.Fragment>
                                        <h4>{t('pageOverviewH2')}</h4>
                                        <RangeSlider
                                            marks={yearsArray.map((value: string) => ({ value: parseInt(value) }))}
                                            value={filterRange}
                                            setValue={(value) => {
                                                this.setState({ filterRange: value });
                                            }}
                                            min={parseInt(yearsArray[0])}
                                            max={parseInt(yearsArray[yearsArray.length - 1])}
                                            valueLabelDisplay="on"
                                        />
                                    </React.Fragment>
                                )}

                                {!isSearchPending && searchResults && (
                                    <p className="mdc-typography">
                                        {t('searchFormFoundMatches', {
                                            numFound: searchResults?.response?.numFound,
                                            QTime: searchResults?.responseHeader?.QTime,
                                        })}
                                    </p>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </Translation>
        )
    }
}

export default withRouter(SearchForm);
