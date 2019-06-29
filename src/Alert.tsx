import * as React from 'react';
import Cache from './lib/Cache';
import UrlValidation from './lib/UrlValidation';
import {translate} from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
require('./css/modal.css');

interface IState {
    visible: boolean;
    title?: string;
    titleJsx?: JSX.Element;
    body?: string;
    bodyJsx?: JSX.Element;
}

class Alert extends React.Component<{}, IState> {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    render() {


        return <Dialog
            open={this.state.visible}
            onClose={this.close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
        >
            <DialogTitle >
                {this.renderTitle()}
                <span className="close" onClick={this.close}>&times;</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText color="textPrimary">
                    {this.renderBody()}
                </DialogContentText>
            </DialogContent>
        </Dialog>;

    }

    renderTitle() {
        if (this.state.title) {
            return this.state.title;
        }
        if (this.state.titleJsx) {
            return this.state.titleJsx;
        }
    }

    renderBody() {
        if (this.state.body) {
            return this.nl2br(this.state.body);
        }
        if (this.state.bodyJsx) {
            return this.state.bodyJsx;
        }
    }

    nl2br(input) {

        return input.split('\n').map(function(item: string, i: number) {
            if (UrlValidation.isURL(item)) {
                return <span key={i}><a href={item} target="_blank" rel="noopener">{item}</a><br /></span>;
            }

            return <span key={i}>{item}<br /></span>;
        });
    }

    close() {
        this.setState({
            visible: false
        });
    }

    open(args) {

        const state = {
            visible: true
        };

        state['title'] = args['title'] ? args['title'] : null;
        state['titleJsx'] = args['titleJsx'] ? args['titleJsx'] : null;
        state['body'] = args['body'] ? args['body'] : null;
        state['bodyJsx'] = args['bodyJsx'] ? args['bodyJsx'] : null;

        this.setState(state);
    }

    componentDidMount() {
        Cache.ee.addListener('alert', this.open);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('alert', this.open);
    }
}

export default translate('common')(Alert);
