import EventEmitter = require('wolfy87-eventemitter/EventEmitter');

class Cache {

    static token: string = '';

    static ee = new EventEmitter();

    static intialWidth = 300;

    static viewerHeight = 18;

    static splitterWidth = 8;
}

export default Cache;
