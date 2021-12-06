import React from 'react';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
import * as DOMPurify from "dompurify";
import { IHighlightInformation, IHighlightSnippet } from '../interface/IOcrSearchData';

interface IProps {
    docId: string,
    query: string,
    getImageUrl: (region: IHighlightInformation, width?: number) => string,
    manifestUri: string,
    snippet: IHighlightSnippet
}

interface IState {
    renderedImage: {
        width: number,
        height: number,
        x: number,
        y: number
    } | undefined,
}



class SnippetView extends React.Component<IProps, IState> {
    state: Readonly<IState> = {
        renderedImage: undefined
    }

    img: HTMLImageElement | null = null;

    getHighlightStyle(hlInfo: IHighlightInformation, hue: number): React.CSSProperties {
        let styles = {};
        const { snippet } = this.props;
        const { renderedImage } = this.state;
        const region = Array.isArray(snippet.regions) && snippet.regions[0];

        if (region && renderedImage) {
            const regionWidth = region.lrx - region.ulx;
            const scaleFactor = (regionWidth) ? renderedImage.width / regionWidth : 0;
            styles = {
                position: "absolute",
                left: `${scaleFactor * hlInfo.ulx + renderedImage.x - 2}px`,
                top: `${scaleFactor * hlInfo.uly + renderedImage.y - 2}px`,
                width: `${scaleFactor * (hlInfo.lrx - hlInfo.ulx)}px`,
                height: `${scaleFactor * (hlInfo.lry - hlInfo.uly)}px`,
                backgroundColor: `hsla(${hue}, 100%, 50%, 50%)`,
            }
        }

        return styles;
    }

    render() {
        const { docId, query, getImageUrl, snippet, manifestUri } = this.props;
        if (snippet) {
            const { text, highlights } = snippet;
            const region = snippet.regions[0];
            const language = i18next.language;
            const viewerUrl = `${process.env.REACT_APP_VIEWER_PAGE_URL}?manifest=${manifestUri}&cv=${docId}&q=${query}&lang=${language}`;
            return (
                <div className="snippet-display">
                    <Link to={viewerUrl}>
                        <img
                            ref={(i) => (this.img = i)}
                            src={getImageUrl(region)}
                            alt=""
                        />
                    </Link>
                    {this.state.renderedImage &&
                        highlights.flatMap((hls) =>
                            hls.map((hl) => (
                                <div
                                    key={hl.text}
                                    className="highlight-box"
                                    title={hl.text}
                                    style={this.getHighlightStyle(hl, 50)}
                                />
                            ))
                        )}
                    <p
                        className="highlightable"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
                    />
                </div>
            );
        }
    }

    updateDimensions() {
        if (!this.img) {
            return;
        }
        
        this.setState({
            renderedImage: {
                x: this.img.offsetLeft,
                y: this.img.offsetTop,
                width: this.img.width,
                height: this.img.height,
            },
        });
    }

    componentDidMount() {
        if(this.img) {
            this.img.addEventListener("load", this.updateDimensions.bind(this));
            window.addEventListener("resize", this.updateDimensions.bind(this));
        }
    }

    componentWillUnmount() {
        if(this.img) {
            window.removeEventListener("resize", this.updateDimensions.bind(this));
        }
    }
}

export default SnippetView;