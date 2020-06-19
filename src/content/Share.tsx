import * as React from 'react';
import IManifestData from '../interface/IManifestData';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TwitterIcon from '@material-ui/icons/Twitter';
import DialogContent from "@material-ui/core/DialogContent";
import EmailIcon from "@material-ui/icons/Email";
import './share.css';
import FacebookIcon from "../icons/fa/FacebookIcon";
import IIIFIcon from "../icons/IIIFIcon";
import {ServiceProfile} from "@iiif/vocabulary";
import Config from "../lib/Config";


interface IProps {
    currentManifest: IManifestData;
}

interface IState {
    isOpen: boolean;
}

declare let global: {
    config: Config;
};


export default class Share extends React.Component<IProps,IState> {

    constructor(props: any) {

        super(props);

        this.state = {isOpen: false};
    }

    render() {
        const currentManifest = this.props.currentManifest;
        console.log(currentManifest.authService);
        if (
            global.config.getDisableSharing() ||
            currentManifest.restricted ||
            (
                currentManifest.authService &&
                currentManifest.authService.profile !== ServiceProfile.AUTH_0_CLICK_THROUGH &&
                currentManifest.authService.profile !== ServiceProfile.AUTH_1_CLICK_THROUGH
            )
        ) {
            return '';
        }

        const title = currentManifest.label;
        const encodedUrl = encodeURI(window.location.href);
        const twitterUrl = 'https://twitter.com/intent/tweet?text=' + title + ': ' + encodedUrl;
        const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&t=' + title;

        return (
            <div>
                <div onClick={() => this.setIsOpen(true)}>Share</div>
                <Dialog onClose={() => this.setIsOpen(false)} aria-labelledby="simple-dialog-title"
                        open={this.state.isOpen} fullWidth={true}>
                    <DialogTitle>
                        Share
                        <span className="close" onClick={() => this.setIsOpen(false)}>&times;</span>
                    </DialogTitle>
                    <DialogContent className="aiiif-share-button-group">

                        <a target="_blank" rel="noopener noreferrer" href={this.props.currentManifest.id}
                           className="aiiif-share-button aiiif-share-button-iiif">
                            <IIIFIcon />
                        </a>

                        <a href={"mailto:?subject=" + title + "&body=" + window.location.href}
                           className="aiiif-share-button aiiif-share-button-email">
                            <EmailIcon />
                        </a>

                        <a target="_blank" rel="noopener noreferrer" href={facebookUrl}
                           className="aiiif-share-button aiiif-share-button-facebook">
                            <FacebookIcon />
                        </a>

                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
                           className="aiiif-share-button aiiif-share-button-twitter">
                            <TwitterIcon />
                        </a>

                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    setIsOpen(isOpen: boolean) {
        this.setState({isOpen})
    }

}
