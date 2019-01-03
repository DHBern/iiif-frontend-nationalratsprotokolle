import Cache from './Cache';

class InfoJson {

    static cache = {};

    static get(id, callback) {

        const data = this.fetchFromCache(id);
        if (data !== false) {
            if (callback !== undefined) {
                callback(data);
            }

            return;
        }

        this.fetchFromUrl(id, callback);
    }

    static fetchFromUrl(id, callback) {

        const t = this;
        const authHeader: Headers = new Headers();
        if (Cache.token !== '') {
            authHeader.set('Authorization', 'Bearer ' + Cache.token);
        }

        const url = id + '/info.json';
        fetch(url, {
                headers: authHeader
            }
        ).then((response) => {

            const statusCode = response.status;

            if (statusCode !== 401 && statusCode >= 400) {
                alert('Could not fetch info.json!\n' + url);
                return;
            }

            response.json().then((json) => {

                if (statusCode === 401) {
                    Cache.ee.emitEvent('show-login', [json]);
                } else {
                    t.cache[id] = json;
                }

                if (callback !== undefined) {
                    callback(json);
                }

            });
        }).catch((err) => {
            console.log(err);
            alert('Could not read info.json!\n' + url);
        });
    }

    static fetchFromCache(id) {

        if (this.cache.hasOwnProperty(id)) {
            return this.cache[id];
        }

        return false;
    }

    static clearCache() {
        this.cache = {};
    }
}

export default InfoJson;
