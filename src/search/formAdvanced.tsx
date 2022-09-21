import React, { Dispatch, SetStateAction } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { LinearProgress } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import RangeSlider from 'rangeSlider/rangeSlider';
import * as DOMPurify from 'dompurify';
import PresentationApi from "../fetch/PresentationApi";
import { ISearchResults, ISolrRequest } from 'interface/IOcrSearchData';
import IManifestData from "../interface/IManifestData";
import { buildManifest } from '../timeline/util';
import { replaceSearchParameters } from '../util/url';
import { menuItems } from '../navigation/navigation';
import Tooltip from '../tooltip/tooltip';
import { numberArrayToString, stringToNumberArray } from '../util/misc';
import { isSolrExpertQuery } from 'util/solr';

interface IProps extends RouteComponentProps<any> {
    queryParams: ISolrRequest,
    setQueryParams: (qp: ISolrRequest) => void,
    searchResults: ISearchResults | undefined,
    setSearchResults: (sr: ISearchResults) => void,
    yearRange: string,
    setYearRange: Dispatch<SetStateAction<string | null>>,
    errors: string[],
    setErrors: (errors: string[]) => void,
    autosubmit?: boolean;
}

interface IState {
    query: string,
    isSearchPending: boolean,
    sources: string[],
    yearsArray: string[] | undefined,
    fuzzyFilter: number;
    yearsFilter: number[];
}

class SearchFormAdvanced extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const queryParams = Object.fromEntries(new URLSearchParams(props.location.search));

        this.state = {
            query: queryParams.q || '',
            isSearchPending: false,
            sources: ['gbooks', 'lunion'],
            yearsArray: undefined,
            yearsFilter: [0, 0],
            fuzzyFilter: 0,
        };
    }

    url = process.env.REACT_APP_DEFAULT_COLLECTION_MANIFEST;
    initialFuzzyFilter: number = 0;

    static defaultProps = {
        autosubmit: false,
    }

    componentDidMount() {
        if (this.url) {
            PresentationApi
                .get(this.url)
                .then(async (fetchedManifest: IManifestData) => {
                    const grpManifest = buildManifest(fetchedManifest);
                    const yearsArr = Object.keys(grpManifest);
                    const yearRange = stringToNumberArray(this.props.yearRange);
                    const isYearRangeSet = yearRange && yearRange.length === 2 && yearsArr.includes(yearRange[0].toString()) && yearsArr.includes(yearRange[1].toString()) && yearRange[0] <= yearRange[1];
                    
                    this.initialFuzzyFilter = this.state.fuzzyFilter;
                    this.setState({
                        yearsArray: yearsArr,
                    });
                    if (!isYearRangeSet) {
                        this.setState({ yearsFilter: [Number(yearsArr[0]), Number(yearsArr[yearsArr.length - 1])]});
                    } else {
                        this.setState({ yearsFilter: yearRange });
                    }

                    if (this.state.query !== '') {
                        this.onSubmit();
                    }
                })
        }
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        const { query } = this.state;
        const { queryParams, yearRange, autosubmit } = this.props;
        const { start: prevStart, sort: prevSort } = prevProps.queryParams;
        const { start, sort } = queryParams;
        const prevRelevantQueryParams = { start: prevStart, sort: prevSort };
        const relevantQueryParams = { start, sort };
        const queryParamsChanges = JSON.stringify(prevRelevantQueryParams) !== JSON.stringify(relevantQueryParams);

        if (autosubmit || queryParamsChanges) {
            const queryIsSet = query !== '' || (prevState.query !== query && prevState.query !== '');
            const yearRangeChanges = prevProps.yearRange !== yearRange;

            if (queryIsSet && (yearRangeChanges || queryParamsChanges)) {
                this.onSubmit();
            }
        }
    }

    onSubmit(evt?: React.SyntheticEvent) {
        const { sources, query, yearsFilter, fuzzyFilter } = this.state;
        const { queryParams, history, setSearchResults, setQueryParams, setYearRange, errors, setErrors } = this.props;
        const trimmedQuery = query.trim();

        if (evt) {
            evt.preventDefault();
            history.push(replaceSearchParameters({ q: trimmedQuery, page: null }));
        }
        
        const start = queryParams?.start || '1';
        const sort = queryParams?.sort || '';
        const fq = [];
        
        const params = {
            ...queryParams,
        };
            
        if(!isSolrExpertQuery(trimmedQuery)){
            // wrap each word in query in ~fuzzyFilter
            params.q = trimmedQuery.split(' ').map((word) => `${word}~${fuzzyFilter}`).join(' ');
        } else {
            params.q = trimmedQuery;
        }

        if (Array.isArray(sources) && sources.length === 1) {
            fq.push(`source:${sources[0]}`);
        }
        if (Array.isArray(yearsFilter)) {
            const from = `${yearsFilter[0]}-01-01T00:00:00Z`;
            const to = `${yearsFilter[1]}-12-31T23:59:59Z`;

            fq.push(`date:[${from} TO ${to}]`);
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
            delete (params.sort);
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
                this.setState({ isSearchPending: false });
                setSearchResults(undefined as any);
                setErrors([...errors, '400BadSolrRequest']);
            });
        this.setState({
            isSearchPending: true
        });
        setQueryParams(params);
        setYearRange(numberArrayToString(yearsFilter));
    }

    render() {
        const {
            isSearchPending,
            sources,
            query,
            yearsFilter,
            yearsArray,
        } = this.state;

        const {
            searchResults,
            queryParams,
        } = this.props;

        const simpleSearchMenuItem = menuItems.find((item) => item.name === 'Search');

        return (
            <Translation ns="common">
                {(t) => (
                    <>
                        <form className="search-form" onSubmit={this.onSubmit.bind(this)}>
                            <div className="search-form-inner search-form-inner--advanced">
                                <div className="search-form-input">
                                    <label>{ t('searchAdvancedInputLabel') }</label>
                                    <div className="search-form-input-wrap">
                                        <div className="search-form-input-inner">
                                            <input type="text" className={`form-control ${this.props.errors.find((err) => err === '400BadSolrRequest') ? 'is-invalid' : ''}`} disabled={isSearchPending || sources.length === 0} value={query} onChange={(ev) => this.setState({ query: ev.currentTarget.value })} ></input>
                                            <div className="mdc-linear-progress-wrap">
                                                {isSearchPending && <LinearProgress className="mdc-linear-progress" />}
                                            </div>
                                        </div>
                                        <Tooltip
                                            className="search-form-tooltip"
                                            title={
                                                <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                                                    __html: DOMPurify.sanitize(t('searchAdvancedInputTooltip'))
                                                }} />
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="search-form-fuzzy">
                                    <span className="search-form-fuzzy-label">{ t('searchAdvancedFuzzyFrom') }</span>
                                    <Slider
                                        defaultValue={this.initialFuzzyFilter}
                                        onChangeCommitted={(ev: any, newValue: number | number[]) => this.setState({ fuzzyFilter: newValue as number })}
                                        min={0}
                                        max={2}
                                        step={1}
                                        disabled={isSolrExpertQuery(query)}
                                    />
                                    <span className="search-form-fuzzy-label">{ t('searchAdvancedFuzzyTo') }</span>
                                    <Tooltip
                                        className="search-form-tooltip"
                                        title={
                                            <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                                                __html: DOMPurify.sanitize(t('searchAdvancedFuzzyTooltip'))
                                            }} />
                                        }
                                    />
                                </div>
                                <div className="search-form-years">
                                    {yearsArray && (
                                        <>
                                            <label>{ t('searchAdvancedYears') }</label>
                                            <RangeSlider
                                                marks={yearsArray.map((value: string) => ({ value: parseInt(value) }))}
                                                value={yearsFilter}
                                                setValue={(value) => {
                                                    this.setState({ yearsFilter: value });
                                                }}
                                                min={parseInt(yearsArray[0])}
                                                max={parseInt(yearsArray[yearsArray.length - 1])}
                                                valueLabelDisplay="on"
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="search-form-controls">
                                    <button type="submit" className="btn btn-primary" disabled={query === ''}>{ t('searchAdvancedButton') }</button>
                                </div>
                            </div>
                            <div className="search-form-info">
                                <p className="mdc-typography search-form-info__text" style={{ opacity: (!isSearchPending && searchResults && queryParams.q) ? '1' : '0' }}>
                                    {t('searchFormFoundMatches', {
                                        numFound: searchResults?.response?.numFound,
                                        QTime: searchResults?.responseHeader?.QTime,
                                    })}
                                </p>
                                {simpleSearchMenuItem && (
                                    <p className="mdc-typography search-form-info__link">
                                        <Link to={`${simpleSearchMenuItem.to}${query && `?q=${query}`}`}>
                                            {t(`navItem${simpleSearchMenuItem.name}`)}
                                        </Link>
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

export default withRouter(SearchFormAdvanced);
