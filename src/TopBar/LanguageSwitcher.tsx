import * as React from 'react';
import {translate, Trans} from 'react-i18next';
import LanguageIcon from '@material-ui/icons/Language';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Config from '../lib/Config';
import * as i18n from 'i18next';

interface IState {
    anchorEl?: HTMLDivElement;
}

declare let global: {
    config: Config;
};

class LanguageSwitcher extends React.Component<{}, IState> {

    constructor(props) {

        super(props);

        this.state = {
            anchorEl: null
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    render() {

        return <div>
            <div>
                <div className="icon-button" onClick={this.open} aria-controls="language-switch-menu"
                     aria-haspopup="true">
                    <LanguageIcon/>
                    <Trans i18nKey="language"/>
                </div>
                {this.renderPopUp()}
            </div>
        </div>;
    }

    open(event: React.MouseEvent<HTMLDivElement>) {
        this.setState({anchorEl: event.currentTarget});
    }

    close() {
        this.setState({anchorEl: null});
    }

    renderPopUp() {
        const languages = [];
        const translations = global.config.getTranslations();
        for (const i in translations) {

            if (!translations.hasOwnProperty(i)) {
                continue;
            }

            languages.push(<MenuItem key={i} onClick={() => this.changeLanguage(i)}>{translations[i]}</MenuItem>);
        }

        return <Menu
            id="language-switch-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.close}
        >
            {languages}
        </Menu>;
    }

    changeLanguage(code: string) {
        this.close();
        i18n.changeLanguage(code);
    }
}

export default translate('common')(LanguageSwitcher);
