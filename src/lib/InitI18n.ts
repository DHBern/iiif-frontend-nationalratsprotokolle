import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import moment from "moment";
require('moment/locale/de');
require('moment/locale/fr');
require('moment/locale/it');

const commonEn = require('../translations/en/common.json');
const commonDe = require('../translations/de/common.json');
const commonFr = require('../translations/fr/common.json');
const commonIt = require('../translations/it/common.json');

export default function InitI18n() {
    i18n.use(initReactI18next).init({
        lng: 'de',
        interpolation: { escapeValue: false },  // React already does escaping
        resources: {
            de: {common: commonDe},
            en: {common: commonEn},
            fr: {common: commonFr},
            it: {common: commonIt},
        }
    }).then(() => {
        i18n.on('languageChanged', () => {
            moment.locale(i18n.language);
        })
    });
}
