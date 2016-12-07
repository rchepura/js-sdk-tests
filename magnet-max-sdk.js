    /*!*
     * @fileoverview Magnet Max SDK for JavaScript
     *
     * @version 1.0.0-SNAPSHOT
     *
     * Copyright (c) 2016 Magnet Systems, Inc.
     * All rights reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you
     * may not use this file except in compliance with the License. You
     * may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
     * implied. See the License for the specific language governing
     * permissions and limitations under the License.
     */

    (function(Max) {

/**
 * Namespace for the Magnet Max SDK for JavaScript.
 * @namespace Max
 */

/**
 * @global
 * @desc An object containing attributes used across the Max SDK.
 * @private
 */
Max.Config = {
    /**
     * @property {boolean} logging Enable the logging feature.
     */
    logging                : true,
    /**
     * @property {boolean} logging Enable the payload logging feature.
     */
    payloadLogging         : false,
    /**
     * @property {string} logLevel Set the lowest level to log. Lower log levels will be ignore. The order is SEVERE, WARNING,
     * INFO, CONFIG, and FINE.
     */
    logLevel               : 'INFO',
    /**
     * @property {string} logHandler Define the log handler used to handle logs if logging is enabled. Specifying 'DB' stores to the database configured in {Max.Storage}, 'Console' outputs log via console.log, and 'Console&DB' stores to database and outputs simultaneously.
     */
    logHandler             : 'Console',
    /**
     * @property {boolean} debugMode Ignore self-signed certificates when saving files to the file system. Only applicable
     * to the Phonegap client when using FileTransfer API transport.
     */
    debugMode              : false,
    /**
     * @property {string} sdkVersion Version of the Magnet Mobile SDK for JavaScript.
     */
    sdkVersion             : '1.0.0-SNAPSHOT',
    /**
     * @property {string} securityPolicy Security policy. ['RELAXED', 'STRICT']
     */
    securityPolicy         : 'RELAXED',
    /**
     * @property {string} mmxDomain mmx domain.
     */
    mmxDomain              : 'mmx',
    /**
     * @property {string} mmxPort mmx port.
     */
    mmxPort                : 5222,
    /**
     * @property {string} mmxRESTPort mmx REST port.
     */
    mmxRESTPort            : 6060,
    /**
     * @property {string} httpsBindPort SSL-enabled http-bind port.
     */
    httpsBindPort          : 7443,
    /**
     * @property {string} httpBindPort http-bind port.
     */
    httpBindPort           : 7070,
    /**
     * @property {string} mmxHost mmxHost.
     */
    mmxHost                : 'localhost',
    /**
     * @property {string} baseUrl baseUrl.
     */
    baseUrl                : 'https://sandbox.magnet.com/mobile/api',
    /**
     * @property {string} tlsEnabled Determines whether TLS security enabled.
     */
    tlsEnabled             : false
};

/**
 * @global
 * @desc An object containing application-specific information used across the Max SDK.
 * @private
 */
Max.App = {
    /**
     * @property {boolean} True indicates that the SDK is ready for use.
     */
    initialized: false,
    /**
     * @property {boolean} True indicates the SDK is listening for messages.
     */
    receiving: false,
    /**
     * @property {object} credentials Contains authorization token needed for API
     * authorization.
     */
    credentials: {},
    /**
     * @property {string} clientId Client ID. This value is unique per application.
     */
    clientId: false,
    /**
     * @property {string} clientSecret Client secret. This value is unique per application.
     */
    clientSecret: false,
    /**
     * @property {string} appId Application id.
     */
    appId: null,
    /**
     * @property {string} appAPIKey Application API key.
     */
    appAPIKey: null,
    /**
     * @property {string} gcmSenderId GCM sender ID.
     */
    gcmSenderId: null
};

/**
 * A class containing general utility functions used across the Max SDK.
 * @memberof Max
 * @namespace Utils
 * @private
 */
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
Max.Utils = {
    /**
     * Indicates whether the current browser is an Android device.
     */
    isAndroid : (typeof navigator !== 'undefined' && navigator.userAgent) ? /Android|webOS/i.test(navigator.userAgent) : false,
    /**
     * Indicates whether the current browser is an iOS device.
     */
    isIOS : (typeof navigator !== 'undefined' && navigator.userAgent) ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false,
    /**
     * Indicates whether the current browser is an iOS or Android device.
     */
    isMobile : (typeof navigator !== 'undefined' && navigator.userAgent) ? /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) : false,
    /**
     * Indicates whether the current client is a Node.js server.
     */
    isNode : (typeof module !== 'undefined' && module.exports && typeof window === 'undefined'),
    /**
     * Indicates whether the current client is a Cordova app.
     */
    isCordova : (typeof navigator !== 'undefined' && navigator.userAgent) &&
        (typeof window !== 'undefined' && window.location && window.location.href) &&
        (typeof cordova !== 'undefined' || typeof PhoneGap !== 'undefined' || typeof phonegap !== 'undefined') &&
        /^file:\/{3}[^\/]/i.test(window.location.href) &&
        /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent),
    /**
     * Merges the attributes of the second object into the first object.
     * @param {object} obj1 The first object, into which the attributes will be merged.
     * @param {object} obj2 The second object, whose attributes will be merged into the first object.
     */
    mergeObj : function(obj1, obj2) {
        var obj1 = obj1 || {};
        var obj2 = obj2 || {};
        for(var p in obj2) {
            try{
                if (obj2[p].constructor == Object) {
                    obj1[p] = this.mergeObj(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            }catch(e) {
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    },
    /**
     * Determines whether the input is a JavaScript object.
     * @param {*} input The input to check.
     */
    isObject : function(input) {
        return Object.prototype.toString.call(input) == "[object Object]";
    },
    /**
     * Determines whether the input is a JavaScript array.
     * @param {*} input The input to check.
     */
    isArray : function(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    },
    /**
     * Convert the specified string to JSON if successful; otherwise returns false.
     * @param {string} str The input to convert.
     */
    getValidJSON : function(str) {
        try{
            str = JSON.parse(str);
        }catch(e) {
            return false;
        }
        return str;
    },
    /**
     * Convert the specified string to XML if successful; otherwise returns false.
     * @param {string} str The input to convert.
     */
    getValidXML : function(str) {
        if (!this.parseXml) {
            if (window.DOMParser) {
                this.parseXml = function(str) {
                    return (new window.DOMParser()).parseFromString(str, 'text/xml');
                };
            } else if (typeof window.ActiveXObject != 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
                this.parseXml = function(str) {
                    var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
                    xmlDoc.async = 'false';
                    xmlDoc.loadXML(str);
                    return xmlDoc;
                };
            }
        }
        try{
            str = this.parseXml(str);
        }catch(e) {
            return false;
        }
        return str;
    },
    /**
     * Convert the specified object into Form Data.
     * @param {string} str The input to convert.
     * @returns {string} A Form Data string.
     */
    objectToFormdata : {
        stringify : function(input) {
            if (Max.Utils.isObject(input)) {
                var ary = [];
                for(var key in input) {
                    if (input.hasOwnProperty(key) && input[key] != null)
                        ary.push(key+'='+encodeURIComponent(input[key]));
                }
                return ary.join('&');
            }
            return '';
        }
    },
    /**
     * Retrieve all attribute names of the specified object as an array.
     * @param {object} obj The object to parse.
     */
    getAttributes : function(obj) {
        var ary = [];
        obj = obj || {};
        for(var attr in obj) {
            if (obj.hasOwnProperty(attr)) ary.push(attr);
        }
        return ary;
    },
    /**
     * Retrieve all properties of the specified object as an array.
     * @param {object} obj The object to parse.
     */
    getValues : function(obj) {
        var ary = [];
        obj = obj || {};
        for(var attr in obj) {
            if (obj.hasOwnProperty(attr)) ary.push(obj[attr]);
        }
        return ary;
    },
    /**
     * Indicates whether the specified object is empty.
     * @param {object} obj The object to check.
     */
    isEmptyObject : function(obj) {
        if (!obj || typeof obj === 'string' || typeof obj === 'boolean' || this.isNumeric(obj)) {
            return true;
        }
        if (!obj.hasOwnProperty) {
            for(var i in obj) {
                return false;
            }
            return true;
        } else {
            for(var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
        }
    },
    /**
     * Convert XHR and response headers into a JavaScript object.
     * @param {object} xhr The XMLHTTPRequest object to convert.
     */
    convertHeaderStrToObj : function(xhr) {
        var obj = {};
        // for IE9+ and webkit browsers - faster performance
        if (Object.keys(xhr).forEach) {
            Object.keys(xhr).forEach(function(prop) {
                if ((typeof xhr[prop] == 'string' || typeof xhr[prop] == 'number' || typeof xhr[prop] == 'boolean') && prop != 'responseText') {
                    obj[prop] = xhr[prop];
                }
            });
        } else {
            for(var prop in xhr) {
                if ((typeof xhr[prop] == 'string' || typeof xhr[prop] == 'number' || typeof xhr[prop] == 'boolean') && prop != 'responseText') {
                    obj[prop] = xhr[prop];
                }
            }
        }
        var ary = xhr.getAllResponseHeaders().split('\n');
        for(var i in ary) {
            var prop = ary[i].trim().split(': ');
            if (prop.length > 1) {
                obj[prop[0]] = prop[1];
            }
        }
        return obj;
    },
    /**
     * Determines whether the input is numeric.
     * @param {*} input The input to check.
     */
    isNumeric : function(input) {
        return !isNaN(parseFloat(input)) && isFinite(input);
    },
    /**
     * Remove attributes not defined in the specified schema and returns the corresponding set of entity attributes.
     * @param {object} schema The controller or model schema consistent with the server.
     * @param {object} obj The current set of entity attributes.
     */
    cleanData : function(schema, obj) {
        var result = {};
        for(var attr in schema) {
            if (schema.hasOwnProperty(attr) && obj[attr])
                result[attr] = obj[attr];
        }
        return result;
    },
    /**
     * Determines whether the specified feature is available in the current browser or mobile client.
     * @param {string} str Name of a global variable.
     */
    hasFeature : function(str) {
        try{
            return str in window && window[str] !== null;
        } catch(e) {
            return false;
        }
    },
    /**
     * Determines whether the specified attribute is a primitive type.
     * @param {string} str The attribute type.
     */
    isPrimitiveType : function(str) {
        return '|byte|short|int|long|float|double|boolean|char|string|integer|void|'.indexOf('|'+str+'|') != -1;
    },
    /**
     * Determines whether the specified attribute is an array type. If its type is an array, the type of data in the array is returned; otherwise returns false.
     * @param {string} str The attribute type.
     */
    getArrayType : function(str) {
        return str.indexOf('[]') != -1 ? str.slice(0, -2) : false;
    },
    /**
     * Determines the data type for the specified attribute type.
     * @param {string} str The attribute type.
     */
    getDataType : function(str) {
        var type;
        switch(Object.prototype.toString.call(str)) {
            case '[object Number]'    : type = 'integer'; break;
            case '[object String]'    : type = 'string'; break;
            case '[object Array]'     : type = 'array'; break;
            case '[object Object]'    : type = 'object'; break;
            case '[object Date]'      : type = 'date'; break;
            case '[object Boolean]'   : type = 'boolean'; break;
        }
        return type;
    },
    /**
     * Converts the specified Date object as an ISO 8601 Extended Format string. This is a shim for clients that do not support .toISOString.
     * @param {Date} d The Date object to be converted to an ISO 8601 Extended Format string.
     * @returns {string} An equivalent ISO 8601 Extended Format string or null if not valid.
     */
    dateToISO8601 : function(d) {
        if (!d || !d.getMonth) return null;
        function pad(n) {return n<10 ? '0'+n : n}
        return d.getUTCFullYear()+'-'
            + pad(d.getUTCMonth()+1)+'-'
            + pad(d.getUTCDate())+'T'
            + pad(d.getUTCHours())+':'
            + pad(d.getUTCMinutes())+':'
            + pad(d.getUTCSeconds())+'.'
            + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)+'Z';
    },
    /**
     * Converts the specified Date string as an ISO 8601 Extended Format Date object.
     * @param {string} str An ISO 8601 Extended Format date string.
     * @returns {object} A Date object equivalent to the specified ISO 8601 Extended Format string.
     */
    ISO8601ToDate : function(str) {
        if (typeof str !== 'string') return false;
        var re = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/;
        var d = [];
        d = str.match(re);
        if (!d) {
            Max.Log.fine("Couldn't parse ISO 8601 date string '" + str + "'");
            return false;
        }
        var a = [1,2,3,4,5,6,10,11];
        for(var i in a) d[a[i]] = parseInt(d[a[i]], 10);
        d[7] = parseFloat(d[7]);
        var ms = Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6]);
        if (d[7] > 0) ms += Math.round(d[7] * 1000);
        if (d[8] != "Z" && d[10]) {
            var offset = d[10] * 60 * 60 * 1000;
            if (d[11]) offset += d[11] * 60 * 1000;
            if (d[9] == "-") ms -= offset;
            else ms += offset;
        }
        return new Date(ms);
    },
    /**
     * Convert a UTF-8 string into URI-encoded base64 string.
     * @param input A UTF-8 string.
     * @returns {string} An equivalent URI-encoded base64 string.
     */
    stringToBase64 : function(input) {
        return (this.isNode === true && typeof Buffer !== 'undefined') ? new Buffer(input).toString('base64') : window.btoa(unescape(encodeURIComponent(input)));
    },
    /**
     * Convert a URI-encoded base64 string into a UTF-8 string.
     * @param input A URI-encoded base64 string.
     * @returns {string} An equivalent UTF-8 string.
     */
    base64ToString : function(input) {
        return (this.isNode === true && typeof Buffer !== 'undefined') ? new Buffer(input, 'base64').toString('utf8') : decodeURIComponent(escape(window.atob(input)));
    },
    /**
     * Generate a GUID.
     * @returns {string} A new GUID.
     */
    getGUID : function() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
    },
    /**
     * Generate a GUID without hyphen.
     * @returns {string} A new GUID.
     */
    getCleanGUID: function() {
        return this.getGUID().replace(/-/g, '');
    },
    /**
     * Collect browser and version.
     * @param {string} [userAgent] specify a userAgent string.
     * @param {string} [appVersion] specify an userAgent string.
     * @param {string} [appName] specify an appName string.
     * @returns {string} browser and version.
     */
    getBrowser : function(userAgent, appVersion, appName) {
        //browser
        var nVer = appVersion || navigator.appVersion;
        var nAgt = userAgent || navigator.userAgent;
        var browser = appName || navigator.appName;
        var version = '' + parseFloat(appVersion || navigator.appVersion);
        var majorVersion = parseInt(appVersion || navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // EDGE
        else if (nAgt.indexOf('Edge/') != -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(nAgt.indexOf('Edge/') + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = appName || navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(appVersion || navigator.appVersion);
            majorVersion = parseInt(appVersion || navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        return browser + ' ' + version + ' (' + majorVersion + ') ' + (mobile || '');
    },
    /**
     * Collect operating system and version.
     * @returns {string} operating system and version.
     */
    getOS : function() {
        var osVersion = '-';
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;

        // system
        var os = '-';
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt);
                osVersion = osVersion ? osVersion[1] : null;
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt);
                osVersion = osVersion ? osVersion[1] : null;
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        return {
            os: os,
            osVersion: osVersion
        };
    },
    /**
     * Decode UTF-16 string to UTF-8.
     * @param {string} str A UTF-16 encoded string.
     * @returns {string} A UTF-8 encoded string.
     */
    utf16to8: function(str) {
        var i, c;
        var out = "";
        var len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0000) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return out;
    },
    objToObjAry: function(objOrAry) {
        var res = [];
        if (!objOrAry) return [];
        (this.isArray(objOrAry) ? objOrAry : [objOrAry]).forEach(function(itm) {
            if ( itm ) {
                res.push(itm);
            }
        });
        return res;
    },
    getIndexById: function(ary, id) {
        for (var i=0;i<ary.length;++i) {
            if (ary[i].id === id) return i;
        }
        return false;
    }
};

/**
 * @class An implementation of the Promise API. A Promise object manages state and facilitates a callback after all the associated asynchronous actions of a Deferred object have completed. Multiple promises can be chained with the 'then' function.
 * @constructor
 */
Max.Promise = function() {
    this.successes = [];
    this.failures = [];
    this.completions = [];
};

Max.Promise.prototype = {
    successes   : null,
    failures    : null,
    completions : null,
    status      : 'pending',
    args        : null,
    _isPromise  : true,
    /**
     * Stores success and error callbacks, and calls them if the Promise status is 'resolved' or 'rejected'.
     * @param success A callback that is fired upon a 'resolved' status.
     * @param error A callback that is fired upon a 'rejected' status.
     * @returns {Max.Promise} A promise object.
     */
    then : function(success, error) {
        var defer = new Max.Deferred();
        if (success)
            this.successes.push({
                fn    : success,
                defer : defer
            });
        if (error)
            this.failures.push({
                fn    : error,
                defer : defer
            });
        if (this.status === 'resolved')
            this.exec({
                fn    : success,
                defer : defer
            }, this.args);
        else if (this.status === 'rejected')
            this.exec({
                fn    : error,
                defer : defer
            }, this.args);
        return defer.promise;
    },
    /**
     * Stores a single callback and calls it regardless of whether Promise status is 'resolved' or 'rejected'.
     * @param callback A callback that is fired upon completion.
     * @returns {Max.Promise} A promise object.
     */
    always : function(callback) {
        var defer = new Max.Deferred();
        if (callback)
            this.completions.push({
                fn    : callback,
                defer : defer
            });
        if (this.status === 'resolved' || this.status === 'rejected')
            this.exec({
                fn    : callback,
                defer : defer
            }, this.args);
        return defer.promise;
    },
    /**
     * Stores a callback which is fired if the Promise is resolved.
     * @param {function} success A success callback.
     * @returns {Max.Promise}
     */
    success : function(success) {
        var defer = new Max.Deferred();
        if (success)
            this.successes.push({
                fn    : success,
                defer : defer
            });
        if (this.status === 'resolved')
            this.exec({
                fn    : success,
                defer : defer
            }, this.args);
        return this;
    },
    /**
     * Stores a callback that is fired if the Promise is rejected.
     * @param {function} error The error callback to be stored.
     * @returns {Max.Promise} A promise object.
     */
    error : function(error) {
        var defer = new Max.Deferred();
        if (error)
            this.failures.push({
                fn    : error,
                defer : defer
            });
        if (this.status === 'rejected')
            this.exec({
                fn    : error,
                defer : defer
            }, this.args);
        return this;
    },
    /**
     * Call and resolve a callback. If the result is a Promise object, bind a
     * new set of callbacks to the Promise object to continue the chain.
     * @param {object} obj An object containing the callback function and a Deferred object.
     * @param {*} args Arguments associated with this Promise.
     */
    exec : function(obj, args) {
        setTimeout(function() {
            var res = obj.fn.apply(null, args);
            if (Max.Utils.isObject(res) && res._isPromise)
                obj.defer.bind(res);
        }, 0);
    }
};
/**
 * @class A Deferred object handles execution of resolve and reject methods, which trigger the success or error callbacks.
 * @constructor
 */
Max.Deferred = function() {
    this.promise = new Max.Promise();
};
Max.Deferred.prototype = {
    promise : null,
    /**
     * Resolve the Deferred object.
     */
    resolve : function() {
        var i, promise = this.promise;
        promise.args = arguments;
        promise.status = 'resolved';
        for(i=0;i<promise.successes.length;++i)
            promise.exec(promise.successes[i], promise.args)
        for(i=0;i<promise.completions.length;++i)
            promise.exec(promise.completions[i], promise.args)
    },
    /**
     * Reject the Deferred object.
     */
    reject : function() {
        var i, promise = this.promise;
        promise.args = arguments;
        promise.status = 'rejected';
        for(i=0;i<promise.failures.length;++i)
            promise.exec(promise.failures[i], promise.args)
        for(i=0;i<promise.completions.length;++i)
            promise.exec(promise.completions[i], promise.args)
    },
    /**
     * Bind a new set of callbacks to be fired upon completion of the Promise.
     */
    bind : function(promise) {
        var me = this;
        promise.then(function() {
            me.resolve.apply(me, arguments);
        }, function() {
            me.reject.apply(me, arguments);
        })
    }
};
/**
 * Asynchronously execute the specified promises. On completion, return an array of success and error arguments in a 'then' function.
 * @param {Max.Promise} promises An object containing the specified promises.
 */
Max.Deferred.all = function() {
    var deferred = new Max.Deferred();
    var successes = [], failures = [], ctr = 0, total = arguments.length;
    for(var i=0;i<total;++i) {
        arguments[i].call(null).then(function() {
            successes.push(arguments);
            if (++ctr == total) deferred.resolve(successes, failures);
        }, function() {
            failures.push(arguments);
            if (++ctr == total) deferred.resolve(successes, failures);
        });
    }
    return deferred.promise;
};

/**
 * A class for extending an object with an event.
 * @memberof Max
 * @namespace Events
 * @private
 */
Max.Events = {
    /**
     * Extends an existing object to handle events.
     * @param {object} me An instance of a Max Controller.
     * @returns {boolean} Indicates whether the event handlers were created.
     */
    create : function(me) {
        if (!me._events && !me.invoke && !me.on && !me.unbind) {
            me._events = {};
            me.on = function(eventId, callback) {
                if (typeof eventId == 'number') eventId = eventId.toString();
                me._events[eventId] = me._events[eventId] || [];
                me._events[eventId].push(callback);
            };
            me.invoke = function(events) {
                if (typeof events === typeof []) {
                    for(var i=events.length;i--;) {
                        if (typeof events[i] == 'number') events[i] = events[i].toString();
                        if (me._events[events[i]]) {
                            for(var j=me._events[events[i]].length;j--;) {
                                me._events[events[i]][j].apply(this, [].slice.call(arguments, 1));
                            }
                        }
                    }
                } else {
                    if (typeof events == 'number') events = events.toString();
                    if (me._events[events]) {
                        for(var k=me._events[events].length;k--;) {
                            me._events[events][k].apply(this, [].slice.call(arguments, 1));
                        }
                    }
                }
            };
            me.unbind = function(eventId) {
                if (typeof eventId == 'number') eventId = eventId.toString();
                if (me._events[eventId]) delete me._events[eventId];
                if (!eventId) me._events = {};
            };
            return true;
        } else {
            return false;
        }
    }
};

/**
 * A connector to manage data in a Web SQL database.
 * @memberof Max
 * @namespace SQLConnector
 * @private
 */
Max.SQLConnector = {
    /**
     * @attribute {Database} [db] An SQL Lite database object.
     */
    db : undefined,
    schemas : {},
    /**
     * @attribute {object} dbOptions SQL Lite database options.
     */
    dbOptions : {
        name    : 'MMSDK',
        version : '1.0',
        display : 'Magnet_JS_SDK_DB',
        size    : 5000000
    },
    create : function(table, kvp, callback, failback) {
        var me = this;
        me.db.transaction(function(tx) {
            var props = Max.Utils.getAttributes(kvp).join(', ');
            var vals = Max.Utils.getValues(kvp);
            Max.Log.fine('INSERT INTO '+table+' ('+props+') VALUES ('+me.getPlaceholders(vals)+')', vals);
            tx.executeSql('INSERT INTO '+table+' ('+props+') VALUES ('+me.getPlaceholders(vals)+')', vals, function(insertTX, res) {
                kvp.id = res.insertId;
                callback(kvp);
            });
        }, function(e) {
            Max.Log.fine('error inserting a record: ', e);
            failback(e);
        });
    },
    update : function(table, id, kvp, callback, failback) {
        this.db.transaction(function(tx) {
            delete kvp.id;
            var props = Max.Utils.getAttributes(kvp).join('=?, ')+'=?';
            var vals = Max.Utils.getValues(kvp);
            vals.push(id);
            Max.Log.fine('UPDATE '+table+' SET '+props+' WHERE id=?', vals);
            tx.executeSql('UPDATE '+table+' SET '+props+' WHERE id=?', vals, function() {
                callback(kvp);
            });
        }, function(e) {
            Max.Log.fine('error updating a record: ', e);
            failback(e);
        });
    },
    get : function(table, input, callback, failback) {
        var me = this;
        me.db.transaction(function(tx) {
            if (typeof input === 'undefined' || input === null || input === '') input = {1:1};
            var props, vals, isQuery = typeof input === 'object';
            if (isQuery) {
                props = Max.Utils.getAttributes(input).join('=? AND ')+'=?';
                vals = Max.Utils.getValues(input);
            } else {
                props = 'id=?';
                vals = [input];
            }
            Max.Log.fine('SELECT * FROM '+table+' WHERE '+props, vals);
            tx.executeSql('SELECT * FROM '+table+' WHERE '+props, vals, function(tx, results) {
                callback(me.formatResponse(results.rows, isQuery));
            }, function(e) {
                Max.Log.fine('error retrieving records: ', e);
                failback(e);
            });
        }, function(e) {
            Max.Log.fine('error setting up web sql transaction: ', e);
            failback(e);
        });
    },
    formatResponse : function(rows, isQuery) {
        var ary = [];
        for(var i=0;i<rows.length;++i)
            ary.push(rows.item(i));
        return isQuery ? ary : ary[0];
    },
    remove : function(table, input, callback, failback) {
        var me = this;
        me.db.transaction(function(tx) {
            var props = [], vals = [], aryProps = [], aryVals = [];
            if (typeof input === 'object') {
                for(var prop in input) {
                    if (Max.Utils.isArray(input[prop])) {
                        aryProps.push(prop+' IN ('+me.getPlaceholders(input[prop])+')');
                        aryVals = aryVals.concat(Max.Utils.getValues(input[prop]));
                    } else {
                        props.push(prop+'=?');
                        vals.push(input[prop]);
                    }
                }
                props = props.concat(aryProps).join(' AND ');
                vals = vals.concat(aryVals);
            } else {
                props = 'id=?';
                vals = [input];
            }
            Max.Log.fine('DELETE FROM '+table+' WHERE '+props, vals);
            tx.executeSql('DELETE FROM '+table+' WHERE '+props, vals);
        }, function(e) {
            Max.Log.fine('error deleting a record: ', e);
            failback(e);
        }, callback);
    },
    clearTable : function(table, callback, failback) {
        this.db.transaction(function(tx) {
            Max.Log.fine('DELETE FROM '+table);
            tx.executeSql('DELETE FROM '+table);
        }, function(e) {
            Max.Log.fine('error clearing table: ', e);
            failback(e);
        }, callback);
    },
    createTableIfNotExist : function(table, schema, kvps, clearRecords, callback, failback) {
        var me = this, props, vals, columns = ['id INTEGER PRIMARY KEY AUTOINCREMENT'];
        if (typeof schema === 'object') {
            for(var prop in schema)
                columns.push(prop+' '+schema[prop]);
            columns = columns.join(', ');
            me.schemas[table] = schema;
        }
        me.db.transaction(function(tx) {
            Max.Log.fine('CREATE TABLE IF NOT EXISTS '+table+' ('+columns+')');
            tx.executeSql('CREATE TABLE IF NOT EXISTS '+table+' ('+columns+')');
            if (clearRecords === true) {
                Max.Log.fine('DELETE FROM '+table);
                tx.executeSql('DELETE FROM '+table);
            }
            if (Max.Utils.isArray(kvps)) {
                for(var i=0;i<kvps.length;++i) {
                    props = Max.Utils.getAttributes(kvps[i]).join(', ');
                    vals = Max.Utils.getValues(kvps[i]);
                    Max.Log.fine('INSERT INTO '+table+' ('+props+') VALUES ('+me.getPlaceholders(vals)+')', vals);
                    tx.executeSql('INSERT INTO '+table+' ('+props+') VALUES ('+me.getPlaceholders(vals)+')', vals);
                }
            } else if (kvps) {
                props = Max.Utils.getAttributes(kvps).join(', ');
                vals = Max.Utils.getValues(kvps);
                Max.Log.fine('INSERT INTO '+table+' ('+props+') VALUES ('+me.getPlaceholders(vals)+')', vals);
                tx.executeSql('INSERT INTO '+table+' ('+props+') VALUES ('+me.getPlaceholders(vals)+')', vals);
            }
        }, function(e) {
            Max.Log.fine('error executing web sql transaction: ', e);
            failback(e);
        }, callback);
    },
    getPlaceholders : function(vals) {
        var ques = [];
        for(var i=0;i<vals.length;++i) ques.push('?');
        return ques.join(', ');
    }
};
/**
 * A connector to manage data in a local storage database.
 * @memberof Max
 * @namespace LocalStorage
 * @private
 */
Max.LocalStorageConnector = {
    create : function(table, kvp, callback) {
        setTimeout(function() {
            var tableData = Max.Utils.getValidJSON(window.localStorage.getItem(table)) || [];
            kvp.id = Max.Utils.getGUID();
            tableData.push(kvp);
            window.localStorage.setItem(table, JSON.stringify(tableData));
            callback(kvp);
        }, 1);
    },
    update : function(table, id, kvp, callback, failback) {
        var record;
        setTimeout(function() {
            var tableData = Max.Utils.getValidJSON(window.localStorage.getItem(table));
            if (tableData) {
                for(var i=0;i<tableData.length;++i) {
                    if (tableData[i].id == id) {
                        for(var key in kvp)
                            tableData[i][key] = kvp[key];
                        record = tableData[i];
                    }
                }
                if (typeof record === 'undefined') {
                    failback('record-not-exist');
                } else {
                    window.localStorage.setItem(table, JSON.stringify(tableData));
                    callback(record);
                }
            } else {
                failback('table-not-exist');
            }
        }, 1);
    },
    get : function(table, input, callback, failback) {
        var records = [], valid = true;
        setTimeout(function() {
            var tableData = Max.Utils.getValidJSON(window.localStorage.getItem(table));
            if (tableData) {
                if (typeof input === 'object') {
                    for(var i=0;i<tableData.length;++i) {
                        for(var key in input)
                            if (tableData[i][key] !== input[key])
                                valid = false;
                        if (valid === true) records.push(tableData[i]);
                        valid = true;
                    }
                } else if (typeof input === 'undefined' || input === null || input === '') {
                    records = tableData;
                } else {
                    records = undefined;
                    for(var i=0;i<tableData.length;++i) {
                        if (tableData[i].id == input) {
                            records = tableData[i];
                            break;
                        }
                    }
                }
                callback(records);
            } else {
                failback('table-not-exist');
            }
        }, 1);
    },
    remove : function(table, input, callback, failback) {
        var matched = true;
        setTimeout(function() {
            var tableData = Max.Utils.getValidJSON(window.localStorage.getItem(table));
            if (tableData) {
                for(var i=tableData.length;i--;) {
                    if (typeof input === 'object') {
                        matched = true;
                        for(var prop in input) {
                            if (Max.Utils.isArray(input[prop])) {
                                if (input[prop].indexOf(tableData[i][prop]) == -1) matched = false;
                            } else {
                                if (tableData[i][prop] !== input[prop]) matched = false;
                            }
                        }
                        if (matched) tableData.splice(i, 1);
                    } else {
                        if (tableData[i].id == input) tableData.splice(i, 1);
                    }
                }
                window.localStorage.setItem(table, JSON.stringify(tableData));
                callback();
            } else {
                failback('table-not-exist');
            }
        }, 1);
    },
    clearTable : function(table, callback) {
        setTimeout(function() {
            window.localStorage.setItem(table, JSON.stringify([]));
            callback();
        }, 1);
    },
    createTableIfNotExist : function(table, schema, kvps, clearRecords, callback) {
        setTimeout(function() {
            var tableData = (clearRecords === true ? [] : Max.Utils.getValidJSON(window.localStorage.getItem(table))) || [];
            if (Max.Utils.isArray(kvps)) {
                for(var i=0;i<kvps.length;++i) {
                    kvps[i].id = Max.Utils.getGUID();
                    tableData.push(kvps[i]);
                }
            } else if (kvps) {
                kvps.id = Max.Utils.getGUID();
                tableData.push(kvps);
            }
            window.localStorage.setItem(table, JSON.stringify(tableData));
            callback();
        }, 1);
    }
};
/**
 * A connector to manage data in non-persistent memory store.
 * @memberof Max
 * @namespace SQLConnector
 * @private
 */
Max.MemoryStoreConnector = {
    /**
     * @attribute {object} memory Memory store for Node.js and other platforms which do not support localStorage.
     */
    memory : {},
    create : function(table, kvp, callback) {
        this.memory[table] = this.memory[table] || [];
        kvp.id = Max.Utils.getGUID();
        this.memory[table].push(kvp);
        callback(kvp);
    },
    update : function(table, id, kvp, callback, failback) {
        var record;
        if (this.memory[table]) {
            for(var i=0;i<this.memory[table].length;++i) {
                if (this.memory[table][i].id === id) {
                    for(var key in kvp)
                        this.memory[table][i][key] = kvp[key];
                    record = this.memory[table][i];
                }
            }
            if (typeof record === 'undefined')
                failback('record-not-exist');
            else
                callback(record);
        } else {
            failback('table-not-exist');
        }
    },
    get : function(table, input, callback, failback) {
        var records = [], valid = true;
        if (this.memory[table]) {
            if (typeof input === 'object') {
                for(var i=0;i<this.memory[table].length;++i) {
                    for(var key in input)
                        if (this.memory[table][i][key] !== input[key])
                            valid = false;
                    if (valid === true) records.push(this.memory[table][i]);
                    valid = true;
                }
            } else if (typeof input === 'undefined' || input === null || input === '') {
                records = this.memory[table];
            } else {
                records = undefined;
                for(var i=0;i<this.memory[table].length;++i) {
                    if (this.memory[table][i].id == input) {
                        records = this.memory[table][i];
                        break;
                    }
                }
            }
            callback(records);
        } else {
            failback('table-not-exist');
        }
    },
    remove : function(table, input, callback, failback) {
        var matched = true;
        if (this.memory[table]) {
            for(var i=this.memory[table].length;i--;) {
                if (typeof input === 'object') {
                    matched = true;
                    for(var prop in input) {
                        if (Max.Utils.isArray(input[prop])) {
                            if (input[prop].indexOf(this.memory[table][i][prop]) == -1)
                                matched = false;
                        } else {
                            if (this.memory[table][i][prop] !== input[prop])
                                matched = false;
                        }
                    }
                    if (matched) this.memory[table].splice(i, 1);
                } else {
                    if (this.memory[table][i].id == input) {
                        this.memory[table].splice(i, 1);
                    }
                }
            }
            callback();
        } else {
            failback('table-not-exist');
        }
    },
    clearTable : function(table, callback) {
        this.memory[table] = [];
        callback();
    },
    createTableIfNotExist : function(table, schema, kvps, clearRecords, callback) {
        this.memory[table] = (clearRecords === true ? [] : this.memory[table]) || [];
        if (Max.Utils.isArray(kvps)) {
            for(var i=0;i<kvps.length;++i) {
                kvps[i].id = Max.Utils.getGUID();
                this.memory[table].push(kvps[i]);
            }
        } else if (kvps) {
            kvps.id = Max.Utils.getGUID();
            this.memory[table].push(kvps);
        }
        callback();
    }
};

/**
 * A class for storing a value into persistent storage. Currently relies on HTML5 localStorage. Clients that do not support localStorage will fall back to a memory store that will not persist past a restart of the app.
 * @memberof Max
 * @namespace Storage
 * @private
 */
Max.Storage = {
    /**
     * @attribute {object} connector The data connector to be used.
     */
    connector : Max.MemoryStoreConnector,
    /**
     * Create an object.
     * @param {string} table The table in the database.
     * @param {*} kvp An object containing values to set on the object.
     */
    create : function(table, kvp, callback, failback) {
        this.connector.create(table, kvp, function(record) {
            if (typeof callback === typeof Function)
                callback(record);
        }, function(e) {
            if (typeof failback === typeof Function)
                failback(e);
        });
    },
    /**
     * Update values of the object corresponding to the specified ID.
     * @param {string} table The table in the database.
     * @param {*} id The unique identifier of the object to set.
     * @param {*} kvp An object containing values to set on the object.
     */
    update : function(table, id, kvp, callback, failback) {
        this.connector.update(table, id, kvp, function(record) {
            if (typeof callback === typeof Function)
                callback(record);
        }, function(e) {
            if (typeof failback === typeof Function)
                failback(e);
        });
    },
    /**
     * Get an object using an ID or a query. A query is an object of properties, each containing an array of property matches. For example, {"foo":"a1"]}.
     * @param {string} table The table in the database.
     * @param {string|object} input An ID or a query object containing the required matches.
     */
    get : function(table, input, callback, failback) {
        this.connector.get(table, input, function(records) {
            if (typeof callback === typeof Function)
                callback(records);
        }, function(e) {
            if (typeof failback === typeof Function)
                failback(e);
        });
    },
    /**
     * Remove an object using an ID or a query. A query is an object of properties, each containing an array of property matches. For example, {"foo":"a1"]}.
     * @param {string} table The table in the database.
     * @param {*} id The unique identifier of the object to remove.
     */
    remove : function(table, input, callback, failback) {
        this.connector.remove(table, input, function() {
            if (typeof callback === typeof Function)
                callback();
        }, function(e) {
            if (typeof failback === typeof Function)
                failback(e);
        });
    },
    /**
     * Clear a table.
     * @param {string} table The table in the database.
     */
    clearTable : function(table, callback, failback) {
        this.connector.clearTable(table, function() {
            if (typeof callback === typeof Function)
                callback();
        }, function(e) {
            if (typeof failback === typeof Function)
                failback(e);
        });
    },
    /**
     * Retrieve or create a keystore, and return it.
     * @param {string} table The table in the database.
     * @param {object} schema An object containing the property types.
     * @param {object|array} [kvps] An array of objects to add to the table, or a single object.
     * @param {boolean} [clearTable] If enabled, the table will be cleared.
     */
    createTableIfNotExist : function(table, schema, kvps, clearTable, callback, failback) {
        this.connector.createTableIfNotExist(table, schema, kvps, clearTable, function() {
            if (typeof callback === typeof Function)
                callback();
        }, function(e) {
            if (typeof failback === typeof Function)
                failback(e);
        });
    },
    /**
     * Selects the best storage persister available to be used by the platform.
     */
    setupConnector : function() {
        Max.Storage.connector = Max.MemoryStoreConnector;
        return;

        if (Max.Utils.hasFeature('openDatabase')) {
            Max.SQLConnector.db = window.openDatabase(
                Max.SQLConnector.dbOptions.name,
                Max.SQLConnector.dbOptions.version,
                Max.SQLConnector.dbOptions.display,
                Max.SQLConnector.dbOptions.size
            );
            Max.Storage.connector = Max.SQLConnector;
        } else if (Max.Utils.hasFeature('localStorage') === true) {
            Max.Storage.connector = Max.LocalStorageConnector;
        } else {
            Max.Storage.connector = Max.MemoryStoreConnector;
        }

    }
};
Max.Storage.setupConnector();


/**
 * The {Max.Log} makes it easier to troubleshoot client side problems in mobile applications installed on mobile devices, where examining logs of individual devices is not possible. Since the logs can be sent by the SDK without user intervention, problems can be identified and fixed without user involvement.
 * @memberof Max
 * @namespace Log
 * @private
 */
Max.Log = {};
Max.Log.store = 'MMSDKLogstore';
/**
 * @attribute {boolean} storeReady Determines whether the log store is ready for use.
 */
Max.Log.storeReady = false;
/**
 * Available log levels.
 * @readonly
 * @enum {number}
 */
Max.Log.Level = {
    SEVERE  : 500,
    WARNING : 400,
    INFO    : 300,
    CONFIG  : 200,
    FINE    : 100
};

Max.Storage.createTableIfNotExist(Max.Log.store, {
    date      : 'TEXT',
    level     : 'TEXT',
    msg       : 'TEXT',
    metadata  : 'TEXT',
    logSource : 'TEXT',
    file      : 'TEXT'
}, null, false, function() {
    Max.Log.storeReady = true;
});

/**
 * @method
 * @desc Store log record as SEVERE log level.
 * @param {string} msg The message to log.
 * @param {object} [metadata] Metadata related to the log.
 * @param {string} [logSource] The source for the log (anything other than "server" is permitted).
 * @param {*} [file] Any extra data the mobile client desires to associate with the log record.
 */
Max.Log.severe = function(msg, metadata, logSource, file) {
    this.log(this.Level.SEVERE, [].slice.apply(arguments));
};
/**
 * @method
 * @desc Store log record as WARNING log level.
 * @param {string} msg The message to log.
 * @param {object} [metadata] Metadata related to the log.
 * @param {string} [logSource] The source for the log (anything other than "server" is permitted).
 * @param {*} [file] Any extra data the mobile client desires to associate with the log record.
 */
Max.Log.warning = function(msg, metadata, logSource, file) {
    this.log(this.Level.WARNING, [].slice.apply(arguments));
};
/**
 * @method
 * @desc Store log record as INFO log level.
 * @param {string} msg The message to log.
 * @param {object} [metadata] Metadata related to the log.
 * @param {string} [logSource] The source for the log (anything other than "server" is permitted).
 * @param {*} [file] Any extra data the mobile client desires to associate with the log record.
 */
Max.Log.info = function(msg, metadata, logSource, file) {
    this.log(this.Level.INFO, [].slice.apply(arguments));
};
/**
 * @method
 * @desc Store log record as CONFIG log level.
 * @param {string} msg The message to log.
 * @param {object} [metadata] Metadata related to the log.
 * @param {string} [logSource] The source for the log (anything other than "server" is permitted).
 * @param {*} [file] Any extra data the mobile client desires to associate with the log record.
 */
Max.Log.config = function(msg, metadata, logSource, file) {
    this.log(this.Level.CONFIG, [].slice.apply(arguments));
};
/**
 * @method
 * @desc Store log record as FINE log level.
 * @param {string} msg The message to log.
 * @param {object} [metadata] Metadata related to the log.
 * @param {string} [logSource] The source for the log (anything other than "server" is permitted).
 * @param {*} [file] Any extra data the mobile client desires to associate with the log record.
 */
Max.Log.fine = function(msg, metadata, logSource, file) {
    this.log(this.Level.FINE, [].slice.apply(arguments));
};
/**
 * @method
 * @desc Store log record to the configured {Max.Storage} log store.
 * @param {*} levelOrWeight The log level as a string or log level weight as an integer defined in {Max.Log.Level}.
 * @param {array} params An array of log record parameters
 */
Max.Log.log = function(levelOrWeight, params) {
    var weight = typeof levelOrWeight == 'number' ? levelOrWeight : getLevelOrWeight(levelOrWeight);
    var level = typeof levelOrWeight == 'string' ? levelOrWeight : getLevelOrWeight(weight);
    if (!Max.Config.logging || weight < Max.Log.Level[Max.Config.logLevel]) return;
    var date = Max.Utils.dateToISO8601(new Date());
    var msg = params[0] || null;
    var metadata = params[1] ? ((Max.Utils.isAndroid || Max.Utils.isIOS) ? JSON.stringify(params[2]) : params[1]) : null;
    var logSource = params[2] || null;
    var file = params[3] ? Max.Utils.stringToBase64(params[3]) : null;
    if (Max.Config.logHandler.indexOf('Console') != -1)
        console.log('[MAGNET DEBUG] ', date, level || '', msg || '', metadata || '', logSource || '', file || '');
    if (Max.Config.logHandler.indexOf('DB') != -1) {
        if (this.storeReady) {
            Max.Storage.create(this.store, {
                date      : date,
                level     : level,
                msg       : msg,
                metadata  : metadata,
                logSource : logSource,
                file      : file
            }, null, function() {
                console.error('error storing log record');
            });
        } else {
            console.error('log store not ready yet.')
        }
    }
};
// given a log level or weight, return opposite
function getLevelOrWeight(levelOrWeight) {
    var level;
    for(var key in Max.Log.Level) {
        if (Max.Log.Level[key] === levelOrWeight)
            level = key;
        if (key === levelOrWeight)
            level = Max.Log.Level[key];
    }
    return level;
}
/**
 * @method
 * @desc Clear all records in the log store without dumping to the server.
 * @param {function} [callback] Callback to fire after a successful dump.
 * @param {function} [failback] Callback to fire after a failed attempt.
 */
Max.Log.clear = function(callback, failback) {
    Max.Storage.clearTable(Max.Log.store, callback, failback);
};

// log uncaught exceptions
if (typeof window !== 'undefined' && typeof window.onError !== 'undefined') {
    window.onError = function(err, url, line) {
        try{
            throw new Error('magnet');
        }catch(e) {
            err = err + '\n' + (e.stack ? e.stack : e.sourceURL) + ":" + e.line;
        }
        Max.Log.severe(err, {
            url  : url,
            line : line
        });
        return false;
    };
}

/**
 * A class for managing cookies.
 * @memberof Max
 * @namespace Cookie
 * @private
 */
var Cookie = {
    storeId: 'magnet-max-session',
    create : function(name, val, days) {
        if (window && window.process && window.process.type && window.localStorage) {
            localStorage.setItem(encodeURIComponent(name), encodeURIComponent(val));
        } else {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = '; expires=' + date.toGMTString();
            } else {
                var expires = '';
            }
            document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(val) + expires + '; path=/';
        }
    },
    get : function(name) {
        if (window && window.process && window.process.type && window.localStorage) {
            return localStorage.getItem(encodeURIComponent(name));
        } else {
            var nameEQ = encodeURIComponent(name) + '=';
            var ca = document.cookie.split(';');
            for (var i=0;i<ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length)
                };
                if (c.indexOf(nameEQ) == 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length))
                }
            }
        }
        return null;
    },
    remove : function(name) {
        if (window && window.process && window.process.type && window.localStorage) {
            return localStorage.removeItem(decodeURIComponent(name));
        } else {
            this.create(name, "", -1);
        }
    }
};
Max.Cookie = Cookie;

/**
 * @method
 * @desc Set Max SDK configuration attributes.
 * @param {object} obj An object containing key-value pairs to be set in the Max attributes.
 */
Max.set = function(obj) {
    for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (prop == 'baseUrl' && /^(ftp|http|https):/.test(obj[prop] === false))
                throw('invalid baseUrl - no protocol');
            Max.Config[prop] = obj[prop];
        }
    }
    return this;
};
/**
 * @method
 * @desc Reset Max SDK configuration attributes to their default values.
 * @private
 */
Max.reset = function() {
    Max.set({
        baseUrl : '',
        logging : true
    });
    return this;
};

/**
 * All SDK error responses.
 * @readonly
 * @enum {string}
 * @private
 */
Max.Error = {
    FORBIDDEN: 'forbidden',
    SESSION_EXPIRED: 'session expired',
    NOT_CONNECTED: 'not connected',
    INVALID_CREDENTIALS: 'invalid credentials',
    INVALID_CHANNEL: 'invalid channel',
    INVALID_MESSAGE_ID: 'invalid messageId',
    INVALID_TAGS: 'invalid tags',
    INVALID_CHANNEL_ID: 'channel id required',
    INVALID_CHANNEL_NAME: 'channel name required',
    INVALID_PUBLISH_PERMISSIONS: 'publishPermissions must be in ["anyone", "owner", "subscribers"]',
    INVALID_ACCEPTED: 'accepted property missing',
    INVALID_POLL_OPTIONS: 'invalid poll options',
    TOO_MANY_POLL_OPTIONS: 'only one option allowed',
    INVALID_POLL_ID: 'invalid poll id',
    INVALID_POLL_NAME: 'invalid poll name',
    INVALID_POLL_QUESTION: 'invalid poll question',
    POLL_ENDED: 'checklist has ended',
    INVALID_CHECKLIST_OPTIONS: 'invalid checklist options',
    TOO_MANY_CHECKLIST_OPTIONS: 'only one option allowed',
    INVALID_CHECKLIST_ID: 'invalid checklist id',
    INVALID_CHECKLIST_NAME: 'invalid checklist name',
    INVALID_SUBJECT: 'invalid subject',
    INVALID_DESCRIPTION: 'invalid description',
    CHECKLIST_ENDED: 'checklist has ended',
    INVALID_END_DATE: 'invalid end date',
    INVALID_PRIVACY_LIST_NAME: 'invalid privacy list name',
    INVALID_BOOKMARK_ID: 'invalid bookmark id',
    INVALID_BOOKMARK_NAME: 'invalid bookmark name',
    INVALID_BOOKMARK_BODY: 'invalid bookmark body',
    INVALID_OBJECT_TYPE: 'invalid object type',
    INVALID_OBJECT_ID: 'invalid object id',
    INVALID_APPROVAL_ID: 'invalid approval id',
    INVALID_APPROVAL_TYPE: 'invalid approval type. must be in ["REQUESTED", "RECEIVED"]',
    INVALID_APPROVAL_STATUS: 'invalid approval status. must be in ["PENDING", "APPROVED", "REJECTED", "CANCELLED"]',
    INVALID_APPROVERS: 'invalid approvers. at least one approver is required',
    INVALID_ATTACHMENT_KEY: 'invalid attachment property name',
    INVALID_PROPERTIES: 'invalid approval properties',
    ALREADY_CREATED: 'object has already been created',
    INVALID_LINE_ITEM: 'invalid line item',
    INVALID_APPROVAL: 'invalid approval',
    INVALID_CREATOR_TYPE: 'invalid object creator type',
    INVALID_OBJECT_STATUS: 'invalid object status',
    INVALID_USERGROUP_ID: 'group id required',
    INVALID_USER_IDS: 'invalid user list ids'
};

var mCurrentDevice = null;
var mCurrentUser = null;
var mXMPPConnection = null;
var MMS_DEVICE_ID = '1111-2222-3333-4444';
var mListenerStore = {};
var mListenerHandlerStore = {};
var mChannelStore = {};
var mPayloadTypes = {};

Max.Events.create(Max);

/**
 * @method
 * @desc Initialize the SDK with client information.
 */
Max.init = function(cfg) {
    if (Max.App.initialized) return;
    
    Max.init.inprocess = true;

    Max.App.clientId = cfg.clientId;
    Max.App.clientSecret = cfg.clientSecret;
    Max.Config.baseUrl = cfg.baseUrl || Max.Config.baseUrl;

    function done() {
        Max.App.initialized = true;
        Max.Log.info('sdk initialized');
    }

    Max.Device.checkInWithDevice(function(deviceErr) {
        Max.User.loginWithAccessToken(function(tokenErr) {
            if ( !deviceErr && !tokenErr ) {
                return done();
            }
            delete Max.init.inprocess;
            Max.User.loginWithRefreshToken(null, function() {
                done();
            }, function() {
                Max.User.clearSession();
                done();
            });
        });
    });
};

/**
 * @method
 * @desc Fires a callback when the SDK is ready to be used.
 * @param {function} callback The function to be fired.
 */
Max.onReady = function(callback) {
    if (Max.App.initialized === true) return callback();

    var readyCheck = setInterval(function() {
        if (Max.App.initialized === true) {
            clearInterval(readyCheck);
            (callback || function() {})();
        }
    }, 100);
};

/**
 * @method
 * @desc Get user information of the currently logged in user or null if not logged in.
 * @returns {Max.User} currently logged in user.
 */
Max.getCurrentUser = function() {
    return mCurrentUser || null;
};

// getters/setters used
Max.setUser = function(userObj) {
    mCurrentUser = userObj;
};
Max.setDevice = function(deviceObj) {
    mCurrentDevice = deviceObj;
};
Max.getConnection = function() {
    return mXMPPConnection || null;
};
Max.setConnection = function(conn) {
    mXMPPConnection = conn;
};
Max.getStore = function() {
    return mListenerStore || null;
};

/**
 * Third party plugins.
 */

/*!
 *  window.btoa/window.atob shim
 */
(function(){function t(t){this.message=t}var e="undefined"!=typeof exports?exports:this,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";t.prototype=Error(),t.prototype.name="InvalidCharacterError",e.btoa||(e.btoa=function(e){for(var o,n,a=0,i=r,c="";e.charAt(0|a)||(i="=",a%1);c+=i.charAt(63&o>>8-8*(a%1))){if(n=e.charCodeAt(a+=.75),n>255)throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");o=o<<8|n}return c}),e.atob||(e.atob=function(e){if(e=e.replace(/=+$/,""),1==e.length%4)throw new t("'atob' failed: The string to be decoded is not correctly encoded.");for(var o,n,a=0,i=0,c="";n=e.charAt(i++);~n&&(o=a%4?64*o+n:n,a++%4)?c+=String.fromCharCode(255&o>>(6&-2*a)):0)n=r.indexOf(n);return c})})();
/*!
 * strophe.js v1.2.5 - built on 09-02-2016
 */
!function(a){if(function(a,b){"function"==typeof define&&define.amd?define("strophe-base64",function(){return b()}):a.Base64=b()}(this,function(){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",b={encode:function(b){var c,d,e,f,g,h,i,j="",k=0;do c=b.charCodeAt(k++),d=b.charCodeAt(k++),e=b.charCodeAt(k++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?(g=(3&c)<<4,h=i=64):isNaN(e)&&(i=64),j=j+a.charAt(f)+a.charAt(g)+a.charAt(h)+a.charAt(i);while(k<b.length);return j},decode:function(b){var c,d,e,f,g,h,i,j="",k=0;b=b.replace(/[^A-Za-z0-9\+\/\=]/g,"");do f=a.indexOf(b.charAt(k++)),g=a.indexOf(b.charAt(k++)),h=a.indexOf(b.charAt(k++)),i=a.indexOf(b.charAt(k++)),c=f<<2|g>>4,d=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(c),64!=h&&(j+=String.fromCharCode(d)),64!=i&&(j+=String.fromCharCode(e));while(k<b.length);return j}};return b}),function(a,b){"function"==typeof define&&define.amd?define("strophe-sha1",function(){return b()}):a.SHA1=b()}(this,function(){function a(a,d){a[d>>5]|=128<<24-d%32,a[(d+64>>9<<4)+15]=d;var g,h,i,j,k,l,m,n,o=new Array(80),p=1732584193,q=-271733879,r=-1732584194,s=271733878,t=-1009589776;for(g=0;g<a.length;g+=16){for(j=p,k=q,l=r,m=s,n=t,h=0;80>h;h++)16>h?o[h]=a[g+h]:o[h]=f(o[h-3]^o[h-8]^o[h-14]^o[h-16],1),i=e(e(f(p,5),b(h,q,r,s)),e(e(t,o[h]),c(h))),t=s,s=r,r=f(q,30),q=p,p=i;p=e(p,j),q=e(q,k),r=e(r,l),s=e(s,m),t=e(t,n)}return[p,q,r,s,t]}function b(a,b,c,d){return 20>a?b&c|~b&d:40>a?b^c^d:60>a?b&c|b&d|c&d:b^c^d}function c(a){return 20>a?1518500249:40>a?1859775393:60>a?-1894007588:-899497514}function d(b,c){var d=g(b);d.length>16&&(d=a(d,8*b.length));for(var e=new Array(16),f=new Array(16),h=0;16>h;h++)e[h]=909522486^d[h],f[h]=1549556828^d[h];var i=a(e.concat(g(c)),512+8*c.length);return a(f.concat(i),672)}function e(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function f(a,b){return a<<b|a>>>32-b}function g(a){for(var b=[],c=255,d=0;d<8*a.length;d+=8)b[d>>5]|=(a.charCodeAt(d/8)&c)<<24-d%32;return b}function h(a){for(var b="",c=255,d=0;d<32*a.length;d+=8)b+=String.fromCharCode(a[d>>5]>>>24-d%32&c);return b}function i(a){for(var b,c,d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e="",f=0;f<4*a.length;f+=3)for(b=(a[f>>2]>>8*(3-f%4)&255)<<16|(a[f+1>>2]>>8*(3-(f+1)%4)&255)<<8|a[f+2>>2]>>8*(3-(f+2)%4)&255,c=0;4>c;c++)e+=8*f+6*c>32*a.length?"=":d.charAt(b>>6*(3-c)&63);return e}return{b64_hmac_sha1:function(a,b){return i(d(a,b))},b64_sha1:function(b){return i(a(g(b),8*b.length))},binb2str:h,core_hmac_sha1:d,str_hmac_sha1:function(a,b){return h(d(a,b))},str_sha1:function(b){return h(a(g(b),8*b.length))}}}),function(a,b){"function"==typeof define&&define.amd?define("strophe-md5",function(){return b()}):a.MD5=b()}(this,function(a){var b=function(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c},c=function(a,b){return a<<b|a>>>32-b},d=function(a){for(var b=[],c=0;c<8*a.length;c+=8)b[c>>5]|=(255&a.charCodeAt(c/8))<<c%32;return b},e=function(a){for(var b="",c=0;c<32*a.length;c+=8)b+=String.fromCharCode(a[c>>5]>>>c%32&255);return b},f=function(a){for(var b="0123456789abcdef",c="",d=0;d<4*a.length;d++)c+=b.charAt(a[d>>2]>>d%4*8+4&15)+b.charAt(a[d>>2]>>d%4*8&15);return c},g=function(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)},h=function(a,b,c,d,e,f,h){return g(b&c|~b&d,a,b,e,f,h)},i=function(a,b,c,d,e,f,h){return g(b&d|c&~d,a,b,e,f,h)},j=function(a,b,c,d,e,f,h){return g(b^c^d,a,b,e,f,h)},k=function(a,b,c,d,e,f,h){return g(c^(b|~d),a,b,e,f,h)},l=function(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;for(var d,e,f,g,l=1732584193,m=-271733879,n=-1732584194,o=271733878,p=0;p<a.length;p+=16)d=l,e=m,f=n,g=o,l=h(l,m,n,o,a[p+0],7,-680876936),o=h(o,l,m,n,a[p+1],12,-389564586),n=h(n,o,l,m,a[p+2],17,606105819),m=h(m,n,o,l,a[p+3],22,-1044525330),l=h(l,m,n,o,a[p+4],7,-176418897),o=h(o,l,m,n,a[p+5],12,1200080426),n=h(n,o,l,m,a[p+6],17,-1473231341),m=h(m,n,o,l,a[p+7],22,-45705983),l=h(l,m,n,o,a[p+8],7,1770035416),o=h(o,l,m,n,a[p+9],12,-1958414417),n=h(n,o,l,m,a[p+10],17,-42063),m=h(m,n,o,l,a[p+11],22,-1990404162),l=h(l,m,n,o,a[p+12],7,1804603682),o=h(o,l,m,n,a[p+13],12,-40341101),n=h(n,o,l,m,a[p+14],17,-1502002290),m=h(m,n,o,l,a[p+15],22,1236535329),l=i(l,m,n,o,a[p+1],5,-165796510),o=i(o,l,m,n,a[p+6],9,-1069501632),n=i(n,o,l,m,a[p+11],14,643717713),m=i(m,n,o,l,a[p+0],20,-373897302),l=i(l,m,n,o,a[p+5],5,-701558691),o=i(o,l,m,n,a[p+10],9,38016083),n=i(n,o,l,m,a[p+15],14,-660478335),m=i(m,n,o,l,a[p+4],20,-405537848),l=i(l,m,n,o,a[p+9],5,568446438),o=i(o,l,m,n,a[p+14],9,-1019803690),n=i(n,o,l,m,a[p+3],14,-187363961),m=i(m,n,o,l,a[p+8],20,1163531501),l=i(l,m,n,o,a[p+13],5,-1444681467),o=i(o,l,m,n,a[p+2],9,-51403784),n=i(n,o,l,m,a[p+7],14,1735328473),m=i(m,n,o,l,a[p+12],20,-1926607734),l=j(l,m,n,o,a[p+5],4,-378558),o=j(o,l,m,n,a[p+8],11,-2022574463),n=j(n,o,l,m,a[p+11],16,1839030562),m=j(m,n,o,l,a[p+14],23,-35309556),l=j(l,m,n,o,a[p+1],4,-1530992060),o=j(o,l,m,n,a[p+4],11,1272893353),n=j(n,o,l,m,a[p+7],16,-155497632),m=j(m,n,o,l,a[p+10],23,-1094730640),l=j(l,m,n,o,a[p+13],4,681279174),o=j(o,l,m,n,a[p+0],11,-358537222),n=j(n,o,l,m,a[p+3],16,-722521979),m=j(m,n,o,l,a[p+6],23,76029189),l=j(l,m,n,o,a[p+9],4,-640364487),o=j(o,l,m,n,a[p+12],11,-421815835),n=j(n,o,l,m,a[p+15],16,530742520),m=j(m,n,o,l,a[p+2],23,-995338651),l=k(l,m,n,o,a[p+0],6,-198630844),o=k(o,l,m,n,a[p+7],10,1126891415),n=k(n,o,l,m,a[p+14],15,-1416354905),m=k(m,n,o,l,a[p+5],21,-57434055),l=k(l,m,n,o,a[p+12],6,1700485571),o=k(o,l,m,n,a[p+3],10,-1894986606),n=k(n,o,l,m,a[p+10],15,-1051523),m=k(m,n,o,l,a[p+1],21,-2054922799),l=k(l,m,n,o,a[p+8],6,1873313359),o=k(o,l,m,n,a[p+15],10,-30611744),n=k(n,o,l,m,a[p+6],15,-1560198380),m=k(m,n,o,l,a[p+13],21,1309151649),l=k(l,m,n,o,a[p+4],6,-145523070),o=k(o,l,m,n,a[p+11],10,-1120210379),n=k(n,o,l,m,a[p+2],15,718787259),m=k(m,n,o,l,a[p+9],21,-343485551),l=b(l,d),m=b(m,e),n=b(n,f),o=b(o,g);return[l,m,n,o]},m={hexdigest:function(a){return f(l(d(a),8*a.length))},hash:function(a){return e(l(d(a),8*a.length))}};return m}),function(a,b){"function"==typeof define&&define.amd?define("strophe-utils",function(){return b()}):a.stropheUtils=b()}(this,function(){var a={utf16to8:function(a){var b,c,d="",e=a.length;for(b=0;e>b;b++)c=a.charCodeAt(b),c>=0&&127>=c?d+=a.charAt(b):c>2047?(d+=String.fromCharCode(224|c>>12&15),d+=String.fromCharCode(128|c>>6&63),d+=String.fromCharCode(128|c>>0&63)):(d+=String.fromCharCode(192|c>>6&31),d+=String.fromCharCode(128|c>>0&63));return d},addCookies:function(a){var b,c,d,e,f,g,h;for(b in a||{})f="",g="",h="",c=a[b],d="object"==typeof c,e=escape(unescape(d?c.value:c)),d&&(f=c.expires?";expires="+c.expires:"",g=c.domain?";domain="+c.domain:"",h=c.path?";path="+c.path:""),document.cookie=b+"="+e+f+g+h}};return a}),function(a,b){return"function"==typeof define&&define.amd?void define("strophe-polyfill",[],function(){return b()}):b()}(this,function(){Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,c=Array.prototype.slice,d=Array.prototype.concat,e=c.call(arguments,1);return function(){return b.apply(a?a:this,d.call(e,c.call(arguments,0)))}}),Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a){var b=this.length,c=Number(arguments[1])||0;for(c=0>c?Math.ceil(c):Math.floor(c),0>c&&(c+=b);b>c;c++)if(c in this&&this[c]===a)return c;return-1})}),function(a,b){if("function"==typeof define&&define.amd)define("strophe-core",["strophe-sha1","strophe-base64","strophe-md5","strophe-utils","strophe-polyfill"],function(){return b.apply(this,arguments)});else{var c=b(a.SHA1,a.Base64,a.MD5,a.stropheUtils);window.Strophe=c.Strophe,window.$build=c.$build,window.$iq=c.$iq,window.$msg=c.$msg,window.$pres=c.$pres,window.SHA1=c.SHA1,window.Base64=c.Base64,window.MD5=c.MD5,window.b64_hmac_sha1=c.SHA1.b64_hmac_sha1,window.b64_sha1=c.SHA1.b64_sha1,window.str_hmac_sha1=c.SHA1.str_hmac_sha1,window.str_sha1=c.SHA1.str_sha1}}(this,function(a,b,c,d){function e(a,b){return new i.Builder(a,b)}function f(a){return new i.Builder("message",a)}function g(a){return new i.Builder("iq",a)}function h(a){return new i.Builder("presence",a)}var i;return i={VERSION:"1.2.5",NS:{HTTPBIND:"http://jabber.org/protocol/httpbind",BOSH:"urn:xmpp:xbosh",CLIENT:"jabber:client",AUTH:"jabber:iq:auth",ROSTER:"jabber:iq:roster",PROFILE:"jabber:iq:profile",DISCO_INFO:"http://jabber.org/protocol/disco#info",DISCO_ITEMS:"http://jabber.org/protocol/disco#items",MUC:"http://jabber.org/protocol/muc",SASL:"urn:ietf:params:xml:ns:xmpp-sasl",STREAM:"http://etherx.jabber.org/streams",FRAMING:"urn:ietf:params:xml:ns:xmpp-framing",BIND:"urn:ietf:params:xml:ns:xmpp-bind",SESSION:"urn:ietf:params:xml:ns:xmpp-session",VERSION:"jabber:iq:version",STANZAS:"urn:ietf:params:xml:ns:xmpp-stanzas",XHTML_IM:"http://jabber.org/protocol/xhtml-im",XHTML:"http://www.w3.org/1999/xhtml"},XHTML:{tags:["a","blockquote","br","cite","em","img","li","ol","p","span","strong","ul","body"],attributes:{a:["href"],blockquote:["style"],br:[],cite:["style"],em:[],img:["src","alt","style","height","width"],li:["style"],ol:["style"],p:["style"],span:["style"],strong:[],ul:["style"],body:[]},css:["background-color","color","font-family","font-size","font-style","font-weight","margin-left","margin-right","text-align","text-decoration"],validTag:function(a){for(var b=0;b<i.XHTML.tags.length;b++)if(a==i.XHTML.tags[b])return!0;return!1},validAttribute:function(a,b){if("undefined"!=typeof i.XHTML.attributes[a]&&i.XHTML.attributes[a].length>0)for(var c=0;c<i.XHTML.attributes[a].length;c++)if(b==i.XHTML.attributes[a][c])return!0;return!1},validCSS:function(a){for(var b=0;b<i.XHTML.css.length;b++)if(a==i.XHTML.css[b])return!0;return!1}},Status:{ERROR:0,CONNECTING:1,CONNFAIL:2,AUTHENTICATING:3,AUTHFAIL:4,CONNECTED:5,DISCONNECTED:6,DISCONNECTING:7,ATTACHED:8,REDIRECT:9},LogLevel:{DEBUG:0,INFO:1,WARN:2,ERROR:3,FATAL:4},ElementType:{NORMAL:1,TEXT:3,CDATA:4,FRAGMENT:11},TIMEOUT:1.1,SECONDARY_TIMEOUT:.1,addNamespace:function(a,b){i.NS[a]=b},forEachChild:function(a,b,c){var d,e;for(d=0;d<a.childNodes.length;d++)e=a.childNodes[d],e.nodeType!=i.ElementType.NORMAL||b&&!this.isTagEqual(e,b)||c(e)},isTagEqual:function(a,b){return a.tagName==b},_xmlGenerator:null,_makeGenerator:function(){var a;return void 0===document.implementation.createDocument||document.implementation.createDocument&&document.documentMode&&document.documentMode<10?(a=this._getIEXmlDom(),a.appendChild(a.createElement("strophe"))):a=document.implementation.createDocument("jabber:client","strophe",null),a},xmlGenerator:function(){return i._xmlGenerator||(i._xmlGenerator=i._makeGenerator()),i._xmlGenerator},_getIEXmlDom:function(){for(var a=null,b=["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.5.0","Msxml2.DOMDocument.4.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"],c=0;c<b.length&&null===a;c++)try{a=new ActiveXObject(b[c])}catch(d){a=null}return a},xmlElement:function(a){if(!a)return null;var b,c,d,e=i.xmlGenerator().createElement(a);for(b=1;b<arguments.length;b++){var f=arguments[b];if(f)if("string"==typeof f||"number"==typeof f)e.appendChild(i.xmlTextNode(f));else if("object"==typeof f&&"function"==typeof f.sort)for(c=0;c<f.length;c++){var g=f[c];"object"==typeof g&&"function"==typeof g.sort&&void 0!==g[1]&&null!==g[1]&&e.setAttribute(g[0],g[1])}else if("object"==typeof f)for(d in f)f.hasOwnProperty(d)&&void 0!==f[d]&&null!==f[d]&&e.setAttribute(d,f[d])}return e},xmlescape:function(a){return a=a.replace(/\&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=a.replace(/'/g,"&apos;"),a=a.replace(/"/g,"&quot;")},xmlunescape:function(a){return a=a.replace(/\&amp;/g,"&"),a=a.replace(/&lt;/g,"<"),a=a.replace(/&gt;/g,">"),a=a.replace(/&apos;/g,"'"),a=a.replace(/&quot;/g,'"')},xmlTextNode:function(a){return i.xmlGenerator().createTextNode(a)},xmlHtmlNode:function(a){var b;if(window.DOMParser){var c=new DOMParser;b=c.parseFromString(a,"text/xml")}else b=new ActiveXObject("Microsoft.XMLDOM"),b.async="false",b.loadXML(a);return b},getText:function(a){if(!a)return null;var b="";0===a.childNodes.length&&a.nodeType==i.ElementType.TEXT&&(b+=a.nodeValue);for(var c=0;c<a.childNodes.length;c++)a.childNodes[c].nodeType==i.ElementType.TEXT&&(b+=a.childNodes[c].nodeValue);return i.xmlescape(b)},copyElement:function(a){var b,c;if(a.nodeType==i.ElementType.NORMAL){for(c=i.xmlElement(a.tagName),b=0;b<a.attributes.length;b++)c.setAttribute(a.attributes[b].nodeName,a.attributes[b].value);for(b=0;b<a.childNodes.length;b++)c.appendChild(i.copyElement(a.childNodes[b]))}else a.nodeType==i.ElementType.TEXT&&(c=i.xmlGenerator().createTextNode(a.nodeValue));return c},createHtml:function(a){var b,c,d,e,f,g,h,j,k,l,m;if(a.nodeType==i.ElementType.NORMAL)if(e=a.nodeName.toLowerCase(),i.XHTML.validTag(e))try{for(c=i.xmlElement(e),b=0;b<i.XHTML.attributes[e].length;b++)if(f=i.XHTML.attributes[e][b],g=a.getAttribute(f),"undefined"!=typeof g&&null!==g&&""!==g&&g!==!1&&0!==g)if("style"==f&&"object"==typeof g&&"undefined"!=typeof g.cssText&&(g=g.cssText),"style"==f){for(h=[],j=g.split(";"),d=0;d<j.length;d++)k=j[d].split(":"),l=k[0].replace(/^\s*/,"").replace(/\s*$/,"").toLowerCase(),i.XHTML.validCSS(l)&&(m=k[1].replace(/^\s*/,"").replace(/\s*$/,""),h.push(l+": "+m));h.length>0&&(g=h.join("; "),c.setAttribute(f,g))}else c.setAttribute(f,g);for(b=0;b<a.childNodes.length;b++)c.appendChild(i.createHtml(a.childNodes[b]))}catch(n){c=i.xmlTextNode("")}else for(c=i.xmlGenerator().createDocumentFragment(),b=0;b<a.childNodes.length;b++)c.appendChild(i.createHtml(a.childNodes[b]));else if(a.nodeType==i.ElementType.FRAGMENT)for(c=i.xmlGenerator().createDocumentFragment(),b=0;b<a.childNodes.length;b++)c.appendChild(i.createHtml(a.childNodes[b]));else a.nodeType==i.ElementType.TEXT&&(c=i.xmlTextNode(a.nodeValue));return c},escapeNode:function(a){return"string"!=typeof a?a:a.replace(/^\s+|\s+$/g,"").replace(/\\/g,"\\5c").replace(/ /g,"\\20").replace(/\"/g,"\\22").replace(/\&/g,"\\26").replace(/\'/g,"\\27").replace(/\//g,"\\2f").replace(/:/g,"\\3a").replace(/</g,"\\3c").replace(/>/g,"\\3e").replace(/@/g,"\\40")},unescapeNode:function(a){return"string"!=typeof a?a:a.replace(/\\20/g," ").replace(/\\22/g,'"').replace(/\\26/g,"&").replace(/\\27/g,"'").replace(/\\2f/g,"/").replace(/\\3a/g,":").replace(/\\3c/g,"<").replace(/\\3e/g,">").replace(/\\40/g,"@").replace(/\\5c/g,"\\")},getNodeFromJid:function(a){return a.indexOf("@")<0?null:a.split("@")[0]},getDomainFromJid:function(a){var b=i.getBareJidFromJid(a);if(b.indexOf("@")<0)return b;var c=b.split("@");return c.splice(0,1),c.join("@")},getResourceFromJid:function(a){var b=a.split("/");return b.length<2?null:(b.splice(0,1),b.join("/"))},getBareJidFromJid:function(a){return a?a.split("/")[0]:null},log:function(a,b){},debug:function(a){this.log(this.LogLevel.DEBUG,a)},info:function(a){this.log(this.LogLevel.INFO,a)},warn:function(a){this.log(this.LogLevel.WARN,a)},error:function(a){this.log(this.LogLevel.ERROR,a)},fatal:function(a){this.log(this.LogLevel.FATAL,a)},serialize:function(a){var b;if(!a)return null;"function"==typeof a.tree&&(a=a.tree());var c,d,e=a.nodeName;for(a.getAttribute("_realname")&&(e=a.getAttribute("_realname")),b="<"+e,c=0;c<a.attributes.length;c++)"_realname"!=a.attributes[c].nodeName&&(b+=" "+a.attributes[c].nodeName+"='"+a.attributes[c].value.replace(/&/g,"&amp;").replace(/\'/g,"&apos;").replace(/>/g,"&gt;").replace(/</g,"&lt;")+"'");if(a.childNodes.length>0){for(b+=">",c=0;c<a.childNodes.length;c++)switch(d=a.childNodes[c],d.nodeType){case i.ElementType.NORMAL:b+=i.serialize(d);break;case i.ElementType.TEXT:b+=i.xmlescape(d.nodeValue);break;case i.ElementType.CDATA:b+="<![CDATA["+d.nodeValue+"]]>"}b+="</"+e+">"}else b+="/>";return b},_requestId:0,_connectionPlugins:{},addConnectionPlugin:function(a,b){i._connectionPlugins[a]=b}},i.Builder=function(a,b){("presence"==a||"message"==a||"iq"==a)&&(b&&!b.xmlns?b.xmlns=i.NS.CLIENT:b||(b={xmlns:i.NS.CLIENT})),this.nodeTree=i.xmlElement(a,b),this.node=this.nodeTree},i.Builder.prototype={tree:function(){return this.nodeTree},toString:function(){return i.serialize(this.nodeTree)},up:function(){return this.node=this.node.parentNode,this},attrs:function(a){for(var b in a)a.hasOwnProperty(b)&&(void 0===a[b]?this.node.removeAttribute(b):this.node.setAttribute(b,a[b]));return this},c:function(a,b,c){var d=i.xmlElement(a,b,c);return this.node.appendChild(d),"string"!=typeof c&&(this.node=d),this},cnode:function(a){var b,c=i.xmlGenerator();try{b=void 0!==c.importNode}catch(d){b=!1}var e=b?c.importNode(a,!0):i.copyElement(a);return this.node.appendChild(e),this.node=e,this},t:function(a){var b=i.xmlTextNode(a);return this.node.appendChild(b),this},h:function(a){var b=document.createElement("body");b.innerHTML=a;for(var c=i.createHtml(b);c.childNodes.length>0;)this.node.appendChild(c.childNodes[0]);return this}},i.Handler=function(a,b,c,d,e,f,g){this.handler=a,this.ns=b,this.name=c,this.type=d,this.id=e,this.options=g||{matchBare:!1},this.options.matchBare||(this.options.matchBare=!1),this.options.matchBare?this.from=f?i.getBareJidFromJid(f):null:this.from=f,this.user=!0},i.Handler.prototype={isMatch:function(a){var b,c=null;if(c=this.options.matchBare?i.getBareJidFromJid(a.getAttribute("from")):a.getAttribute("from"),b=!1,this.ns){var d=this;i.forEachChild(a,null,function(a){a.getAttribute("xmlns")==d.ns&&(b=!0)}),b=b||a.getAttribute("xmlns")==this.ns}else b=!0;var e=a.getAttribute("type");return!b||this.name&&!i.isTagEqual(a,this.name)||this.type&&(Array.isArray(this.type)?-1==this.type.indexOf(e):e!=this.type)||this.id&&a.getAttribute("id")!=this.id||this.from&&c!=this.from?!1:!0},run:function(a){var b=null;try{b=this.handler(a)}catch(c){throw c.sourceURL?i.fatal("error: "+this.handler+" "+c.sourceURL+":"+c.line+" - "+c.name+": "+c.message):c.fileName?("undefined"!=typeof console&&(console.trace(),console.error(this.handler," - error - ",c,c.message)),i.fatal("error: "+this.handler+" "+c.fileName+":"+c.lineNumber+" - "+c.name+": "+c.message)):i.fatal("error: "+c.message+"\n"+c.stack),c}return b},toString:function(){return"{Handler: "+this.handler+"("+this.name+","+this.id+","+this.ns+")}"}},i.TimedHandler=function(a,b){this.period=a,this.handler=b,this.lastCalled=(new Date).getTime(),this.user=!0},i.TimedHandler.prototype={run:function(){return this.lastCalled=(new Date).getTime(),this.handler()},reset:function(){this.lastCalled=(new Date).getTime()},toString:function(){return"{TimedHandler: "+this.handler+"("+this.period+")}"}},i.Connection=function(a,b){this.service=a,this.options=b||{};var c=this.options.protocol||"";0===a.indexOf("ws:")||0===a.indexOf("wss:")||0===c.indexOf("ws")?this._proto=new i.Websocket(this):this._proto=new i.Bosh(this),this.jid="",this.domain=null,this.features=null,this._sasl_data={},this.do_session=!1,this.do_bind=!1,this.timedHandlers=[],this.handlers=[],this.removeTimeds=[],this.removeHandlers=[],this.addTimeds=[],this.addHandlers=[],this._authentication={},this._idleTimeout=null,this._disconnectTimeout=null,this.authenticated=!1,this.connected=!1,this.disconnecting=!1,this.do_authentication=!0,this.paused=!1,this.restored=!1,this._data=[],this._uniqueId=0,this._sasl_success_handler=null,this._sasl_failure_handler=null,this._sasl_challenge_handler=null,this.maxRetries=5,this._idleTimeout=setTimeout(this._onIdle.bind(this),100),d.addCookies(this.options.cookies);for(var e in i._connectionPlugins)if(i._connectionPlugins.hasOwnProperty(e)){var f=i._connectionPlugins[e],g=function(){};g.prototype=f,this[e]=new g,this[e].init(this)}},i.Connection.prototype={reset:function(){this._proto._reset(),this.do_session=!1,this.do_bind=!1,this.timedHandlers=[],this.handlers=[],this.removeTimeds=[],this.removeHandlers=[],this.addTimeds=[],this.addHandlers=[],this._authentication={},this.authenticated=!1,this.connected=!1,this.disconnecting=!1,this.restored=!1,this._data=[],this._requests=[],this._uniqueId=0},pause:function(){this.paused=!0},resume:function(){this.paused=!1},getUniqueId:function(a){var b="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"==a?b:3&b|8;return c.toString(16)});return"string"==typeof a||"number"==typeof a?b+":"+a:b+""},connect:function(a,b,c,d,e,f,g){this.jid=a,this.authzid=i.getBareJidFromJid(this.jid),this.authcid=g||i.getNodeFromJid(this.jid),this.pass=b,this.servtype="xmpp",this.connect_callback=c,this.disconnecting=!1,this.connected=!1,this.authenticated=!1,this.restored=!1,this.domain=i.getDomainFromJid(this.jid),this._changeConnectStatus(i.Status.CONNECTING,null),this._proto._connect(d,e,f)},attach:function(a,b,c,d,e,f,g){if(!(this._proto instanceof i.Bosh))throw{name:"StropheSessionError",message:'The "attach" method can only be used with a BOSH connection.'};this._proto._attach(a,b,c,d,e,f,g)},restore:function(a,b,c,d,e){if(!this._sessionCachingSupported())throw{name:"StropheSessionError",message:'The "restore" method can only be used with a BOSH connection.'};this._proto._restore(a,b,c,d,e)},_sessionCachingSupported:function(){if(this._proto instanceof i.Bosh){if(!JSON)return!1;try{window.sessionStorage.setItem("_strophe_","_strophe_"),window.sessionStorage.removeItem("_strophe_")}catch(a){return!1}return!0}return!1},xmlInput:function(a){},xmlOutput:function(a){},rawInput:function(a){},rawOutput:function(a){},nextValidRid:function(a){},send:function(a){if(null!==a){if("function"==typeof a.sort)for(var b=0;b<a.length;b++)this._queueData(a[b]);else this._queueData("function"==typeof a.tree?a.tree():a);this._proto._send()}},flush:function(){clearTimeout(this._idleTimeout),this._onIdle()},sendIQ:function(a,b,c,d){var e=null,f=this;"function"==typeof a.tree&&(a=a.tree());var g=a.getAttribute("id");g||(g=this.getUniqueId("sendIQ"),a.setAttribute("id",g));var h=a.getAttribute("to"),j=this.jid,k=this.addHandler(function(a){e&&f.deleteTimedHandler(e);var d=!1,g=a.getAttribute("from");if(g!==h&&(h||g!==i.getBareJidFromJid(j)&&g!==i.getDomainFromJid(j)&&g!==j)||(d=!0),!d)throw{name:"StropheError",message:"Got answer to IQ from wrong jid:"+g+"\nExpected jid: "+h};var k=a.getAttribute("type");if("result"==k)b&&b(a);else{if("error"!=k)throw{name:"StropheError",message:"Got bad IQ type of "+k};c&&c(a)}},null,"iq",["error","result"],g);return d&&(e=this.addTimedHandler(d,function(){return f.deleteHandler(k),c&&c(null),!1})),this.send(a),g},_queueData:function(a){if(null===a||!a.tagName||!a.childNodes)throw{name:"StropheError",message:"Cannot queue non-DOMElement."};this._data.push(a)},_sendRestart:function(){this._data.push("restart"),this._proto._sendRestart(),this._idleTimeout=setTimeout(this._onIdle.bind(this),100)},addTimedHandler:function(a,b){var c=new i.TimedHandler(a,b);return this.addTimeds.push(c),c},deleteTimedHandler:function(a){this.removeTimeds.push(a)},addHandler:function(a,b,c,d,e,f,g){var h=new i.Handler(a,b,c,d,e,f,g);return this.addHandlers.push(h),h},deleteHandler:function(a){this.removeHandlers.push(a);var b=this.addHandlers.indexOf(a);b>=0&&this.addHandlers.splice(b,1)},disconnect:function(a){if(this._changeConnectStatus(i.Status.DISCONNECTING,a),i.info("Disconnect was called because: "+a),this.connected){var b=!1;this.disconnecting=!0,this.authenticated&&(b=h({xmlns:i.NS.CLIENT,type:"unavailable"})),this._disconnectTimeout=this._addSysTimedHandler(3e3,this._onDisconnectTimeout.bind(this)),this._proto._disconnect(b)}else i.info("Disconnect was called before Strophe connected to the server"),this._proto._abortAllRequests()},_changeConnectStatus:function(a,b){for(var c in i._connectionPlugins)if(i._connectionPlugins.hasOwnProperty(c)){var d=this[c];if(d.statusChanged)try{d.statusChanged(a,b)}catch(e){i.error(""+c+" plugin caused an exception changing status: "+e)}}if(this.connect_callback)try{this.connect_callback(a,b)}catch(f){i.error("User connection callback caused an exception: "+f)}},_doDisconnect:function(a){"number"==typeof this._idleTimeout&&clearTimeout(this._idleTimeout),null!==this._disconnectTimeout&&(this.deleteTimedHandler(this._disconnectTimeout),this._disconnectTimeout=null),i.info("_doDisconnect was called"),this._proto._doDisconnect(),this.authenticated=!1,this.disconnecting=!1,this.restored=!1,this.handlers=[],this.timedHandlers=[],this.removeTimeds=[],this.removeHandlers=[],this.addTimeds=[],this.addHandlers=[],this._changeConnectStatus(i.Status.DISCONNECTED,a),this.connected=!1},_dataRecv:function(a,b){i.info("_dataRecv called");var c=this._proto._reqToData(a);if(null!==c){this.xmlInput!==i.Connection.prototype.xmlInput&&this.xmlInput(c.nodeName===this._proto.strip&&c.childNodes.length?c.childNodes[0]:c),this.rawInput!==i.Connection.prototype.rawInput&&this.rawInput(b?b:i.serialize(c));for(var d,e;this.removeHandlers.length>0;)e=this.removeHandlers.pop(),d=this.handlers.indexOf(e),d>=0&&this.handlers.splice(d,1);for(;this.addHandlers.length>0;)this.handlers.push(this.addHandlers.pop());if(this.disconnecting&&this._proto._emptyQueue())return void this._doDisconnect();var f,g,h=c.getAttribute("type");if(null!==h&&"terminate"==h){if(this.disconnecting)return;return f=c.getAttribute("condition"),g=c.getElementsByTagName("conflict"),null!==f?("remote-stream-error"==f&&g.length>0&&(f="conflict"),this._changeConnectStatus(i.Status.CONNFAIL,f)):this._changeConnectStatus(i.Status.CONNFAIL,"unknown"),void this._doDisconnect(f)}var j=this;i.forEachChild(c,null,function(a){var b,c;for(c=j.handlers,j.handlers=[],b=0;b<c.length;b++){var d=c[b];try{!d.isMatch(a)||!j.authenticated&&d.user?j.handlers.push(d):d.run(a)&&j.handlers.push(d)}catch(e){i.warn("Removing Strophe handlers due to uncaught exception: "+e.message)}}})}},mechanisms:{},_connect_cb:function(a,b,c){i.info("_connect_cb was called"),this.connected=!0;var d;try{d=this._proto._reqToData(a)}catch(e){if("badformat"!=e)throw e;this._changeConnectStatus(i.Status.CONNFAIL,"bad-format"),this._doDisconnect("bad-format")}if(d){this.xmlInput!==i.Connection.prototype.xmlInput&&this.xmlInput(d.nodeName===this._proto.strip&&d.childNodes.length?d.childNodes[0]:d),this.rawInput!==i.Connection.prototype.rawInput&&this.rawInput(c?c:i.serialize(d));var f=this._proto._connect_cb(d);if(f!==i.Status.CONNFAIL){this._authentication.sasl_scram_sha1=!1,this._authentication.sasl_plain=!1,this._authentication.sasl_digest_md5=!1,this._authentication.sasl_anonymous=!1,this._authentication.legacy_auth=!1;var g;g=d.getElementsByTagNameNS?d.getElementsByTagNameNS(i.NS.STREAM,"features").length>0:d.getElementsByTagName("stream:features").length>0||d.getElementsByTagName("features").length>0;var h,j,k=d.getElementsByTagName("mechanism"),l=[],m=!1;if(!g)return void this._proto._no_auth_received(b);if(k.length>0)for(h=0;h<k.length;h++)j=i.getText(k[h]),this.mechanisms[j]&&l.push(this.mechanisms[j]);return this._authentication.legacy_auth=d.getElementsByTagName("auth").length>0,(m=this._authentication.legacy_auth||l.length>0)?void(this.do_authentication!==!1&&this.authenticate(l)):void this._proto._no_auth_received(b)}}},authenticate:function(a){var c;for(c=0;c<a.length-1;++c){for(var d=c,f=c+1;f<a.length;++f)a[f].prototype.priority>a[d].prototype.priority&&(d=f);if(d!=c){var h=a[c];a[c]=a[d],a[d]=h}}var j=!1;for(c=0;c<a.length;++c)if(a[c].test(this)){this._sasl_success_handler=this._addSysHandler(this._sasl_success_cb.bind(this),null,"success",null,null),this._sasl_failure_handler=this._addSysHandler(this._sasl_failure_cb.bind(this),null,"failure",null,null),this._sasl_challenge_handler=this._addSysHandler(this._sasl_challenge_cb.bind(this),null,"challenge",null,null),this._sasl_mechanism=new a[c],this._sasl_mechanism.onStart(this);var k=e("auth",{xmlns:i.NS.SASL,mechanism:this._sasl_mechanism.name});if(this._sasl_mechanism.isClientFirst){var l=this._sasl_mechanism.onChallenge(this,null);k.t(b.encode(l))}this.send(k.tree()),j=!0;break}j||(null===i.getNodeFromJid(this.jid)?(this._changeConnectStatus(i.Status.CONNFAIL,"x-strophe-bad-non-anon-jid"),this.disconnect("x-strophe-bad-non-anon-jid")):(this._changeConnectStatus(i.Status.AUTHENTICATING,null),this._addSysHandler(this._auth1_cb.bind(this),null,null,null,"_auth_1"),this.send(g({type:"get",to:this.domain,id:"_auth_1"}).c("query",{xmlns:i.NS.AUTH}).c("username",{}).t(i.getNodeFromJid(this.jid)).tree())))},_sasl_challenge_cb:function(a){var c=b.decode(i.getText(a)),d=this._sasl_mechanism.onChallenge(this,c),f=e("response",{xmlns:i.NS.SASL});return""!==d&&f.t(b.encode(d)),this.send(f.tree()),!0},_auth1_cb:function(a){var b=g({type:"set",id:"_auth_2"}).c("query",{xmlns:i.NS.AUTH}).c("username",{}).t(i.getNodeFromJid(this.jid)).up().c("password").t(this.pass);return i.getResourceFromJid(this.jid)||(this.jid=i.getBareJidFromJid(this.jid)+"/strophe"),b.up().c("resource",{}).t(i.getResourceFromJid(this.jid)),this._addSysHandler(this._auth2_cb.bind(this),null,null,null,"_auth_2"),this.send(b.tree()),!1},_sasl_success_cb:function(a){if(this._sasl_data["server-signature"]){var c,d=b.decode(i.getText(a)),e=/([a-z]+)=([^,]+)(,|$)/,f=d.match(e);if("v"==f[1]&&(c=f[2]),c!=this._sasl_data["server-signature"])return this.deleteHandler(this._sasl_failure_handler),this._sasl_failure_handler=null,this._sasl_challenge_handler&&(this.deleteHandler(this._sasl_challenge_handler),this._sasl_challenge_handler=null),this._sasl_data={},this._sasl_failure_cb(null)}i.info("SASL authentication succeeded."),this._sasl_mechanism&&this._sasl_mechanism.onSuccess(),this.deleteHandler(this._sasl_failure_handler),this._sasl_failure_handler=null,this._sasl_challenge_handler&&(this.deleteHandler(this._sasl_challenge_handler),this._sasl_challenge_handler=null);var g=[],h=function(a,b){for(;a.length;)this.deleteHandler(a.pop());return this._sasl_auth1_cb.bind(this)(b),!1};return g.push(this._addSysHandler(function(a){h.bind(this)(g,a)}.bind(this),null,"stream:features",null,null)),g.push(this._addSysHandler(function(a){h.bind(this)(g,a)}.bind(this),i.NS.STREAM,"features",null,null)),this._sendRestart(),!1},_sasl_auth1_cb:function(a){this.features=a;var b,c;for(b=0;b<a.childNodes.length;b++)c=a.childNodes[b],"bind"==c.nodeName&&(this.do_bind=!0),"session"==c.nodeName&&(this.do_session=!0);if(!this.do_bind)return this._changeConnectStatus(i.Status.AUTHFAIL,null),!1;this._addSysHandler(this._sasl_bind_cb.bind(this),null,null,null,"_bind_auth_2");var d=i.getResourceFromJid(this.jid);return this.send(d?g({type:"set",id:"_bind_auth_2"}).c("bind",{xmlns:i.NS.BIND}).c("resource",{}).t(d).tree():g({type:"set",id:"_bind_auth_2"}).c("bind",{xmlns:i.NS.BIND}).tree()),!1},_sasl_bind_cb:function(a){if("error"==a.getAttribute("type")){i.info("SASL binding failed.");var b,c=a.getElementsByTagName("conflict");return c.length>0&&(b="conflict"),this._changeConnectStatus(i.Status.AUTHFAIL,b),!1}var d,e=a.getElementsByTagName("bind");return e.length>0?(d=e[0].getElementsByTagName("jid"),void(d.length>0&&(this.jid=i.getText(d[0]),this.do_session?(this._addSysHandler(this._sasl_session_cb.bind(this),null,null,null,"_session_auth_2"),this.send(g({type:"set",id:"_session_auth_2"}).c("session",{xmlns:i.NS.SESSION}).tree())):(this.authenticated=!0,this._changeConnectStatus(i.Status.CONNECTED,null))))):(i.info("SASL binding failed."),this._changeConnectStatus(i.Status.AUTHFAIL,null),!1)},_sasl_session_cb:function(a){if("result"==a.getAttribute("type"))this.authenticated=!0,this._changeConnectStatus(i.Status.CONNECTED,null);else if("error"==a.getAttribute("type"))return i.info("Session creation failed."),this._changeConnectStatus(i.Status.AUTHFAIL,null),!1;return!1},_sasl_failure_cb:function(a){return this._sasl_success_handler&&(this.deleteHandler(this._sasl_success_handler),this._sasl_success_handler=null),this._sasl_challenge_handler&&(this.deleteHandler(this._sasl_challenge_handler),this._sasl_challenge_handler=null),this._sasl_mechanism&&this._sasl_mechanism.onFailure(),this._changeConnectStatus(i.Status.AUTHFAIL,null),!1},_auth2_cb:function(a){return"result"==a.getAttribute("type")?(this.authenticated=!0,
this._changeConnectStatus(i.Status.CONNECTED,null)):"error"==a.getAttribute("type")&&(this._changeConnectStatus(i.Status.AUTHFAIL,null),this.disconnect("authentication failed")),!1},_addSysTimedHandler:function(a,b){var c=new i.TimedHandler(a,b);return c.user=!1,this.addTimeds.push(c),c},_addSysHandler:function(a,b,c,d,e){var f=new i.Handler(a,b,c,d,e);return f.user=!1,this.addHandlers.push(f),f},_onDisconnectTimeout:function(){return i.info("_onDisconnectTimeout was called"),this._proto._onDisconnectTimeout(),this._doDisconnect(),!1},_onIdle:function(){for(var a,b,c,d;this.addTimeds.length>0;)this.timedHandlers.push(this.addTimeds.pop());for(;this.removeTimeds.length>0;)b=this.removeTimeds.pop(),a=this.timedHandlers.indexOf(b),a>=0&&this.timedHandlers.splice(a,1);var e=(new Date).getTime();for(d=[],a=0;a<this.timedHandlers.length;a++)b=this.timedHandlers[a],(this.authenticated||!b.user)&&(c=b.lastCalled+b.period,0>=c-e?b.run()&&d.push(b):d.push(b));this.timedHandlers=d,clearTimeout(this._idleTimeout),this._proto._onIdle(),this.connected&&(this._idleTimeout=setTimeout(this._onIdle.bind(this),100))}},i.SASLMechanism=function(a,b,c){this.name=a,this.isClientFirst=b,this.priority=c},i.SASLMechanism.prototype={test:function(a){return!0},onStart:function(a){this._connection=a},onChallenge:function(a,b){throw new Error("You should implement challenge handling!")},onFailure:function(){this._connection=null},onSuccess:function(){this._connection=null}},i.SASLAnonymous=function(){},i.SASLAnonymous.prototype=new i.SASLMechanism("ANONYMOUS",!1,10),i.SASLAnonymous.test=function(a){return null===a.authcid},i.Connection.prototype.mechanisms[i.SASLAnonymous.prototype.name]=i.SASLAnonymous,i.SASLPlain=function(){},i.SASLPlain.prototype=new i.SASLMechanism("PLAIN",!0,20),i.SASLPlain.test=function(a){return null!==a.authcid},i.SASLPlain.prototype.onChallenge=function(a){var b=a.authzid;return b+="\x00",b+=a.authcid,b+="\x00",b+=a.pass,d.utf16to8(b)},i.Connection.prototype.mechanisms[i.SASLPlain.prototype.name]=i.SASLPlain,i.SASLSHA1=function(){},i.SASLSHA1.prototype=new i.SASLMechanism("SCRAM-SHA-1",!0,40),i.SASLSHA1.test=function(a){return null!==a.authcid},i.SASLSHA1.prototype.onChallenge=function(e,f,g){var h=g||c.hexdigest(1234567890*Math.random()),i="n="+d.utf16to8(e.authcid);return i+=",r=",i+=h,e._sasl_data.cnonce=h,e._sasl_data["client-first-message-bare"]=i,i="n,,"+i,this.onChallenge=function(c,e){for(var f,g,h,i,j,k,l,m,n,o,p,q,r="c=biws,",s=c._sasl_data["client-first-message-bare"]+","+e+",",t=c._sasl_data.cnonce,u=/([a-z]+)=([^,]+)(,|$)/;e.match(u);){var v=e.match(u);switch(e=e.replace(v[0],""),v[1]){case"r":f=v[2];break;case"s":g=v[2];break;case"i":h=v[2]}}if(f.substr(0,t.length)!==t)return c._sasl_data={},c._sasl_failure_cb();for(r+="r="+f,s+=r,g=b.decode(g),g+="\x00\x00\x00",n=d.utf16to8(c.pass),i=k=a.core_hmac_sha1(n,g),l=1;h>l;l++){for(j=a.core_hmac_sha1(n,a.binb2str(k)),m=0;5>m;m++)i[m]^=j[m];k=j}for(i=a.binb2str(i),o=a.core_hmac_sha1(i,"Client Key"),p=a.str_hmac_sha1(i,"Server Key"),q=a.core_hmac_sha1(a.str_sha1(a.binb2str(o)),s),c._sasl_data["server-signature"]=a.b64_hmac_sha1(p,s),m=0;5>m;m++)o[m]^=q[m];return r+=",p="+b.encode(a.binb2str(o))}.bind(this),i},i.Connection.prototype.mechanisms[i.SASLSHA1.prototype.name]=i.SASLSHA1,i.SASLMD5=function(){},i.SASLMD5.prototype=new i.SASLMechanism("DIGEST-MD5",!1,30),i.SASLMD5.test=function(a){return null!==a.authcid},i.SASLMD5.prototype._quote=function(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'},i.SASLMD5.prototype.onChallenge=function(a,b,e){for(var f,g=/([a-z]+)=("[^"]+"|[^,"]+)(?:,|$)/,h=e||c.hexdigest(""+1234567890*Math.random()),i="",j=null,k="",l="";b.match(g);)switch(f=b.match(g),b=b.replace(f[0],""),f[2]=f[2].replace(/^"(.+)"$/,"$1"),f[1]){case"realm":i=f[2];break;case"nonce":k=f[2];break;case"qop":l=f[2];break;case"host":j=f[2]}var m=a.servtype+"/"+a.domain;null!==j&&(m=m+"/"+j);var n=d.utf16to8(a.authcid+":"+i+":"+this._connection.pass),o=c.hash(n)+":"+k+":"+h,p="AUTHENTICATE:"+m,q="";return q+="charset=utf-8,",q+="username="+this._quote(d.utf16to8(a.authcid))+",",q+="realm="+this._quote(i)+",",q+="nonce="+this._quote(k)+",",q+="nc=00000001,",q+="cnonce="+this._quote(h)+",",q+="digest-uri="+this._quote(m)+",",q+="response="+c.hexdigest(c.hexdigest(o)+":"+k+":00000001:"+h+":auth:"+c.hexdigest(p))+",",q+="qop=auth",this.onChallenge=function(){return""}.bind(this),q},i.Connection.prototype.mechanisms[i.SASLMD5.prototype.name]=i.SASLMD5,{Strophe:i,$build:e,$msg:f,$iq:g,$pres:h,SHA1:a,Base64:b,MD5:c}}),function(a,b){return"function"==typeof define&&define.amd?void define("strophe-bosh",["strophe-core"],function(a){return b(a.Strophe,a.$build)}):b(Strophe,$build)}(this,function(a,b){return a.Request=function(b,c,d,e){this.id=++a._requestId,this.xmlData=b,this.data=a.serialize(b),this.origFunc=c,this.func=c,this.rid=d,this.date=0/0,this.sends=e||0,this.abort=!1,this.dead=null,this.age=function(){if(!this.date)return 0;var a=new Date;return(a-this.date)/1e3},this.timeDead=function(){if(!this.dead)return 0;var a=new Date;return(a-this.dead)/1e3},this.xhr=this._newXHR()},a.Request.prototype={getResponse:function(){var b=null;if(this.xhr.responseXML&&this.xhr.responseXML.documentElement){if(b=this.xhr.responseXML.documentElement,"parsererror"==b.tagName)throw a.error("invalid response received"),a.error("responseText: "+this.xhr.responseText),a.error("responseXML: "+a.serialize(this.xhr.responseXML)),"parsererror"}else if(this.xhr.responseText)throw a.error("invalid response received"),a.error("responseText: "+this.xhr.responseText),"badformat";return b},_newXHR:function(){var a=null;return window.XMLHttpRequest?(a=new XMLHttpRequest,a.overrideMimeType&&a.overrideMimeType("text/xml; charset=utf-8")):window.ActiveXObject&&(a=new ActiveXObject("Microsoft.XMLHTTP")),a.onreadystatechange=this.func.bind(null,this),a}},a.Bosh=function(a){this._conn=a,this.rid=Math.floor(4294967295*Math.random()),this.sid=null,this.hold=1,this.wait=60,this.window=5,this.errors=0,this._requests=[]},a.Bosh.prototype={strip:null,_buildBody:function(){var c=b("body",{rid:this.rid++,xmlns:a.NS.HTTPBIND});return null!==this.sid&&c.attrs({sid:this.sid}),this._conn.options.keepalive&&this._cacheSession(),c},_reset:function(){this.rid=Math.floor(4294967295*Math.random()),this.sid=null,this.errors=0,window.sessionStorage.removeItem("strophe-bosh-session"),this._conn.nextValidRid(this.rid)},_connect:function(b,c,d){this.wait=b||this.wait,this.hold=c||this.hold,this.errors=0;var e=this._buildBody().attrs({to:this._conn.domain,"xml:lang":"en",wait:this.wait,hold:this.hold,content:"text/xml; charset=utf-8",ver:"1.6","xmpp:version":"1.0","xmlns:xmpp":a.NS.BOSH});d&&e.attrs({route:d});var f=this._conn._connect_cb;this._requests.push(new a.Request(e.tree(),this._onRequestStateChange.bind(this,f.bind(this._conn)),e.tree().getAttribute("rid"))),this._throttledRequestHandler()},_attach:function(b,c,d,e,f,g,h){this._conn.jid=b,this.sid=c,this.rid=d,this._conn.connect_callback=e,this._conn.domain=a.getDomainFromJid(this._conn.jid),this._conn.authenticated=!0,this._conn.connected=!0,this.wait=f||this.wait,this.hold=g||this.hold,this.window=h||this.window,this._conn._changeConnectStatus(a.Status.ATTACHED,null)},_restore:function(b,c,d,e,f){var g=JSON.parse(window.sessionStorage.getItem("strophe-bosh-session"));if(!("undefined"!=typeof g&&null!==g&&g.rid&&g.sid&&g.jid)||"undefined"!=typeof b&&"null"!==b&&a.getBareJidFromJid(g.jid)!=a.getBareJidFromJid(b))throw{name:"StropheSessionError",message:"_restore: no restoreable session."};this._conn.restored=!0,this._attach(g.jid,g.sid,g.rid,c,d,e,f)},_cacheSession:function(){this._conn.authenticated?this._conn.jid&&this.rid&&this.sid&&window.sessionStorage.setItem("strophe-bosh-session",JSON.stringify({jid:this._conn.jid,rid:this.rid,sid:this.sid})):window.sessionStorage.removeItem("strophe-bosh-session")},_connect_cb:function(b){var c,d,e=b.getAttribute("type");if(null!==e&&"terminate"==e)return c=b.getAttribute("condition"),a.error("BOSH-Connection failed: "+c),d=b.getElementsByTagName("conflict"),null!==c?("remote-stream-error"==c&&d.length>0&&(c="conflict"),this._conn._changeConnectStatus(a.Status.CONNFAIL,c)):this._conn._changeConnectStatus(a.Status.CONNFAIL,"unknown"),this._conn._doDisconnect(c),a.Status.CONNFAIL;this.sid||(this.sid=b.getAttribute("sid"));var f=b.getAttribute("requests");f&&(this.window=parseInt(f,10));var g=b.getAttribute("hold");g&&(this.hold=parseInt(g,10));var h=b.getAttribute("wait");h&&(this.wait=parseInt(h,10))},_disconnect:function(a){this._sendTerminate(a)},_doDisconnect:function(){this.sid=null,this.rid=Math.floor(4294967295*Math.random()),window.sessionStorage.removeItem("strophe-bosh-session"),this._conn.nextValidRid(this.rid)},_emptyQueue:function(){return 0===this._requests.length},_hitError:function(b){this.errors++,a.warn("request errored, status: "+b+", number of errors: "+this.errors),this.errors>4&&this._conn._onDisconnectTimeout()},_no_auth_received:function(b){b=b?b.bind(this._conn):this._conn._connect_cb.bind(this._conn);var c=this._buildBody();this._requests.push(new a.Request(c.tree(),this._onRequestStateChange.bind(this,b.bind(this._conn)),c.tree().getAttribute("rid"))),this._throttledRequestHandler()},_onDisconnectTimeout:function(){this._abortAllRequests()},_abortAllRequests:function(){for(var a;this._requests.length>0;)a=this._requests.pop(),a.abort=!0,a.xhr.abort(),a.xhr.onreadystatechange=function(){}},_onIdle:function(){var b=this._conn._data;if(this._conn.authenticated&&0===this._requests.length&&0===b.length&&!this._conn.disconnecting&&(a.info("no requests during idle cycle, sending blank request"),b.push(null)),!this._conn.paused){if(this._requests.length<2&&b.length>0){for(var c=this._buildBody(),d=0;d<b.length;d++)null!==b[d]&&("restart"===b[d]?c.attrs({to:this._conn.domain,"xml:lang":"en","xmpp:restart":"true","xmlns:xmpp":a.NS.BOSH}):c.cnode(b[d]).up());delete this._conn._data,this._conn._data=[],this._requests.push(new a.Request(c.tree(),this._onRequestStateChange.bind(this,this._conn._dataRecv.bind(this._conn)),c.tree().getAttribute("rid"))),this._throttledRequestHandler()}if(this._requests.length>0){var e=this._requests[0].age();null!==this._requests[0].dead&&this._requests[0].timeDead()>Math.floor(a.SECONDARY_TIMEOUT*this.wait)&&this._throttledRequestHandler(),e>Math.floor(a.TIMEOUT*this.wait)&&(a.warn("Request "+this._requests[0].id+" timed out, over "+Math.floor(a.TIMEOUT*this.wait)+" seconds since last activity"),this._throttledRequestHandler())}}},_onRequestStateChange:function(b,c){if(a.debug("request id "+c.id+"."+c.sends+" state changed to "+c.xhr.readyState),c.abort)return void(c.abort=!1);var d;if(4==c.xhr.readyState){d=0;try{d=c.xhr.status}catch(e){}if("undefined"==typeof d&&(d=0),this.disconnecting&&d>=400)return void this._hitError(d);var f=this._requests[0]==c,g=this._requests[1]==c;(d>0&&500>d||c.sends>5)&&(this._removeRequest(c),a.debug("request id "+c.id+" should now be removed")),200==d?((g||f&&this._requests.length>0&&this._requests[0].age()>Math.floor(a.SECONDARY_TIMEOUT*this.wait))&&this._restartRequest(0),this._conn.nextValidRid(Number(c.rid)+1),a.debug("request id "+c.id+"."+c.sends+" got 200"),b(c),this.errors=0):(a.error("request id "+c.id+"."+c.sends+" error "+d+" happened"),(0===d||d>=400&&600>d||d>=12e3)&&(this._hitError(d),d>=400&&500>d&&(this._conn._changeConnectStatus(a.Status.DISCONNECTING,null),this._conn._doDisconnect()))),d>0&&500>d||c.sends>5||this._throttledRequestHandler()}},_processRequest:function(b){var c=this,d=this._requests[b],e=-1;try{4==d.xhr.readyState&&(e=d.xhr.status)}catch(f){a.error("caught an error in _requests["+b+"], reqStatus: "+e)}if("undefined"==typeof e&&(e=-1),d.sends>this._conn.maxRetries)return void this._conn._onDisconnectTimeout();var g=d.age(),h=!isNaN(g)&&g>Math.floor(a.TIMEOUT*this.wait),i=null!==d.dead&&d.timeDead()>Math.floor(a.SECONDARY_TIMEOUT*this.wait),j=4==d.xhr.readyState&&(1>e||e>=500);if((h||i||j)&&(i&&a.error("Request "+this._requests[b].id+" timed out (secondary), restarting"),d.abort=!0,d.xhr.abort(),d.xhr.onreadystatechange=function(){},this._requests[b]=new a.Request(d.xmlData,d.origFunc,d.rid,d.sends),d=this._requests[b]),0===d.xhr.readyState){a.debug("request id "+d.id+"."+d.sends+" posting");try{d.xhr.open("POST",this._conn.service,this._conn.options.sync?!1:!0),d.xhr.setRequestHeader("Content-Type","text/xml; charset=utf-8"),this._conn.options.withCredentials&&(d.xhr.withCredentials=!0)}catch(k){return a.error("XHR open failed."),this._conn.connected||this._conn._changeConnectStatus(a.Status.CONNFAIL,"bad-service"),void this._conn.disconnect()}var l=function(){if(d.date=new Date,c._conn.options.customHeaders){var a=c._conn.options.customHeaders;for(var b in a)a.hasOwnProperty(b)&&d.xhr.setRequestHeader(b,a[b])}d.xhr.send(d.data)};if(d.sends>1){var m=1e3*Math.min(Math.floor(a.TIMEOUT*this.wait),Math.pow(d.sends,3));setTimeout(l,m)}else l();d.sends++,this._conn.xmlOutput!==a.Connection.prototype.xmlOutput&&this._conn.xmlOutput(d.xmlData.nodeName===this.strip&&d.xmlData.childNodes.length?d.xmlData.childNodes[0]:d.xmlData),this._conn.rawOutput!==a.Connection.prototype.rawOutput&&this._conn.rawOutput(d.data)}else a.debug("_processRequest: "+(0===b?"first":"second")+" request has readyState of "+d.xhr.readyState)},_removeRequest:function(b){a.debug("removing request");var c;for(c=this._requests.length-1;c>=0;c--)b==this._requests[c]&&this._requests.splice(c,1);b.xhr.onreadystatechange=function(){},this._throttledRequestHandler()},_restartRequest:function(a){var b=this._requests[a];null===b.dead&&(b.dead=new Date),this._processRequest(a)},_reqToData:function(a){try{return a.getResponse()}catch(b){if("parsererror"!=b)throw b;this._conn.disconnect("strophe-parsererror")}},_sendTerminate:function(b){a.info("_sendTerminate was called");var c=this._buildBody().attrs({type:"terminate"});b&&c.cnode(b.tree());var d=new a.Request(c.tree(),this._onRequestStateChange.bind(this,this._conn._dataRecv.bind(this._conn)),c.tree().getAttribute("rid"));this._requests.push(d),this._throttledRequestHandler()},_send:function(){clearTimeout(this._conn._idleTimeout),this._throttledRequestHandler(),this._conn._idleTimeout=setTimeout(this._conn._onIdle.bind(this._conn),100)},_sendRestart:function(){this._throttledRequestHandler(),clearTimeout(this._conn._idleTimeout)},_throttledRequestHandler:function(){a.debug(this._requests?"_throttledRequestHandler called with "+this._requests.length+" requests":"_throttledRequestHandler called with undefined requests"),this._requests&&0!==this._requests.length&&(this._requests.length>0&&this._processRequest(0),this._requests.length>1&&Math.abs(this._requests[0].rid-this._requests[1].rid)<this.window&&this._processRequest(1))}},a}),function(a,b){return"function"==typeof define&&define.amd?void define("strophe-websocket",["strophe-core"],function(a){return b(a.Strophe,a.$build)}):b(Strophe,$build)}(this,function(a,b){return a.Websocket=function(a){this._conn=a,this.strip="wrapper";var b=a.service;if(0!==b.indexOf("ws:")&&0!==b.indexOf("wss:")){var c="";c+="ws"===a.options.protocol&&"https:"!==window.location.protocol?"ws":"wss",c+="://"+window.location.host,c+=0!==b.indexOf("/")?window.location.pathname+b:b,a.service=c}},a.Websocket.prototype={_buildStream:function(){return b("open",{xmlns:a.NS.FRAMING,to:this._conn.domain,version:"1.0"})},_check_streamerror:function(b,c){var d;if(d=b.getElementsByTagNameNS?b.getElementsByTagNameNS(a.NS.STREAM,"error"):b.getElementsByTagName("stream:error"),0===d.length)return!1;for(var e=d[0],f="",g="",h="urn:ietf:params:xml:ns:xmpp-streams",i=0;i<e.childNodes.length;i++){var j=e.childNodes[i];if(j.getAttribute("xmlns")!==h)break;"text"===j.nodeName?g=j.textContent:f=j.nodeName}var k="WebSocket stream error: ";return k+=f?f:"unknown",g&&(k+=" - "+f),a.error(k),this._conn._changeConnectStatus(c,f),this._conn._doDisconnect(),!0},_reset:function(){},_connect:function(){this._closeSocket(),this.socket=new WebSocket(this._conn.service,"xmpp"),this.socket.onopen=this._onOpen.bind(this),this.socket.onerror=this._onError.bind(this),this.socket.onclose=this._onClose.bind(this),this.socket.onmessage=this._connect_cb_wrapper.bind(this)},_connect_cb:function(b){var c=this._check_streamerror(b,a.Status.CONNFAIL);return c?a.Status.CONNFAIL:void 0},_handleStreamStart:function(b){var c=!1,d=b.getAttribute("xmlns");"string"!=typeof d?c="Missing xmlns in <open />":d!==a.NS.FRAMING&&(c="Wrong xmlns in <open />: "+d);var e=b.getAttribute("version");return"string"!=typeof e?c="Missing version in <open />":"1.0"!==e&&(c="Wrong version in <open />: "+e),c?(this._conn._changeConnectStatus(a.Status.CONNFAIL,c),this._conn._doDisconnect(),!1):!0},_connect_cb_wrapper:function(b){if(0===b.data.indexOf("<open ")||0===b.data.indexOf("<?xml")){var c=b.data.replace(/^(<\?.*?\?>\s*)*/,"");if(""===c)return;var d=(new DOMParser).parseFromString(c,"text/xml").documentElement;this._conn.xmlInput(d),this._conn.rawInput(b.data),this._handleStreamStart(d)&&this._connect_cb(d)}else if(0===b.data.indexOf("<close ")){this._conn.rawInput(b.data),this._conn.xmlInput(b);var e=b.getAttribute("see-other-uri");e?(this._conn._changeConnectStatus(a.Status.REDIRECT,"Received see-other-uri, resetting connection"),this._conn.reset(),this._conn.service=e,this._connect()):(this._conn._changeConnectStatus(a.Status.CONNFAIL,"Received closing stream"),this._conn._doDisconnect())}else{var f=this._streamWrap(b.data),g=(new DOMParser).parseFromString(f,"text/xml").documentElement;this.socket.onmessage=this._onMessage.bind(this),this._conn._connect_cb(g,null,b.data)}},_disconnect:function(c){if(this.socket&&this.socket.readyState!==WebSocket.CLOSED){c&&this._conn.send(c);var d=b("close",{xmlns:a.NS.FRAMING});this._conn.xmlOutput(d);var e=a.serialize(d);this._conn.rawOutput(e);try{this.socket.send(e)}catch(f){a.info("Couldn't send <close /> tag.")}}this._conn._doDisconnect()},_doDisconnect:function(){a.info("WebSockets _doDisconnect was called"),this._closeSocket()},_streamWrap:function(a){return"<wrapper>"+a+"</wrapper>"},_closeSocket:function(){if(this.socket)try{this.socket.close()}catch(a){}this.socket=null},_emptyQueue:function(){return!0},_onClose:function(){this._conn.connected&&!this._conn.disconnecting?(a.error("Websocket closed unexcectedly"),this._conn._doDisconnect()):a.info("Websocket closed")},_no_auth_received:function(b){a.error("Server did not send any auth methods"),this._conn._changeConnectStatus(a.Status.CONNFAIL,"Server did not send any auth methods"),b&&(b=b.bind(this._conn))(),this._conn._doDisconnect()},_onDisconnectTimeout:function(){},_abortAllRequests:function(){},_onError:function(b){a.error("Websocket error "+b),this._conn._changeConnectStatus(a.Status.CONNFAIL,"The WebSocket connection could not be established or was disconnected."),this._disconnect()},_onIdle:function(){var b=this._conn._data;if(b.length>0&&!this._conn.paused){for(var c=0;c<b.length;c++)if(null!==b[c]){var d,e;d="restart"===b[c]?this._buildStream().tree():b[c],e=a.serialize(d),this._conn.xmlOutput(d),this._conn.rawOutput(e),this.socket.send(e)}this._conn._data=[]}},_onMessage:function(b){var c,d,e='<close xmlns="urn:ietf:params:xml:ns:xmpp-framing" />';if(b.data===e)return this._conn.rawInput(e),this._conn.xmlInput(b),void(this._conn.disconnecting||this._conn._doDisconnect());if(0===b.data.search("<open ")){if(c=(new DOMParser).parseFromString(b.data,"text/xml").documentElement,!this._handleStreamStart(c))return}else d=this._streamWrap(b.data),c=(new DOMParser).parseFromString(d,"text/xml").documentElement;return this._check_streamerror(c,a.Status.ERROR)?void 0:this._conn.disconnecting&&"presence"===c.firstChild.nodeName&&"unavailable"===c.firstChild.getAttribute("type")?(this._conn.xmlInput(c),void this._conn.rawInput(a.serialize(c))):void this._conn._dataRecv(c,b.data)},_onOpen:function(){a.info("Websocket open");var b=this._buildStream();this._conn.xmlOutput(b.tree());var c=a.serialize(b);this._conn.rawOutput(c),this.socket.send(c)},_reqToData:function(a){return a},_send:function(){this._conn.flush()},_sendRestart:function(){clearTimeout(this._conn._idleTimeout),this._conn._onIdle.bind(this._conn)()}},a}),function(a){"function"==typeof define&&define.amd&&define("strophe",["strophe-core","strophe-bosh","strophe-websocket"],function(a){return a})}(this),a){if("function"!=typeof define||!define.amd)return a(Strophe,$build,$msg,$iq,$pres);var b=a;require(["strophe"],function(a){b(a.Strophe,a.$build,a.$msg,a.$iq,a.$pres)})}}(function(a,b,c,d,e){window.Strophe=a,window.$build=b,window.$msg=c,window.$iq=d,window.$pres=e});

Max.saslBFAuth = function() {};

Max.saslBFAuth.prototype = new Strophe.SASLMechanism('X-MMX_BF_OAUTH2', true, 80);

Max.saslBFAuth.test = function(connection) {
  return connection.authcid !== null;
};

Max.saslBFAuth.prototype.onChallenge = function(connection) {
   var auth_str = '\u0000';
    auth_str = auth_str + Strophe.getNodeFromJid(connection.jid);
    auth_str = auth_str + '\u0000';
    auth_str = auth_str + connection.pass;

  return Max.Utils.utf16to8(auth_str);
};

Strophe.Connection.prototype.mechanisms[Max.saslBFAuth.prototype.name] = Max.saslBFAuth;

/*!
 Copyright 2011-2013 Abdulla Abdurakhmanov
 Original sources are available at https://code.google.com/p/x2js/

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function (root, factory) {
     if (typeof define === "function" && define.amd) {
         define([], factory);
     } else if (typeof exports === "object") {
         module.exports = factory();
     } else {
         root.X2JS = factory();
     }
 }(this, function () {
	return function (config) {
		'use strict';
			
		var VERSION = "1.2.0";
		
		config = config || {};
		initConfigDefaults();
		initRequiredPolyfills();
		
		function initConfigDefaults() {
			if(config.escapeMode === undefined) {
				config.escapeMode = true;
			}
			
			config.attributePrefix = config.attributePrefix || "_";
			config.arrayAccessForm = config.arrayAccessForm || "none";
			config.emptyNodeForm = config.emptyNodeForm || "text";		
			
			if(config.enableToStringFunc === undefined) {
				config.enableToStringFunc = true; 
			}
			config.arrayAccessFormPaths = config.arrayAccessFormPaths || []; 
			if(config.skipEmptyTextNodesForObj === undefined) {
				config.skipEmptyTextNodesForObj = true;
			}
			if(config.stripWhitespaces === undefined) {
				config.stripWhitespaces = true;
			}
			config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
	
			if(config.useDoubleQuotes === undefined) {
				config.useDoubleQuotes = false;
			}
			
			config.xmlElementsFilter = config.xmlElementsFilter || [];
			config.jsonPropertiesFilter = config.jsonPropertiesFilter || [];
			
			if(config.keepCData === undefined) {
				config.keepCData = false;
			}
		}
	
		var DOMNodeTypes = {
			ELEMENT_NODE 	   : 1,
			TEXT_NODE    	   : 3,
			CDATA_SECTION_NODE : 4,
			COMMENT_NODE	   : 8,
			DOCUMENT_NODE 	   : 9
		};
		
		function initRequiredPolyfills() {		
		}
		
		function getNodeLocalName( node ) {
			var nodeLocalName = node.localName;			
			if(nodeLocalName == null) // Yeah, this is IE!! 
				nodeLocalName = node.baseName;
			if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
				nodeLocalName = node.nodeName;
			return nodeLocalName;
		}
		
		function getNodePrefix(node) {
			return node.prefix;
		}
			
		function escapeXmlChars(str) {
			if(typeof(str) == "string")
				return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
			else
				return str;
		}
	
		function unescapeXmlChars(str) {
			return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
		}
		
		function checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
			var idx = 0;
			for(; idx < stdFiltersArrayForm.length; idx++) {
				var filterPath = stdFiltersArrayForm[idx];
				if( typeof filterPath === "string" ) {
					if(filterPath == path)
						break;
				}
				else
				if( filterPath instanceof RegExp) {
					if(filterPath.test(path))
						break;
				}				
				else
				if( typeof filterPath === "function") {
					if(filterPath(obj, name, path))
						break;
				}
			}
			return idx!=stdFiltersArrayForm.length;
		}
		
		function toArrayAccessForm(obj, childName, path) {
			switch(config.arrayAccessForm) {
				case "property":
					if(!(obj[childName] instanceof Array))
						obj[childName+"_asArray"] = [obj[childName]];
					else
						obj[childName+"_asArray"] = obj[childName];
					break;
				/*case "none":
					break;*/
			}
			
			if(!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
				if(checkInStdFiltersArrayForm(config.arrayAccessFormPaths, obj, childName, path)) {
					obj[childName] = [obj[childName]];
				}			
			}
		}
		
		function fromXmlDateTime(prop) {
			// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
			// Improved to support full spec and optional parts
			var bits = prop.split(/[-T:+Z]/g);
			
			var d = new Date(bits[0], bits[1]-1, bits[2]);			
			var secondBits = bits[5].split("\.");
			d.setHours(bits[3], bits[4], secondBits[0]);
			if(secondBits.length>1)
				d.setMilliseconds(secondBits[1]);
	
			// Get supplied time zone offset in minutes
			if(bits[6] && bits[7]) {
				var offsetMinutes = bits[6] * 60 + Number(bits[7]);
				var sign = /\d\d-\d\d:\d\d$/.test(prop)? '-' : '+';
	
				// Apply the sign
				offsetMinutes = 0 + (sign == '-'? -1 * offsetMinutes : offsetMinutes);
	
				// Apply offset and local timezone
				d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset())
			}
			else
				if(prop.indexOf("Z", prop.length - 1) !== -1) {
					d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));					
				}
	
			// d is now a local time equivalent to the supplied time
			return d;
		}
		
		function checkFromXmlDateTimePaths(value, childName, fullPath) {
			if(config.datetimeAccessFormPaths.length > 0) {
				var path = fullPath.split("\.#")[0];
				if(checkInStdFiltersArrayForm(config.datetimeAccessFormPaths, value, childName, path)) {
					return fromXmlDateTime(value);
				}
				else
					return value;			
			}
			else
				return value;
		}
		
		function checkXmlElementsFilter(obj, childType, childName, childPath) {
			if( childType == DOMNodeTypes.ELEMENT_NODE && config.xmlElementsFilter.length > 0) {
				return checkInStdFiltersArrayForm(config.xmlElementsFilter, obj, childName, childPath);	
			}
			else
				return true;
		}	
	
		function parseDOMChildren( node, path ) {
			if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
				var result = new Object;
				var nodeChildren = node.childNodes;
				// Alternative for firstElementChild which is not supported in some environments
				for(var cidx=0; cidx <nodeChildren.length; cidx++) {
					var child = nodeChildren.item(cidx);
					if(child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
						var childName = getNodeLocalName(child);
						result[childName] = parseDOMChildren(child, childName);
					}
				}
				return result;
			}
			else
			if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
				var result = new Object;
				result.__cnt=0;
				
				var nodeChildren = node.childNodes;
				
				// Children nodes
				for(var cidx=0; cidx <nodeChildren.length; cidx++) {
					var child = nodeChildren.item(cidx); // nodeChildren[cidx];
					var childName = getNodeLocalName(child);
					
					if(child.nodeType!= DOMNodeTypes.COMMENT_NODE) {
						var childPath = path+"."+childName;
						if (checkXmlElementsFilter(result,child.nodeType,childName,childPath)) {
							result.__cnt++;
							if(result[childName] == null) {
								result[childName] = parseDOMChildren(child, childPath);
								toArrayAccessForm(result, childName, childPath);					
							}
							else {
								if(result[childName] != null) {
									if( !(result[childName] instanceof Array)) {
										result[childName] = [result[childName]];
										toArrayAccessForm(result, childName, childPath);
									}
								}
								(result[childName])[result[childName].length] = parseDOMChildren(child, childPath);
							}
						}
					}								
				}
				
				// Attributes
				for(var aidx=0; aidx <node.attributes.length; aidx++) {
					var attr = node.attributes.item(aidx); // [aidx];
					result.__cnt++;
					result[config.attributePrefix+attr.name]=attr.value;
				}
				
				// Node namespace prefix
				var nodePrefix = getNodePrefix(node);
				if(nodePrefix!=null && nodePrefix!="") {
					result.__cnt++;
					result.__prefix=nodePrefix;
				}
				
				if(result["#text"]!=null) {				
					result.__text = result["#text"];
					if(result.__text instanceof Array) {
						result.__text = result.__text.join("\n");
					}
					//if(config.escapeMode)
					//	result.__text = unescapeXmlChars(result.__text);
					if(config.stripWhitespaces)
						result.__text = result.__text.trim();
					delete result["#text"];
					if(config.arrayAccessForm=="property")
						delete result["#text_asArray"];
					result.__text = checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
				}
				if(result["#cdata-section"]!=null) {
					result.__cdata = result["#cdata-section"];
					delete result["#cdata-section"];
					if(config.arrayAccessForm=="property")
						delete result["#cdata-section_asArray"];
				}
				
				if( result.__cnt == 0 && config.emptyNodeForm=="text" ) {
					result = '';
				}
				else
				if( result.__cnt == 1 && result.__text!=null  ) {
					result = result.__text;
				}
				else
				if( result.__cnt == 1 && result.__cdata!=null && !config.keepCData  ) {
					result = result.__cdata;
				}			
				else			
				if ( result.__cnt > 1 && result.__text!=null && config.skipEmptyTextNodesForObj) {
					if( (config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
						delete result.__text;
					}
				}
				delete result.__cnt;			
				
				if( config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
					result.toString = function() {
						return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
					};
				}
				
				return result;
			}
			else
			if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
				return node.nodeValue;
			}	
		}
		
		function startTag(jsonObj, element, attrList, closed) {
			var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
			if(attrList!=null) {
				for(var aidx = 0; aidx < attrList.length; aidx++) {
					var attrName = attrList[aidx];
					var attrVal = jsonObj[attrName];
					if(config.escapeMode)
						attrVal=escapeXmlChars(attrVal);
					resultStr+=" "+attrName.substr(config.attributePrefix.length)+"=";
					if(config.useDoubleQuotes)
						resultStr+='"'+attrVal+'"';
					else
						resultStr+="'"+attrVal+"'";
				}
			}
			if(!closed)
				resultStr+=">";
			else
				resultStr+="/>";
			return resultStr;
		}
		
		function endTag(jsonObj,elementName) {
			return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
		}
		
		function endsWith(str, suffix) {
			return str.indexOf(suffix, str.length - suffix.length) !== -1;
		}
		
		function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
			if((config.arrayAccessForm=="property" && endsWith(jsonObjField.toString(),("_asArray"))) 
					|| jsonObjField.toString().indexOf(config.attributePrefix)==0 
					|| jsonObjField.toString().indexOf("__")==0
					|| (jsonObj[jsonObjField] instanceof Function) )
				return true;
			else
				return false;
		}
		
		function jsonXmlElemCount ( jsonObj ) {
			var elementsCnt = 0;
			if(jsonObj instanceof Object ) {
				for( var it in jsonObj  ) {
					if(jsonXmlSpecialElem ( jsonObj, it) )
						continue;			
					elementsCnt++;
				}
			}
			return elementsCnt;
		}
		
		function checkJsonObjPropertiesFilter(jsonObj, propertyName, jsonObjPath) {
			return config.jsonPropertiesFilter.length == 0
				|| jsonObjPath==""
				|| checkInStdFiltersArrayForm(config.jsonPropertiesFilter, jsonObj, propertyName, jsonObjPath);	
		}
		
		function parseJSONAttributes ( jsonObj ) {
			var attrList = [];
			if(jsonObj instanceof Object ) {
				for( var ait in jsonObj  ) {
					if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(config.attributePrefix)==0) {
						attrList.push(ait);
					}
				}
			}
			return attrList;
		}
		
		function parseJSONTextAttrs ( jsonTxtObj ) {
			var result ="";
			
			if(jsonTxtObj.__cdata!=null) {										
				result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
			}
			
			if(jsonTxtObj.__text!=null) {			
				if(config.escapeMode)
					result+=escapeXmlChars(jsonTxtObj.__text);
				else
					result+=jsonTxtObj.__text;
			}
			return result;
		}
		
		function parseJSONTextObject ( jsonTxtObj ) {
			var result ="";
	
			if( jsonTxtObj instanceof Object ) {
				result+=parseJSONTextAttrs ( jsonTxtObj );
			}
			else
				if(jsonTxtObj!=null) {
					if(config.escapeMode)
						result+=escapeXmlChars(jsonTxtObj);
					else
						result+=jsonTxtObj;
				}
			
			return result;
		}
		
		function getJsonPropertyPath(jsonObjPath, jsonPropName) {
			if (jsonObjPath==="") {
				return jsonPropName;
			}
			else
				return jsonObjPath+"."+jsonPropName;
		}
		
		function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList, jsonObjPath ) {
			var result = ""; 
			if(jsonArrRoot.length == 0) {
				result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
			}
			else {
				for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
					result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
					result+=parseJSONObject(jsonArrRoot[arIdx], getJsonPropertyPath(jsonObjPath,jsonArrObj));
					result+=endTag(jsonArrRoot[arIdx],jsonArrObj);
				}
			}
			return result;
		}
		
		function parseJSONObject ( jsonObj, jsonObjPath ) {
			var result = "";	
	
			var elementsCnt = jsonXmlElemCount ( jsonObj );
			
			if(elementsCnt > 0) {
				for( var it in jsonObj ) {
					
					if(jsonXmlSpecialElem ( jsonObj, it) || (jsonObjPath!="" && !checkJsonObjPropertiesFilter(jsonObj, it, getJsonPropertyPath(jsonObjPath,it))) )
						continue;			
					
					var subObj = jsonObj[it];						
					
					var attrList = parseJSONAttributes( subObj )
					
					if(subObj == null || subObj == undefined) {
						result+=startTag(subObj, it, attrList, true);
					}
					else
					if(subObj instanceof Object) {
						
						if(subObj instanceof Array) {					
							result+=parseJSONArray( subObj, it, attrList, jsonObjPath );					
						}
						else if(subObj instanceof Date) {
							result+=startTag(subObj, it, attrList, false);
							result+=subObj.toISOString();
							result+=endTag(subObj,it);
						}
						else {
							var subObjElementsCnt = jsonXmlElemCount ( subObj );
							if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
								result+=startTag(subObj, it, attrList, false);
								result+=parseJSONObject(subObj, getJsonPropertyPath(jsonObjPath,it));
								result+=endTag(subObj,it);
							}
							else {
								result+=startTag(subObj, it, attrList, true);
							}
						}
					}
					else {
						result+=startTag(subObj, it, attrList, false);
						result+=parseJSONTextObject(subObj);
						result+=endTag(subObj,it);
					}
				}
			}
			result+=parseJSONTextObject(jsonObj);
			
			return result;
		}
		
		this.parseXmlString = function(xmlDocStr) {
			var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
			if (xmlDocStr === undefined) {
				return null;
			}
			var xmlDoc;
			if (window.DOMParser) {
				var parser=new window.DOMParser();			
				var parsererrorNS = null;
				// IE9+ now is here
				if(!isIEParser) {
					try {
						parsererrorNS = parser.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0].namespaceURI;
					}
					catch(err) {					
						parsererrorNS = null;
					}
				}
				try {
					xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
					if( parsererrorNS!= null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
						//throw new Error('Error parsing XML: '+xmlDocStr);
						xmlDoc = null;
					}
				}
				catch(err) {
					xmlDoc = null;
				}
			}
			else {
				// IE :(
				if(xmlDocStr.indexOf("<?")==0) {
					xmlDocStr = xmlDocStr.substr( xmlDocStr.indexOf("?>") + 2 );
				}
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(xmlDocStr);
			}
			return xmlDoc;
		};
		
		this.asArray = function(prop) {
			if (prop === undefined || prop == null)
				return [];
			else
			if(prop instanceof Array)
				return prop;
			else
				return [prop];
		};
		
		this.toXmlDateTime = function(dt) {
			if(dt instanceof Date)
				return dt.toISOString();
			else
			if(typeof(dt) === 'number' )
				return new Date(dt).toISOString();
			else	
				return null;
		};
		
		this.asDateTime = function(prop) {
			if(typeof(prop) == "string") {
				return fromXmlDateTime(prop);
			}
			else
				return prop;
		};
	
		this.xml2json = function (xmlDoc) {
			return parseDOMChildren ( xmlDoc );
		};
		
		this.xml_str2json = function (xmlDocStr) {
			var xmlDoc = this.parseXmlString(xmlDocStr);
			if(xmlDoc!=null)
				return this.xml2json(xmlDoc);
			else
				return null;
		};
	
		this.json2xml_str = function (jsonObj) {
			return parseJSONObject ( jsonObj, "" );
		};
	
		this.json2xml = function (jsonObj) {
			var xmlDocStr = this.json2xml_str (jsonObj);
			return this.parseXmlString(xmlDocStr);
		};
		
		this.getVersion = function () {
			return VERSION;
		};	
	}
}))
/**
 * A class containing transport functions for facilitating requests and responses between a client and a Mobile App Server.
 * @memberof Max
 * @namespace Request
 * @private
 */
Max.Request = function(request, callback, failback) {
    request._path = request.url;
    if (!request.isBinary) request.contentType = request.contentType || 'application/json';
    request.headers = request.headers || [];

    var deferred = new Max.Deferred();
    deferred.promise = new Max.Call();

    var options = {
        call : deferred.promise
    };

    if (Max.App.hatCredentials && Max.App.hatCredentials.access_token && !request.headers.Authorization)
        request.headers['Authorization'] = 'Bearer ' + Max.App.hatCredentials.access_token;
    
    Max.Request.callbacks = Max.Request.callbacks || [];
    Max.Request.callbacks.push(callback);

    setTimeout(function() {
        if (!Max.App.initialized && !request.bypassReady)
            return (failback || function() {})('sdk not ready');

        Max.Transport.request(request.data, request, options, function(result, details) {
            delete Max.Request.callbacks;
            Max.Log.fine(details.status+' '+details.info.url+' ', {
                contentType : details.contentType,
                response    : result
            });

            options.call.state = Max.CallState.SUCCESS;
            if ( Max.Utils.isArray(callback) ) {
                callback.forEach(function(cb) {
                    (cb || function() {})(result, details);
                });
            } else {
                (callback || function() {})(result, details);
            }

        }, function(e, details) {
            var cbks = Max.Request.callbacks || [];
            delete Max.Request.callbacks;
            Max.Log.fine(details.status+' '+details.info.url+' ', {
                contentType : details.contentType,
                response    : e
            });

            // TODO: need to rework the .status === 0 once CORS is full implemented by server
            if (details.status === 401 && !request.isLogin) {
                if (Cookie.get('magnet-max-refresh-token')) {
                    if ( Max.init.inprocess ) {
                        return (failback || function() {})('sdk not ready');
                    }
                    return Max.User.loginWithRefreshToken(request, cbks, function() {
                        Max.User.clearSession(Max.Error.SESSION_EXPIRED);
                    });
                }
                else
                    Max.User.clearSession(Max.Error.SESSION_EXPIRED);
            }

            if (details.status === 403 && !request.isLogin)
                Max.invoke('not-authorized', e, details);

            if (details.status === 413)
                e = 'maximum filesize exceeded';

            if (details.status === 0)
                e = 'unable to connect';

            options.call.state = Max.CallState.FAILED;
            (failback || function() {})(e, details);

        });
    }, 0);

    return deferred;
};

/**
 * A class containing transport functions for facilitating requests and responses between a client and a Mobile App Server.
 * @memberof Max
 * @namespace Transport
 * @private
 */
Max.Transport = {
    /**
     * Base request function. Determines the best available transport and calls the request.
     * @param {object} [body] The body of the request.
     * @param {object} metadata Request metadata.
     * @param {object} options Request options.
     * @param {function} [callback] Executes if the request succeeded. The success callback will be fired on a status code in the 200-207 range.
     * @param {function} [failback] Executes if the request failed.
     */
    request : function(body, metadata, options, callback, failback) {
        options = options || {};
        metadata._path = metadata._path || metadata.path;
        metadata._path = (metadata.local === true || /^(ftp|http|https):/.test(metadata._path) === true) ? metadata._path : Max.Config.baseUrl+metadata._path;
        if (typeof jQuery !== 'undefined' && metadata.returnType != 'binary' && !metadata.isBinary) {
            this.requestJQuery(body, metadata, options, callback, failback);
        } else if (XMLHttpRequest !== 'undefined') {
            this.requestXHR(body, metadata, options, callback, failback);
        } else {
            throw('request transport unavailable');
        }
    },
    /**
     * Transport with JQuery over HTTP/SSL protocol with REST. Cross-origin requests from a web browser are currently not supported.
     * @param {object|string|number} [body] The body of the request.
     * @param {object} metadata Request metadata.
     * @param {object} options Request options.
     * @param {function} [callback] Executes if the request succeeded.
     * @param {function} [failback] Executes if the request failed.
     */
    requestJQuery : function(body, metadata, options, callback, failback) {
        var me = this;
        var reqBody = me.parseBody(metadata.contentType, body);
        $.support.cors = true;
        var details = {
            body : reqBody,
            info : {
                url : metadata._path
            }
        };
        options.call.transportHandle = $.ajax({
            type        : metadata.method,
            url         : metadata._path,
            timeout     : 30000,
            dataType    : metadata.dataType,
            contentType : metadata.contentType,
            processData : !metadata.isBinary,
            data        : reqBody,
            beforeSend  : function(xhr) {
                xhr.setRequestHeader('Accept', me.createAcceptHeader(metadata.dataType));
                if (metadata.headers) {
                    for(var key in metadata.headers) {
                        xhr.setRequestHeader(key, metadata.headers[key]);
                    }
                }
            },
            success : function(data, status, xhr) {
                if (typeof callback === typeof Function) {
                    details.info.xhr = Max.Utils.convertHeaderStrToObj(xhr);
                    details.contentType = xhr.getResponseHeader('Content-Type');
                    details.status = xhr.status;
                    callback(data, details);
                }
            },
            error : function(xhr, metadata, error) {
                details.info.xhr = Max.Utils.convertHeaderStrToObj(xhr);
                details.contentType = xhr.getResponseHeader('Content-Type');
                details.status = xhr.status;
                if (metadata == 'parsererror')
                    callback(xhr.responseText, details);
                else if (typeof failback === typeof Function)
                    failback(xhr.responseText, details);
            }
        });
    },
    /**
     * Transport with XMLHttpRequest over HTTP/SSL protocol with REST. Cross-origin requests from a web browser are currently not supported.
     * @param {object|string|number} [body] The body of the request.
     * @param {object} metadata Request metadata.
     * @param {object} options Request options.
     * @param {function} [callback] Executes if the request succeeded.
     * @param {function} [failback] Executes if the request failed.
     */
    requestXHR : function(body, metadata, options, callback, failback) {
        var me = this, resBody;
        var reqBody = me.parseBody(metadata.contentType, body);
        var details = {
            body : reqBody,
            info : {
                url : metadata._path
            }
        };
        options.call.transportHandle = new XMLHttpRequest();
        var xhr = options.call.transportHandle;
        xhr.timeout = 30000;
        if (metadata.returnType == 'binary') xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                details.status = xhr.status;
                details.contentType = xhr.getResponseHeader('Content-Type');
                details.info.xhr = Max.Utils.convertHeaderStrToObj(xhr);
                resBody = xhr.responseText;
                if (typeof xhr.responseXML !== 'undefined' && xhr.responseXML != null) {
                    resBody = xhr.responseXML;
                } else {
                    try{
                        resBody = JSON.parse(resBody);
                        resBody = resBody.result || resBody;
                    }catch(e) {}
                }
                if (me.isSuccess(xhr.status)) {
                    if (metadata.returnType == 'binary')
                        resBody = {
                            mimeType : details.contentType,
                            val      : resBody
                        };
                    if (typeof callback === typeof Function) callback(resBody, details);
                } else {
                    if (typeof failback === typeof Function) failback(resBody, details);
                }
            }
        };
        xhr.ontimeout = function() {
            details.status = 0;
            details.contentType = xhr.getResponseHeader('Content-Type');
            details.info.xhr = Max.Utils.convertHeaderStrToObj(xhr);
            if (typeof failback === typeof Function) failback('request-timeout', details);
        };
        xhr.open(metadata.method, metadata._path, true);
        if (metadata.contentType)
            xhr.setRequestHeader('Content-Type', metadata.contentType);
        xhr.setRequestHeader('Accept', me.createAcceptHeader(metadata.dataType));
        if (metadata.headers)
            for(var key in metadata.headers) {
                xhr.setRequestHeader(key, metadata.headers[key]);
            }
        xhr.send(reqBody);
    },
    /**
     * Determines whether the status code is a success or failure.
     * @param {number} code The HTTP request status code.
     */
    isSuccess : function(code) {
        return code >= 200 && code <= 299;
    },
    /**
     * Formats the body into the appropriate string type using the specified Content-Type header.
     * @param {object|string|number} type The Content-Type of the request.
     * @param {string} input The original request body.
     */
    parseBody : function(type, input) {
        var QS = Max.Utils.isNode ? require('querystring') : Max.Utils.objectToFormdata;
        switch(type) {
            case 'application/x-www-form-urlencoded' : input = QS.stringify(input); break;
            case 'application/json' : input = JSON.stringify(input); break;
            case 'application/json;' : input = JSON.stringify(input); break;
        }
        return input;
    },
    /**
     * Create an Accept header.
     * @param {string} [dataType] The expected data type of the request.
     * @returns {string} The Accept Header string.
     */
    createAcceptHeader : function(dataType) {
        var str = '';
        dataType = dataType || 'json';
        switch(dataType) {
            case 'xml'  : str = 'application/xml;q=1.0'; break;
            case 'html' : str = 'text/plain;q=1.0'; break;
            case 'text' : str = 'text/plain;q=1.0'; break;
            case 'json' : str = 'application/json;'; break;
            default     : str = '*/*;q=1.0'; break;
        }
        return str;
    }
};
Max.Transport.Headers = {};

/**
 * A set of constants used by a Max.Call object to determine the current state of the call.
 * @memberof Max
 * @namespace CallState
 * @private
 */
Max.CallState = {
    /**
     * The call has been initialized but the request has not yet started.
     * @type {string}
     */
    INIT       : 'init',
    /**
     * The call is in progress.
     * @type {string}
     */
    EXECUTING  : 'executing',
    /**
     * The call is in a reliable queue.
     * @type {string}
     */
    QUEUED     : 'queued',
    /**
     * The call has been cancelled.
     * @type {string}
     */
    CANCELLED  : 'cancelled',
    /**
     * The call has completed successfully.
     * @type {string}
     */
    SUCCESS    : 'success',
    /**
     * The call has failed.
     * @type {string}
     */
    FAILED     : 'failed'
};

/**
 * This interface represents an asynchronous invocation to a controller. An instance of the Call is typically returned by a method call from any Controller
 * implementation. If the options are not specified in the Controller subclass method call, a fail-fast asynchronous call will be assumed.
 * @augments Max.Promise
 * @constructor
 * @memberof Max
 * @private
 */
Max.Call = function() {
    /**
     * A system generated unique ID for this call.
     * @type {string}
     */
    this.callId;
    /**
     * A custom opaque token provided by the caller.
     * @type {string}
     */
    this.token;
    /**
     * The last cached time of the result. It is available only if the call has completed.
     * @type {Date}
     */
    this.cachedTime;
    /**
     * Indicates whether the result was retrieved from the cache.
     * @type {boolean}
     */
    this.isResultFromCache;
    /**
     * The result returned by the call. This property is undefined if the call failed.
     * @type {*}
     */
    this.result;
    /**
     * The error, if any, that occurred during execution of the call. An undefined error value indicates that the call completed successfully.
     * @type {*}
     */
    this.resultError;
    /**
     * An object containing details of the request.
     * @type {object}
     */
    this.details;
    this.state = Max.CallState.INIT;
    Max.Promise.apply(this, arguments);
};
Max.Call.prototype = new Max.Promise();
Max.Call.prototype.constructor = Max.Call;

/**
 * @constructor
 * @class
 * The Uploader class is a local representation of an attachment. This class provides methods to build the file and upload it to the server.
 * @param {File|File[]|FileList} fileOrFiles One or more File objects created by an input[type="file"] HTML element.
 * @param {function} callback Fires after the file body is parsed.
 * @private
 */
Max.Uploader = function(fileOrFiles, callback) {
    var self = this;

    if (!(window.FileReader && window.Blob))
        return callback('upload not supported');

    if (!fileOrFiles.length)
        fileOrFiles = [fileOrFiles];

    this.boundary = 'BOUNDARY+'+Max.Utils.getCleanGUID();
    this.message = '';
    this.prefix = 'DATA_';
    this.index = 0;
    this.fileCount = fileOrFiles.length;
    this.attachmentRefs = [];
    this.contentType = 'multipart/form-data; boundary='+this.boundary;

    // TOOD: implement iframe upload. http://caniuse.com/#search=formdata
    if (window.FormData) {
        this.message = new FormData();
        delete this.contentType;

        for (var i = 0; i < fileOrFiles.length; ++i) {
            this.message.append('file', fileOrFiles[i], fileOrFiles[i].name);
            this.attachmentRefs.push({
                mimeType: fileOrFiles[i].type,
                senderId: mCurrentUser.userId,
                name: fileOrFiles[i].name,
                metaKey: fileOrFiles[i].metaKey
            });
        }

        callback(null, this);
    } else {
        this.add(fileOrFiles, 0, function() {
            self.close();
            callback(null, self);
        });
    }
};

/**
 * Add a part to the multipart/form-data body.
 * @param {File|File[]|FileList} fileOrFiles One or more File objects created by an input[type="file"] HTML element.
 * @param {number} index The current file index.
 * @param {function} callback Fires when there are no more files to add.
 */
Max.Uploader.prototype.add = function(fileOrFiles, index, callback) {
    var self = this;
    var reader = new FileReader();

    if (!fileOrFiles[index]) return callback();

    reader.addEventListener('load', function() {
        var id = self.prefix+String(++self.index);
        self.message += '--'+self.boundary+'\r\n';
        self.message += 'Content-Type: '+fileOrFiles[index].type+'\r\n';
        self.message += 'Content-Disposition: form-data; name="file"; filename="'+fileOrFiles[index].name+'"\r\n\r\n';
        self.message += 'Content-Transfer-Encoding: base64\r\n';
        //self.message += 'Content-Id: '+id+'\r\n\r\n';
        self.message += reader.result+'\r\n\r\n';

        self.attachmentRefs.push({
            mimeType: fileOrFiles[index].type,
            senderId: mCurrentUser.userId,
            name: fileOrFiles[index].name
        });

        if (++index == self.fileCount) callback();
        else self.add(fileOrFiles, index, callback);
    }, false);

    //reader.readAsBinaryString(fileOrFiles[i]);
    reader.readAsDataURL(fileOrFiles[index]);
    //reader.readAsArrayBuffer(fileOrFiles[i]);
};

/**
 * Close the multipart/form-data body.
 */
Max.Uploader.prototype.close = function() {
    this.message += '--'+this.boundary+'--';
    //this.message = '--'+this.boundary+'\r\n'+'Content-Type: application/json\r\n\r\n'+JSON.stringify(body)+'\r\n\r\n'+this.message;
    return this.message;
};

/**
 * Upload channel message attachments.
 * @param {Max.Channel} channel The channel the file will be sent to.
 * @param {string} messageId The XMPP message ID, used to associate an uploaded file with a {Max.Message}.
 * @returns {Max.Promise.<object[]>} A promise object returning a list of attachment metadata or request error.
 */
Max.Uploader.prototype.channelUpload = function(channel, messageId) {
    return this.upload({
        metadata_message_id: messageId,
        metadata_channel_name: channel.name,
        metadata_channel_is_public: !channel.privateChannel
    });
};

/**
 * Upload channel message attachments.
 * @param {string} messageId The XMPP message ID, used to associate an uploaded file with a {Max.Message}.
 * @returns {Max.Promise.<object[]>} A promise object returning a list of attachment metadata or request error.
 */
Max.Uploader.prototype.messageUpload = function(messageId) {
    return this.upload({
        metadata_message_id: messageId
    });
};

/**
 * Upload user avatar.
 * @param {string} userId The identifier of the user who the avatar belongs to.
 * @returns {Max.Promise.<object[]>} A promise object returning a list of attachment metadata or request error.
 */
Max.Uploader.prototype.avatarUpload = function(userId) {
    return this.upload({
        metadata_file_id: userId
    });
};

/**
 * Upload object attachments. Currently, only supported with {Max.Approval}.
 * @param {string} objectId The object identifier.
 * @returns {Max.Promise.<object[]>} A promise object returning a list of attachment metadata or request error.
 */
Max.Uploader.prototype.objectUpload = function(objectId) {
    return this.upload({});
};

/**
 * Upload the files to the server.
 * @param {object} headers upload HTTP headers.
 * @returns {Max.Promise.<object[]>} A promise object returning a list of attachment metadata or request error.
 */
Max.Uploader.prototype.upload = function(headers) {
    var self = this;
    var def = Max.Request({
        method: 'POST',
        url: '/com.magnet.server/file/save/multiple',
        data: self.message,
        contentType: self.contentType,
        headers: headers,
        isBinary: true
    }, function(res) {
        for (var i=0;i<self.attachmentRefs.length;++i)
            self.attachmentRefs[i].fileId = res[self.attachmentRefs[i].name];

        def.resolve(self.attachmentRefs);
    }, function() {
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

/**
 * @constructor
 * @class
 * The Attachment class is the local representation of an attachment.
 * @property {string} name Filename of the attachment.
 * @property {string} mimeType MIME-type of the attachment.
 * @property {string} downloadUrl Url to download the attachment. For example, this url can be inserted directly into an <img> tag to display an image.
 * @property {string} fileId A unique identifier of the attachment.
 */
Max.Attachment = function(attachmentRef) {
    Max.Utils.mergeObj(this, attachmentRef);
    this.downloadUrl = Max.Config.baseUrl+'/com.magnet.server/file/download/'+(this.fileId || this.attachmentId)
        +'?access_token='+Max.App.hatCredentials.access_token+'&user_id='+this.senderId;
};

/**
 * Get the full download url of the attachment.
 * @returns {string} The public location of the attachment.
 */
Max.Attachment.prototype.getDownloadUrl = function() {
    return this.downloadUrl;
};

/**
 * @constructor
 * @class
 * The User class is a local representation of a user in the MagnetMax platform. This class provides various user specific methods, like authentication, signing up, and search.
 * @property {string} userId User's user identifier.
 * @property {string} userName User's username.
 * @property {string} [firstName] User's first name.
 * @property {string} [lastName] User's last name.
 * @property {string} [email] User's email.
 * @property {string[]} [tags] User's tags.
 */
Max.User = function(userObj) {
    if (userObj.displayName == 'null null') delete userObj.displayName;

    if (userObj.displayName) {
        var name = userObj.displayName.split(' ');
        if (!userObj.firstName) userObj.firstName = (name[0]) ? name[0] : '';
        if (!userObj.lastName) userObj.lastName = (name[1]) ? name[1] : '';
    }

    if (userObj.userId && userObj.userId.indexOf('%') != -1)
        userObj.userId = userObj.userId.split('%')[0];

    if (userObj.userAccountData) {
        userObj.extras = userObj.userAccountData;
        delete userObj.userAccountData;
    }

    if (userObj.password && userObj.password == 'n/a')
      delete userObj.password;

    if (!userObj.userId && userObj.userIdentifier) userObj.userId = userObj.userIdentifier;
    delete userObj.userIdentifier;
    userObj.userName = userObj.userName || userObj.username || userObj.displayName;
    userObj.extras = userObj.extras || {};

    Max.Utils.mergeObj(this, userObj);
    return this;
};

/**
 * Registers a new user.
 * @param {object} userObj An object containing user information.
 * @param {string} userObj.userName User's username.
 * @param {string} userObj.password User's preferred password.
 * @param {string} [userObj.firstName] User's first name.
 * @param {string} [userObj.lastName] User's last name.
 * @param {string} [userObj.email] User's email.
 * @param {string[]} [userObj.tags] User's tags.
 * @param {object} [userObj.extras] Additional custom metadata to associate with the user.
 * @returns {Max.Promise.<Max.User>} A promise object returning the newly created {Max.User} or reason of failure.
 */
Max.User.register = function(userObj) {
    userObj = Max.Utils.mergeObj({}, userObj);
    userObj.userName = userObj.userName || userObj.username;
    var auth;

    if (Max.App.catCredentials || Max.App.hatCredentials)
        auth = {
            'Authorization': 'Bearer '
            + (Max.App.catCredentials || Max.App.hatCredentials || {}).access_token
        };

    if (userObj.extras) {
        userObj.userAccountData = userObj.extras;
        delete userObj.extras;
    }

    var def = Max.Request({
        method: 'POST',
        url: '/com.magnet.server/user/enrollment/pending',
        data: userObj,
        headers: auth
    }, function(newUserObj, details) {
        def.resolve.apply(def, [new Max.User(newUserObj), details]);
    }, function() {
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

/**
 * Reset password.
 * @param {object} userObj An object containing user information.
 * @param {string} userObj.userName User's username.
 * @param {string} userObj.passwordResetMethod reset method "NOTIFICATION" (get otpCode) or "OTP" (reset password)
 * @param {string} userObj.otpCode User's OTP code from received email
 * @param {string} userObj.newPassword User's new password.
 * @returns {Max.Promise.<Max.User>} A promise object returning the newly created {Max.User} or reason of failure.
 */

Max.User.passwordReset = function(userObj) {
    userObj = Max.Utils.mergeObj({}, userObj);
    userObj.userName = userObj.userName || userObj.username;
    var auth;

    if (Max.App.catCredentials || Max.App.hatCredentials)
        auth = {
            'Authorization': 'Bearer '
            + (Max.App.hatCredentials || Max.App.catCredentials || {}).access_token
        };

    var def = Max.Request({
        method: 'POST',
        url: '/com.magnet.server/user/password/reset',
        data: userObj,
        headers: auth
    }, function() {
        def.resolve.apply(def, arguments);
    }, function() {
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

/**
 * Login as the given user.
 * @param {string} userName User's username.
 * @param {string} password User's preferred password.
 * @param {boolean} [rememberMe] Set to true to stay logged in until an explicit logout using {Max.User.logout}.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 */
Max.User.login = function(userName, password, rememberMe) {
    var def = new Max.Deferred();
    var userObj = {};
    userObj.grant_type = 'password';
    userObj.client_id = Max.App.clientId;
    userObj.username = userName;
    userObj.password = password;
    userObj.remember_me = (rememberMe === true || rememberMe === false) ? rememberMe : false;

    setTimeout(function() {
        if (!userObj.username) return def.reject('invalid username');
        if (!userObj.password) return def.reject('invalid password');

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/user/session',
            data: userObj,
            contentType: 'application/x-www-form-urlencoded',
            headers: {
               'Authorization': 'Basic ' + Max.Utils.stringToBase64(userObj.username+':'+userObj.password),
               'MMS-DEVICE-ID': mCurrentDevice ? mCurrentDevice.deviceId : MMS_DEVICE_ID
            },
            isLogin: true
        }, function(data) {

            Max.App.hatCredentials = data;
            mCurrentUser = new Max.User(data.user);
            Cookie.create('magnet-max-auth-token', data.access_token, 2);

            if (data.refresh_token)
                Cookie.create('magnet-max-refresh-token', data.refresh_token, 365);

            Max.MMXClient.registerDeviceAndConnect(data.access_token)
                .success(function() {
                    def.resolve.apply(def, arguments);
                })
                .error(function() {
                    def.reject.apply(def, arguments);
                });

        }, function(e, details) {
            def.reject(details.status == 401 ? 'incorrect credentials' : e, details);
        });
    }, 0);

    return def.promise;
};

/**
 * Login automatically if the rememberMe flag was passed during login.
 * @param {Max.Request} [request] Request to retry if login succeeded.
 * @param {function} [callback] fires upon successful login.
 * @param {function} [failback] fires upon login failure.
 * @private
 */
Max.User.loginWithRefreshToken = function(request, callback, failback) {
    var def = new Max.Deferred();
    var token = Cookie.get('magnet-max-refresh-token');

    if ( Max.init.inprocess ) {
        return;
    }

    Cookie.remove('magnet-max-auth-token');
    delete Max.App.hatCredentials;
    request = Max.Utils.mergeObj(request, { isLogin: true });

    if (request && request.headers && request.headers.Authorization)
        delete request.headers.Authorization;

    setTimeout(function() {
        if (!token) {
          failback(Max.Error.INVALID_CREDENTIALS);
          return def.reject(Max.Error.SESSION_EXPIRED);
        }

        Max.User.loginWithRefreshToken.callbacks = Max.User.loginWithRefreshToken.callbacks || [];
        Max.User.loginWithRefreshToken.failbacks = Max.User.loginWithRefreshToken.failbacks || [];
        
        if ( Max.Utils.isArray(callback) ) {
            Max.User.loginWithRefreshToken.callbacks = Max.User.loginWithRefreshToken.callbacks.concat(callback);
        } else {
            Max.User.loginWithRefreshToken.callbacks.push(callback);
        }
        
        Max.User.loginWithRefreshToken.failbacks.push(failback);
        
        if ( Max.User.loginWithRefreshToken.inprocess ) {
            return;
        }

        Max.User.loginWithRefreshToken.inprocess = true;
        
        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/user/newtoken',
            data: {
                client_id: Max.App.clientId,
                refresh_token: token,
                grant_type: 'refresh_token',
                device_id: mCurrentDevice.deviceId,
                scope: 'user'
            },
            bypassReady: true,
            isLogin: true
        }, function(data, details) {

            var cbks = Max.User.loginWithRefreshToken.callbacks;
            var fbks = Max.User.loginWithRefreshToken.failbacks;
            delete Max.User.loginWithRefreshToken.callbacks;
            delete Max.User.loginWithRefreshToken.failbacks;
                
            delete Max.User.loginWithRefreshToken.inprocess;

            Max.App.hatCredentials = data;
            mCurrentUser = new Max.User(data.user);
            Cookie.create('magnet-max-auth-token', data.access_token, 2);

            Max.Log.fine('login with refresh token');

            if (mXMPPConnection) {
                if (request.url) {
                    return Max.Request(request, cbks);
                }
                if ( cbks.length ) {
                    cbks.forEach(function(cb) {
                        (cb || function() {})();
                    });
                }
                return def.resolve.apply(def, [mCurrentUser, details]);
            }

            Max.MMXClient.registerDeviceAndConnect(data.access_token)
                .success(function() {
                    if (request.url) {
                        return Max.Request(request, cbks);
                    }
                    if ( cbks.length ) {
                        cbks.forEach(function(cb) {
                            (cb || function() {})();
                        });
                    }
                    def.resolve.apply(def, arguments);
                })
                .error(function() {
                    if ( fbks.length ) {
                        fbks.forEach(function(fb) {
                            (fb || function() {})(Max.Error.SESSION_EXPIRED);
                        });                        
                    }
                    def.reject.apply(def, arguments);
                });

        }, function(e, details) {
            var fbks = Max.User.loginWithRefreshToken.failbacks;
            delete Max.User.loginWithRefreshToken.callbacks;
            delete Max.User.loginWithRefreshToken.inprocess;
            if ( fbks.length ) {
                fbks.forEach(function(fb) {
                    (fb || function() {})(Max.Error.SESSION_EXPIRED);
                });                        
            }
            def.reject((details && details.status == 401) ? Max.Error.INVALID_CREDENTIALS : e, details);
        });
    }, 0);

    return def.promise;
};

/**
 * Attempts to login with an access token.
 * @param {function} callback fires upon completion.
 * @private
 */
Max.User.loginWithAccessToken = function(callback) {
    var token = Cookie.get('magnet-max-auth-token');
    if (!token) return callback(Max.Error.INVALID_CREDENTIALS);

    Max.App.hatCredentials = {
        access_token: token
    };

    Max.User.getUserInfo().success(function(user) {
        mCurrentUser = new Max.User(user);

        Max.Log.fine('login with access token');

        Max.MMXClient.registerDeviceAndConnect(token)
            .success(function() {
                callback();
            })
            .error(function(e) {
                callback(e);
            });

    }).error(function(e) {
        callback(e);
    });
};

/**
 * Given a list of usernames, return a list of users.
 * @param {string[]} usernames A list of usernames.
 * @returns {Max.Promise.<Max.User[]>} A promise object returning a list of {Max.User} or reason of failure.
 */
Max.User.getUsersByUserNames = function(usernames) {
    var qs = '', userlist = [];

    if (usernames && usernames.length) {
        for (var i=0;i<usernames.length;++i) {
            qs += '&userNames=' + usernames[i];
        }
        qs = qs.replace('&', '?');
    }

    var def = Max.Request({
        method: 'GET',
        url: '/com.magnet.server/user/users' + qs
    }, function(data, details) {
        for (var i=0;i<data.length;++i)
            userlist.push(new Max.User(data[i]));

        def.resolve(userlist, details);
    }, function() {
        def.reject.apply(def, arguments);
    });

    return def.promise;
};

/**
 * Given a list of userIds, return a list of users.
 * @param {string[]} userIds A list of userIds.
 * @returns {Max.Promise.<Max.User[]>} A promise object returning a list of {Max.User} or reason of failure.
 */
Max.User.getUsersByUserIds = function(userIds) {
    var qs = '', userlist = [];

    if (userIds && userIds.length) {
        for (var i=0;i<userIds.length;++i)
            qs += '&userIds=' + userIds[i];
        qs = qs.replace('&', '?');
    }

    var def = Max.Request({
        method: 'GET',
        url: '/com.magnet.server/user/users/ids' + qs
    }, function(data, details) {
        for (var i=0;i<data.length;++i)
            userlist.push(new Max.User(data[i]));

        def.resolve(userlist, details);
    }, function() {
        def.reject.apply(def, arguments);
    });

    return def.promise;
};

/**
 * Search for users with an advanced search query.
 * @param {string|object} [query] An object containing the user property and the search value as a key-value pair. Alternatively, you can pass an ElasticSearch query string as described at {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html|URI Search}.
 * For example, to search for a user by username, the object can be {userName:'jon.doe'}. See {Max.User} properties for acceptable search properties.
 * @param {number} [limit] The number of results to return per page. Default is 10.
 * @param {number} [offset] The starting index of results.
 * @param {object} [orderby] An object containing the user property and the sort direction
 * ['asc', 'desc'] as a key-value pair. For example, to order by username descending, the object can be
 * {userName:'desc'}. See {Max.User} properties for acceptable search properties.
 * @returns {Max.Promise.<Max.User[]>} A promise object returning a list of {Max.User} or reason of failure.
 */
Max.User.search = function(query, limit, offset, orderby) {
    var qs = '', userlist = [];
    var keyMap = {
        query: 'q',
        limit: 'take',
        offset: 'skip',
        orderby: 'sort'
    };

    var queryObj = {};
    queryObj.offset = offset || 0;
    queryObj.limit = limit || 10;
    queryObj.query = query || {userName : '*'};
    queryObj.orderby = orderby || null;

    if (queryObj.query.userId)
        queryObj.query.userIdentifier = queryObj.query.userId;
    if (orderby && orderby.userId)
        queryObj.orderby.userIdentifier = queryObj.orderby.userId;

    for(var key in queryObj) {
        if (typeof queryObj[key] === 'string' ||
            typeof queryObj[key] === 'number' ||
            typeof queryObj[key] === 'boolean') {
            qs += '&'+keyMap[key]+'='+queryObj[key];
        } else if (queryObj[key] && typeof queryObj[key] == 'object') {
            for (var propKey in queryObj[key]) {
                if (propKey !== 'userId')
                    qs += '&'+keyMap[key]+'='+propKey+':'+queryObj[key][propKey];
            }

        }
    }
    qs = qs != '' ? qs.replace('&', '?') : qs;

    var def = Max.Request({
        method: 'GET',
        url: '/com.magnet.server/user/query'+qs,
        bypassReady: queryObj.bypassReady
    }, function(data, details) {
        for (var i=0;i<data.length;++i)
            userlist.push(new Max.User(data[i]));

        def.resolve(userlist, details);
    }, function() {
        def.reject.apply(def, arguments);
    });

    return def.promise;
};

/**
 * Get client token from server.
 * @ignore
 */
Max.User.getToken = function() {
    var def = Max.Request({
        method: 'GET',
        url: '/com.magnet.server/tokens/token'
    }, function() {
        def.resolve.apply(def, arguments);
    }, function() {
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

/**
 * Gets the current {Max.User} object.
 * @returns {Max.Promise.<Max.User>} A promise object returning the current {Max.User} or reason of failure.
 * @private
 */
Max.User.getUserInfo = function() {
    var def = Max.Request({
        method: 'GET',
        url: '/com.magnet.server/userinfo',
        bypassReady: true
    }, function(data, details) {
        mCurrentUser = new Max.User(data);
        def.resolve.apply(def, [mCurrentUser, details]);
    }, function() {
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

/**
 * Update user profile.
 * @param {object} userObj An object containing user information.
 * @param {string} [userObj.password] User's preferred password.
 * @param {string} [userObj.firstName] User's first name.
 * @param {string} [userObj.lastName] User's last name.
 * @param {string} [userObj.email] User's email.
 * @param {string[]} [userObj.tags] User's tags.
 * @param {object} [userObj.extras] Additional custom metadata to associate with the user.
 * @returns {Max.Promise.<Max.User>} A promise object returning the updated {Max.User} or reason of failure.
 */
Max.User.updateProfile = function(userObj) {
    userObj = userObj || {};
    userObj = Max.Utils.mergeObj({}, userObj);

    if (userObj.extras) {
        userObj.userAccountData = userObj.extras;
        delete userObj.extras;
    }

    if (userObj.password && userObj.password == 'n/a')
      delete userObj.password;

    var def = Max.Request({
        method: 'PUT',
        url: '/com.magnet.server/user/profile',
        data: userObj
    }, function(user, details) {
        mCurrentUser = new Max.User(user);
        def.resolve.apply(def, [mCurrentUser, details]);
    }, function() {
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

/**
 * Logout the current logged in user.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 */
Max.User.logout = function() {
    var self = this;
    var reason = 'logout';
    var def = Max.Request({
        method: 'DELETE',
        url: '/com.magnet.server/user/session'
    }, function() {
        self.clearSession(reason);
        def.resolve.apply(def, arguments);
    }, function() {
        self.clearSession(reason);
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

/**
 * Removes user session information.
 * @param {string} [reason] Reason for disconnection.
 * @private
 */
Max.User.clearSession = function(reason) {
    mCurrentUser = null;
    Max.App.hatCredentials = null;
    Cookie.remove('magnet-max-auth-token');
    Cookie.remove('magnet-max-refresh-token');
    mListenerHandlerStore = {};
    Max.MMXClient.disconnect();
    ChannelStore.clear();
    Max.invoke('not-authenticated', reason);
};

/**
 * Get profile picture url of the current user.
 * @returns {string} User profile download Url.
 */
Max.User.getAvatarUrl = function() {
    return mCurrentUser ? mCurrentUser.getAvatarUrl() : null;
};

/**
 * Get user profile picture url.
 * @returns {string} User profile download Url.
 */
Max.User.prototype.getAvatarUrl = function() {
    if (!this.userId || !Max.App.hatCredentials) return null;

    return Max.Config.baseUrl+'/com.magnet.server/file/download/'+this.userId
        +'?access_token='+Max.App.hatCredentials.access_token+'&user_id='+this.userId;
};

/**
 * Upload profile picture for the current user.
 * @param {File} picture A File object created by an input[type="file"] HTML element.
 * @returns {Max.Promise.<string>} User profile download URL.
 */
Max.User.setAvatar = function(picture) {
    var self = this, userObj;
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!picture) return def.reject(Max.Error.INVALID_PICTURE);

        new Max.Uploader(picture, function(e, multipart) {
            if (e || !multipart) return def.reject(e);

            multipart.avatarUpload(mCurrentUser.userId).success(function() {
                if (mCurrentUser.extras && mCurrentUser.extras.hasAvatar)
                    return def.resolve(self.getAvatarUrl());

                userObj = Max.Utils.mergeObj(mCurrentUser, {
                    password: null,
                    extras: { hasAvatar: true }
                });

                Max.User.updateProfile(userObj).success(function() {
                    def.resolve(self.getAvatarUrl());
                }).error(function(e) {
                    def.reject(e);
                })
            }).error(function(e) {
                def.reject(e);
            });
        });
    }, 0);

    return def.promise;
};

/**
 * Delete profile picture of the current user.
 * @returns {Max.Promise.<string>} A promise object returning 'ok' or reason of failure.
 */
Max.User.deleteAvatar = function() {
    var def = new Max.Deferred();

    Max.Request({
        method: 'DELETE',
        url: '/com.magnet.server/file/delete/' + mCurrentUser.userId,
        headers: {
            'Accept': '*/*'
        }
    }, function() {
        var userObj = Max.Utils.mergeObj(mCurrentUser, {
            password: null,
            extras: { hasAvatar: null }
        });

        Max.User.updateProfile(userObj).success(function() {
            def.resolve('ok');
        }).error(function(e) {
            def.reject(e);
        });
    }, function() {
        def.reject.apply(def, arguments);
    });
    return def.promise;
};

Max.UserHelper = {
    userToUserIds: function(users, isObjectEmbed) {
        var uids = [], uid;

        if (!users) return [];

        if (!Max.Utils.isArray(users))
            users = [users];

        for (var i in users) {
            uid = Max.Utils.isObject(users[i]) ? users[i].userId : users[i];

            uids.push(isObjectEmbed ? {
                userIdentifier: uid
            } : uid);
        }

        return uids;
    }
};

var DEFAULT_PRIVACY_LIST = 'default';

/**
 * @constructor
 * @class
 * The UserPreferences class is used to manage privacy control for the current user.
 */
Max.UserPreferences = {
    /**
     * Disables communication with all of the given users.
     * @param {string|Max.User|string[]|Max.User[]} users One or more userId or {Max.User} objects to block.
     * @returns {Max.Promise.<string>} A promise object returning "ok" or request error.
     */
    blockUsers: function(users) {
        var self = this, def = new Max.Deferred();

        self.getBlockedUsers(true).success(function(blockedUsers) {
            self.setUsers(blockedUsers.concat(users)).success(function(res, details) {
                def.resolve(res, details);
            }).error(function(e) {
                def.reject(e);
            });
        }).error(function(e) {
            def.reject(e);
        });

        return def.promise;
    },
    /**
     * Re-enable communication with all of the given users.
     * @param {string|Max.User|string[]|Max.User[]} users One or more userId or {Max.User} objects to unblock.
     * @returns {Max.Promise.<string>} A promise object returning "ok" or request error.
     */
    unblockUsers: function(users) {
        var self = this, def = new Max.Deferred(), userId;

        self.getBlockedUsers(true).success(function(blockedUsers) {
            if (!Max.Utils.isArray(users))
                users = [users];

            for (var i=0;i<users.length;++i) {
                userId = Max.Utils.isObject(users[i]) ? users[i].userId : users[i];
                if (blockedUsers.indexOf(userId) != -1)
                    blockedUsers.splice(blockedUsers.indexOf(userId), 1);
            }

            self.setUsers(blockedUsers).success(function(res, details) {
                def.resolve(res, details);
            }).error(function(e) {
                def.reject(e);
            });
        }).error(function(e) {
            def.reject(e);
        });

        return def.promise;
    },
    /**
     * Update the privacy list by passing all of the users in the list including both new and existing users.
     * @param {string|Max.User|string[]|Max.User[]} users One or more userId or {Max.User} objects to block.
     * @returns {Max.Promise.<string>} A promise object returning "ok" or request error.
     * @private
     */
    setUsers: function(users) {
        var self = this, def = new Max.Deferred(), iqId = Max.Utils.getCleanGUID(), userId, uids = {};

        setTimeout(function() {
            if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
            if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

            if (!Max.Utils.isArray(users))
                users = [users];

            var payload = $iq({from: mCurrentUser.jid, type: 'set', id: iqId})
                .c('query', {xmlns: 'jabber:iq:privacy'})
                .c('list', {name: DEFAULT_PRIVACY_LIST});

            for (var i in users) {
                userId = Max.Utils.isObject(users[i]) ? users[i].userId : users[i];
                if (uids[userId]) continue;
                uids[userId] = true;
                payload.c('item', {action: 'deny', order: '1', type: 'jid', value: Max.MMXClient.getBaredJid(userId)});
                payload.c('iq').up().c('message').up().c('presence-in').up().c('presence-out').up().up();
            }

            mXMPPConnection.addHandler(function(msg) {
                var json = x2js.xml2json(msg);

                if (json.error) {
                    if (json.error._type == 'auth') json.error._type = Max.Error.FORBIDDEN;
                    return def.reject(json.error._type, json.error._code);
                }

                self.enablePrivacyList(DEFAULT_PRIVACY_LIST).success(function() {
                    def.resolve('ok');
                }).error(function(e) {
                    def.reject(e);
                });
            }, null, null, null, iqId, null);

            mXMPPConnection.send(payload.tree());

        }, 0);

        return def.promise;
    },
    /**
     * Get all the users blocked by the current user.
     * @param {boolean} [uidsOnly] If enabled, only a list of userId are returned.
     * @returns {Max.Promise.<Max.User[]>} A promise object returning a list of {Max.User} or request error.
     */
    getBlockedUsers: function(uidsOnly) {
        var def = new Max.Deferred(), iqId = Max.Utils.getCleanGUID(), items, uids = [];

        setTimeout(function() {
            if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
            if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

            var payload = $iq({from: mCurrentUser.jid, type: 'get', id: iqId})
                .c('query', {xmlns: 'jabber:iq:privacy'})
                .c('list', {name: DEFAULT_PRIVACY_LIST});

            mXMPPConnection.addHandler(function(msg) {
                var json = x2js.xml2json(msg);

                if (json.error && json.error._code != '404') {
                    if (json.error._type == 'auth') json.error._type = Max.Error.FORBIDDEN;
                    return def.reject(json.error._type, json.error._code);
                }

                if (json.error && json.error._code == '404') {
                    return def.resolve([]);
                }

                if (json.query && json.query.list && json.query.list.item) {
                    items = Max.Utils.objToObjAry(json.query.list.item);
                    for (var i=0;i<items.length;++i) {
                        uids.push(items[i]._value.split('%')[0]);
                    }
                }

                if (!uids.length || uidsOnly) return def.resolve(uids);

                Max.User.getUsersByUserIds(uids).success(function() {
                    def.resolve.apply(def, arguments);
                }).error(function(e) {
                    def.reject(e);
                });
            }, null, null, null, iqId, null);

            mXMPPConnection.send(payload.tree());

        }, 0);

        return def.promise;
    },
    /**
     * Set default privacy list for the current user.
     * @param {string} listName The privacy list to use.
     * @returns {Max.Promise.<string>} A promise object returning "ok" or request error.
     * @private
     */
    enablePrivacyList: function(listName) {
        var def = new Max.Deferred(), iqId = Max.Utils.getCleanGUID();

        setTimeout(function() {
            if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
            if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);
            if (!listName) return def.reject(Max.Error.INVALID_PRIVACY_LIST_NAME);

            var payload = $iq({from: mCurrentUser.jid, type: 'set', id: iqId})
                .c('query', {xmlns: 'jabber:iq:privacy'})
                .c('default', {name: listName});

            mXMPPConnection.addHandler(function(msg) {
                var json = x2js.xml2json(msg);

                if (json.error && json.error._code != '404') {
                    if (json.error._type == 'auth') json.error._type = Max.Error.FORBIDDEN;
                    return def.reject(json.error._type, json.error._code);
                }

                def.resolve('ok');
            }, null, null, null, iqId, null);

            mXMPPConnection.send(payload.tree());

        }, 0);

        return def.promise;
    }
};

/**
 * @constructor
 * @class
 * The Device class is a local representation of a device in the MagnetMax platform. This class provides
 * various device specific methods, like collecting device information.
 */
Max.Device = {
    /**
     * @desc Get device information of the currently registered device.
     * @returns {Max.Device} currently logged in user.
     */
    getCurrentDevice: function() {
        return mCurrentDevice || null;
    },
    /**
     * Associates a device with the current user against the server.
     * @returns {Max.Promise.<object>} A promise object returning device information or request error.
     * @private
     */
    register: function() {
        var def = new Max.Deferred();

        Max.Device.collectDeviceInfo(function(e, deviceInfo) {
            if (!mCurrentDevice) mCurrentDevice = deviceInfo;

            Max.Request({
                method: 'POST',
                url: '/com.magnet.server/devices',
                data: mCurrentDevice,
                bypassReady: true
            }, function () {
                def.resolve.apply(def, arguments);
            }, function () {
                def.reject.apply(def, arguments);
            });
        });

        return def.promise;
    },
    /**
     * Retrieves the current device information.
     * @param {function} [callback] Returns device information or error.
     * @private
     */
    collectDeviceInfo: function(callback) {
        var e = null;
        var browser = Max.Utils.getBrowser();
        var os = Max.Utils.getOS();
        var deviceId = Cookie.get('magnet-max-device-id');

        if (!deviceId) {
            deviceId = 'js-'+Max.Utils.getGUID();
            Cookie.create('magnet-max-device-id', deviceId, 365);
        }

        var deviceInfo = {
            deviceId: deviceId,
            deviceStatus: 'ACTIVE',
            label: browser,
            os: 'ANDROID', // TODO: server must support web client: os.os,
            osVersion: os.os + (os.version || ''),
            pushAuthority: 'GCM'
        };

        return (callback || function() {})(e, deviceInfo);
    },
    /**
     * Initiates a session with the server using the currently registered device.
     * @param {function} callback fires upon device initiation.
     * @private
     */
    checkInWithDevice: function(callback) {
        Max.Device.collectDeviceInfo(function(e, deviceInfo) {
            if (e) throw (e);

            Max.Request({
                method: 'POST',
                url: '/com.magnet.server/applications/session-device',
                data: deviceInfo,
                headers: {
                    Authorization: 'Basic ' +
                    Max.Utils.stringToBase64(Max.App.clientId+':'+Max.App.clientSecret)
                },
                bypassReady: true
            }, function(data) {

                mCurrentDevice = deviceInfo;
                Max.App.catCredentials = data.applicationToken;
                Max.App.appId = data.applicationToken.mmx_app_id;
                Max.Config.baseUrl = data.config['mms-application-endpoint'];
                Max.Config.mmxHost = data.config['mmx-host'];
                Max.Config.securityPolicy = data.config['security-policy'];
                Max.Config.tlsEnabled = data.config['tls-enabled'] === 'true';
                Max.Config.mmxDomain = data.config['mmx-domain'];
                Max.Config.mmxPort = parseInt(data.config['mmx-port']);

                callback();
            }, function(e) {

                callback(e);
            });
        });
    }
};

var x2js = new X2JS();
var TYPED_PAYLOAD_CONTENT_TYPE = 'object/';

/**
 * @method
 * @desc Start receiving messages.
 */
Max.start = function() {
    Max.App.receiving = true;
    if (mXMPPConnection) mXMPPConnection.priority = 0;
};

/**
 * @method
 * @desc Stop receiving messages.
 */
Max.stop = function() {
    Max.App.receiving = false;
    if (mXMPPConnection) mXMPPConnection.priority = -255;
};

/**
 * @method
 * @desc Register a listener to handle incoming messages.
 * @param {Max.EventListener} listener An event listener.
 */
Max.registerListener = function(listener) {
    Max.unregisterListener(listener);

    mListenerStore[listener.id] = mXMPPConnection.addHandler(function(msg) {

        Max.Message.formatEvent(x2js.xml2json(msg), null, function(e, event) {
            if (event) {
                switch (event.mType) {
                    case Max.MessageType.INVITATION: listener.invitationHandler(event); break;
                    case Max.MessageType.INVITATION_RESPONSE: listener.invitationResponseHandler(event); break;
                    default: listener.messageHandler(event); break;
                }
            }
        });
        return true;

    }, null, 'message', null, null,  null);

    mListenerHandlerStore[listener.id] = listener;
};

/**
 * @method
 * @desc Unregister a listener identified by the given id to stop handling incoming messages.
 * @param {string|Max.EventListener} listenerOrListenerId An event listener or the listener Id specified
 * during creation.
 */
Max.unregisterListener = function(listenerOrListenerId) {
    if (!listenerOrListenerId) return;
    if (typeof listenerOrListenerId === 'object') listenerOrListenerId = listenerOrListenerId.id;
    delete mListenerHandlerStore[listenerOrListenerId];
    if (!mListenerStore || !mXMPPConnection || !mXMPPConnection.deleteHandler) return;
    mXMPPConnection.deleteHandler(mListenerStore[listenerOrListenerId]);
    delete mListenerStore[listenerOrListenerId];
};

/**
 * @method
 * @desc Register a custom message payload type.
 * @param {string} name Name of the payload type.
 * @param {object} typedPayload The typed payload constructor.
 */
Max.registerPayloadType = function(name, typedPayload) {
    typedPayload.prototype.TYPE = name;
    mPayloadTypes[name] = typedPayload;
};

/**
 * @constructor
 * @memberof Max
 * @class EventListener The EventListener is used to listen for incoming messages and channel invitations, and subsequently call the given handler function.
 * @param {string|function} id A string ID for the handler. The string ID should be specified if you plan to unregister the handler at some point.
 * @param {object|function} messageHandlerOrObject Alternatively, pass a handler object containing the callbacks. Alternatively, pass function to be fired when a {Max.Message} is received.
 * @param {function} messageHandlerOrObject.message Function to be fired when a {Max.Message} is received.
 * @param {function} [messageHandlerOrObject.invite] Function to be fired when a {Max.Invite} is received.
 * @param {function} [messageHandlerOrObject.inviteResponse] Function to be fired when a {Max.InviteResponse} is received.
 * @param {function} [invitationHandler] Function to be fired when a {Max.Invite} is received.
 * @param {function} [invitationResponseHandler] Function to be fired when a {Max.InviteResponse} is received.
 */
Max.EventListener = function(id, messageHandlerOrObject, invitationHandler, invitationResponseHandler) {
    this.id = typeof id == 'string' ? id : Max.Utils.getGUID();

    if (messageHandlerOrObject) {
        if (messageHandlerOrObject.inviteResponse) invitationResponseHandler = messageHandlerOrObject.inviteResponse;
        if (messageHandlerOrObject.invite) invitationHandler = messageHandlerOrObject.invite;
        if (messageHandlerOrObject.message) messageHandlerOrObject = messageHandlerOrObject.message;
    }

    this.messageHandler = typeof messageHandlerOrObject === 'function' ? messageHandlerOrObject : function() {};
    this.invitationHandler = invitationHandler || function() {};
    this.invitationResponseHandler = invitationResponseHandler || function() {};
};

/**
 * @constructor
 * @memberof Max
 * @extends Max.EventListener
 */
Max.MessageListener = Max.EventListener;

/**
 * @constructor
 * @memberof Max
 * @class MMXClient The MMXClient handles communication with the MMX server via XMPP.
 * @private
 */
Max.MMXClient = {
    // event emitter for connection
    connectionEmitter: null,
    /**
     * Connect to MMX server via BOSH http-bind.
     * @param {string} userId The currently logged in user's userId (id).
     * @param {string} accessToken The currently logged in user's access token.
     * @param {boolean} [isReconnect] Set to true if the connect was caused by reconnection.
     * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
     */
    connect: function(userId, accessToken, isReconnect) {
        var self = this;
        var def = new Max.Deferred();
        var secure = Max.Config.baseUrl.indexOf('https://') != -1;
        var protocol = (secure ? 'https' : 'http') + '://';
        var baseHostName = Max.Config.baseUrl.replace('https://', '').replace('http://', '').split('/')[0];
        var xmppHost = secure ? baseHostName : (Max.Config.mmxHost + ':' + Max.Config.httpBindPort);
        var initEnd = false;

        setTimeout(function() {
            if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
            if (self.connectionEmitter) return def.reject('already connected');

            self.connectionEmitter = {};
            Max.Events.create(self.connectionEmitter);
            self.bindDisconnect();

            mCurrentUser.jid = self.getBaredJid(userId) + '/' + mCurrentDevice.deviceId;
            mXMPPConnection = new Strophe.Connection(protocol + xmppHost + '/http-bind/', {
                withCredentials: secure
            });

            mXMPPConnection.rawInput = function(data) {
                if (Max.Config.payloadLogging) Max.Log.fine('RECV: ' + data);
            };
            mXMPPConnection.rawOutput = function(data) {
                if (Max.Config.payloadLogging) Max.Log.fine('SENT: ' + data);
            };
            mXMPPConnection.connect(mCurrentUser.jid, accessToken, function(status) {
                if (self.connectionEmitter) self.connectionEmitter.invoke(status);

                self.connectionHandler(status, function(e) {
                    if (initEnd) return;
                    initEnd = true;
                    if (e) return def.reject(e);

                    mXMPPConnection.send($pres());
                    if (!isReconnect) Max.invoke('authenticated', 'ok');
                    def.resolve('ok');
                });
            });

        }, 0);
        return def.promise;
    },
    // handle connection events related to initial connectivity
    connectionHandler: function(status, callback) {
        switch (status) {
            case Strophe.Status.ERROR: {
                Max.Log.fine('Max connection error');
                callback('connection error');
                break;
            }
            case Strophe.Status.CONNFAIL: {
                Max.Log.fine('Max connection failure');
                callback('connection failed');
                break;
            }
            case Strophe.Status.AUTHFAIL: {
                Max.Log.fine('Max failed authentication');
                callback('not authorized');
                break;
            }
            case Strophe.Status.CONNECTED: {
                Max.Log.info('Max connected');
                callback();
                break;
            }
        }
    },
    // handle disconnection gracefully
    bindDisconnect: function(callback, noReconnect) {
        var self = this;
        self.connectionEmitter.unbind(Strophe.Status.DISCONNECTED);
        self.connectionEmitter.on(Strophe.Status.DISCONNECTED, function() {
            Max.Log.info('Max disconnected');
            self.connectionEmitter = null;
            mXMPPConnection = null;
            var token = Cookie.get('magnet-max-auth-token');
            if (mCurrentUser && token && !noReconnect) {
                Max.MMXClient.connect(mCurrentUser.userId, token, true).success(function() {
                    for (var lid in mListenerHandlerStore) {
                        Max.registerListener(mListenerHandlerStore[lid]);
                    }
                }).error(function() {
                    Max.User.logout();
                });
            }
            if (typeof callback === typeof Function) return callback();
        });
    },
    /**
     * A wrapper function to register device and connect to MMX server via BOSH http-bind.
     * @param {string} accessToken The currently logged in user's access token.
     * @returns {Max.Promise.<object>} A promise object returning current user and device or reason of failure.
     */
    registerDeviceAndConnect: function(accessToken) {
        var self = this;
        var def = new Max.Deferred();
        Max.Device.register().success(function() {
            if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
            function connect() {
                var userId = mCurrentUser.userId;
                Max.MMXClient.connect(userId, accessToken).success(function() {
                    def.resolve(mCurrentUser, mCurrentDevice);
                }).error(function() {
                    def.reject.apply(def, arguments);
                });
            }
            if (!mXMPPConnection) {
                connect();
            } else {
                self.bindDisconnect(function() {
                    connect();
                }, true);
                Max.MMXClient.disconnect();
            }
        }).error(function() {
            def.reject.apply(def, arguments);
        });
        return def.promise;
    },
    /**
     * Disconnect from MMX server.
     */
    disconnect: function() {
        if (mXMPPConnection) mXMPPConnection.disconnect();
    },
    /**
     * Given a userId (id), return a Bared Jid.
     * @param {string} userId A user's userId (id).
     * @returns {string} a user's Bared Jid.
     */
    getBaredJid: function(userId) {
        return userId + "%" + Max.App.appId +
            '@' + Max.Config.mmxDomain;
    }
};

/**
 * Types of messages which can be sent between users.
 * @readonly
 * @enum {string}
 */
Max.MessageType = {
    MESSAGE: 'unknown',
    INVITATION: 'invitation',
    INVITATION_RESPONSE: 'invitationResponse',
    POLL: 'MMXPoll',
    POLL_OPTION: 'MMXPollOption',
    POLL_ANSWER: 'MMXPollAnswer',
    CHECKLIST: 'MMXChecklist',
    CHECKLIST_ITEM: 'MMXChecklistItem',
    CHECKLIST_SELECTION: 'MMXChecklistSelection',
    APPROVAL: 'MMXApproval',
    APPROVAL_ITEM: 'MMXApprovalItem',
    APPROVAL_ANSWER: 'MMXApprovalAnswer',
    APPROVAL_LINE_ITEM_UPDATE: 'MMXApprovalLineItemUpdate',
    OBJECT_IDENTIFIER: 'ObjectIdentifier'
};

/**
 * @constructor
 * @class
 * The Message class is the local representation of a message. This class provides  various message specific methods, like send or reply.
 * @param {object} contents an object containing your custom message body.
 * @param {Max.User|Max.User[]|string|string[]} recipientOrRecipients One or more {Max.User}
 * @param {File|File[]|FileList} [attachments] One or more File objects created by an input[type="file"] HTML element.
 * @param {string} [pushConfigName] The push config name. The push config can be defined on the server and controls behavior like push notification content, whether to send a push notification if the recipient is not online, etc.
 * @property {object|Max.User} sender The message sender.
 * @property {object} messageContent The custom message body object sent by the sender.
 * @property {string} messageId An identifier for the message. It can be used to determine whether a message has already been displayed on a chat screen.
 * @property {Max.Attachment[]} [attachments] An array of message attachments.
 * @property {Max.Channel} [channel] If the message was sent to a channel, the channel object will be available.
 * @property {Date} timestamp The date and time this message was sent.
 * @property {object[]|Max.User[]} [recipients] An array of recipients, if the message was sent to individual users instead of through a channel.
 */
Max.Message = function(contents, recipientOrRecipients, attachments, pushConfigName) {
    this.meta = {};
    this.recipients = [];
    this._attachments = [];
    this.messageContent = contents || {};
    this.pushConfigName = pushConfigName;

    if (recipientOrRecipients) {
        if (Max.Utils.isArray(recipientOrRecipients)) {
            for (var i=0;i<recipientOrRecipients.length;++i)
                this.recipients.push(formatUser(recipientOrRecipients[i]));
        } else {
            this.recipients.push(formatUser(recipientOrRecipients));
        }
    }

    if (attachments)
        this.addAttachments(attachments);

    if (mCurrentUser)
        this.sender = mCurrentUser;

    return this;
};

/**
 * Given {Max.User} object or userId, return a formatted object containing userId.
 */
function formatUser(userOrUserId) {
    return {
        userId: typeof userOrUserId == 'string' ? userOrUserId : userOrUserId.userId
    };
}

/**
 * Given an XMPP payload converted to JSON, set the properties of the object.
 * @param {object} msg A JSON representation of an xmpp payload.
 * @param {Max.Channel} [channel] The channel this message belongs to.
 * @param {function} callback This function fires after the format is complete.
 * @private
 */
Max.Message.formatEvent = function(msg, channel, callback) {
    var self, mType;

    msg.mmx = (
      msg.event &&
      msg.event.items &&
      msg.event.items.item &&
      msg.event.items.item.mmx
    ) ? msg.event.items.item.mmx : msg.mmx;

    if (msg.mmx && msg.mmx._xmlns == 'com.magnet:msg:signal') return callback();

    mType = (msg.mmx && msg.mmx.payload && msg.mmx.payload._mtype) ? msg.mmx.payload._mtype : 'unknown';

    switch (mType) {
        case Max.MessageType.INVITATION: self = new Max.Invite(); break;
        case Max.MessageType.INVITATION_RESPONSE: self = new Max.InviteResponse(); break;
        default: self = new Max.Message(); break;
    }

    self.receivedMessage = true;
    self.messageType = msg._type;
    self.messageId = (msg.event && msg.event.items && msg.event.items.item)
        ? msg.event.items.item._id : msg._id;
    self.channel = null;
    self.attachments = null;
    self.messageContent = {};

    self.meta = {
        from: msg._from,
        to: msg._to,
        id: msg._id
    };

    self.meta.ns = msg.mmx ? msg.mmx._xmlns : '';

    if (msg.mmx && msg.mmx.meta) {
        var msgMeta = JSON.parse(msg.mmx.meta);
        Max.MessageHelper.attachmentRefsToAttachment(self, msgMeta);
        self.messageContent = msgMeta || {};
    }

    if (msg.mmx && msg.mmx.payload && msg.mmx.payload.__text) {
        Max.MessageHelper.initTypedPayload(self, mType, JSON.parse(msg.mmx.payload.__text));
    }

    if (msg.mmx && msg.mmx.mmxmeta) {
        var mmxMeta = JSON.parse(msg.mmx.mmxmeta);
        self.recipients = mmxMeta.To;
        if (mmxMeta.From) self.sender = new Max.User(mmxMeta.From);
    }

    if (msg.mmx && msg.mmx.payload) {
        self.timestamp = Max.Utils.ISO8601ToDate(msg.mmx.payload._stamp);
    }

    if (self.mType == Max.MessageType.INVITATION || self.mType == Max.MessageType.INVITATION_RESPONSE) {
        self.invitationMeta = Max.Utils.mergeObj({}, self.messageContent);
        delete self.messageContent;
        delete self.messageType;
        delete self.attachments;
        delete self.receivedMessage;
        self.comments = self.invitationMeta.text;
    }

    if (self.mType == Max.MessageType.INVITATION_RESPONSE) {
        self.accepted = self.invitationMeta.inviteIsAccepted === 'true';
        self.comments = self.invitationMeta.inviteResponseText;
    }

    if (channel) {
        self.channel = channel;
        callback(null, self);
    } else if (self.invitationMeta || (msg.event && msg.event.items && msg.event.items._node)) {

        var channelObj = self.invitationMeta ? new Max.Channel({
            name: self.invitationMeta.channelName,
            userId: (self.invitationMeta.channelIsPublic === 'false' ? self.invitationMeta.channelOwnerId : null)
        }) : Max.MessageHelper.nodePathToChannel(msg.event.items._node);

        if (ChannelStore.get(channelObj)) {
            ChannelStore.get(channelObj).isSubscribed = true;
            self.channel = ChannelStore.get(channelObj);
            return callback(null, self);
        }

        Max.Channel.getChannel(channelObj.name, channelObj.userId).success(function(channel) {
            self.channel = channel;
            callback(null, self);
        }).error(function(e) {
            callback(e);
        });
    } else {
        callback(null, self);
    }
};

Max.MessageHelper = {
    /**
     * Given a {Max.Message} object, instantiate the {Max.Attachment} objects.
     */
    attachmentRefsToAttachment: function(mmxMessage, msgMeta) {
        mmxMessage.attachments = mmxMessage.attachments || [];

        if (!msgMeta._attachments || msgMeta._attachments === '[]') return;
        if (typeof msgMeta._attachments === 'string')
            msgMeta._attachments = JSON.parse(msgMeta._attachments);

        for (var i=0;i<msgMeta._attachments.length;++i)
            mmxMessage.attachments.push(new Max.Attachment(msgMeta._attachments[i]));

        delete msgMeta._attachments;
    },
    /**
     * Given a {Max.Message} object, instantiate custom typed payload if it exists.
     */
    initTypedPayload: function(mmxMessage, mType, typedPayload) {
        if (mType
            && mType.indexOf(TYPED_PAYLOAD_CONTENT_TYPE) != -1
            && typeof typedPayload == 'object'
            && mPayloadTypes[mType.replace(TYPED_PAYLOAD_CONTENT_TYPE, '')]) {
            mmxMessage.addPayload(new mPayloadTypes[mType.replace(TYPED_PAYLOAD_CONTENT_TYPE, '')]);
            Max.Utils.mergeObj(mmxMessage.payload,  typedPayload);
            if (typeof mmxMessage.payload.parsePayload == typeof Function) {
                mmxMessage.payload.parsePayload();
            }
        }
    },
    /**
     * Convert a XMPP pubsub node string into a {Max.Channel} object.
     */
    nodePathToChannel: function(nodeStr) {
        nodeStr = nodeStr.split('/');
        if (nodeStr.length !== 4) return;

        var name = nodeStr[nodeStr.length-1];
        var userId = nodeStr[nodeStr.length-2];
        userId = userId == '*' ? null : userId;

        return new Max.Channel({
            name: name,
            userId: userId
        });
    }
};

// TODO: if we ever ned to fully hydrate channel on message receive:
//function nodePathToChannel(nodeStr, cb) {
//    nodeStr = nodeStr.split('/');
//    if (nodeStr.length !== 4) return cb('invalid node path');
//
//    var name = nodeStr[nodeStr.length-1];
//    var userId = nodeStr[nodeStr.length-2];
//    userId = userId == '*' ? null : userId;
//
//    Max.Channel.getChannel(name, userId).success(cb).error(function() {
//        cb();
//    });
//}

/**
 * Send the message to a user.
 * @returns {Max.Promise.<string>} A promise object returning the messageId or reason of failure.
 */
Max.Message.prototype.send = function() {
    var self = this;
    var def = new Max.Deferred();
    var dt = Max.Utils.dateToISO8601(new Date());
    self.msgId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!self.recipients.length)
            return def.reject('no recipients');
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected)
            return def.reject(Max.Error.NOT_CONNECTED);

        function sendMessage(msgMeta) {
            self.sender = {
                userId: mCurrentUser.userId,
                devId: mCurrentDevice.deviceId,
                displayName: (mCurrentUser.firstName || '') + ' ' + (mCurrentUser.lastName || ''),
                firstName: mCurrentUser.firstName,
                lastName: mCurrentUser.lastName,
                userName: mCurrentUser.userName
            };

            var meta = JSON.stringify(msgMeta);
            var mmxMeta = {
                To: self.recipients,
                From: self.sender,
                //NoAck: true,
                mmxdistributed: true
            };
            if (self.pushConfigName) mmxMeta['Push-Config-Name'] = self.pushConfigName;
            mmxMeta = JSON.stringify(mmxMeta);

            var payload = $msg({type: 'chat', from: mCurrentUser.jid,
                to: 'mmx$multicast%'+Max.App.appId+'@'+Max.Config.mmxDomain, id: self.msgId})
                .c('mmx', {xmlns: 'com.magnet:msg:payload'})
                .c('mmxmeta', mmxMeta).up()
                .c('meta', meta).up()
                .c('payload', {mtype: self.mType || 'unknown', stamp: dt, chunk: '0/0/0'}).up().up()
                .c('request', {xmlns: 'urn:xmpp:receipts'}).up()
                .c('body', '.');

            mXMPPConnection.addHandler(function(msg) {
                var json = x2js.xml2json(msg);
                if (!json.mmx || !json.mmx.mmxmeta || json.mmx._xmlns != 'com.magnet:msg:signal') return true;
                json = JSON.parse(json.mmx.mmxmeta);
                if (!json.endack || json.endack.ackForMsgId != self.msgId) return true;

                if (json.endack.errorCode == 'NO_ERROR') {
                    def.resolve(self.msgId);
                    return false;
                }

                def.reject(json.endack.errorCode, json.endack.badReceivers);
            }, null, 'message', null, null, null);

            mXMPPConnection.send(payload.tree());
        }

        if (!self._attachments.length) return sendMessage(self.messageContent);

        new Max.Uploader(self._attachments, function(e, multipart) {
            if (e || !multipart) return def.reject(e);

            multipart.messageUpload(self, self.msgId).success(function(attachments) {
                sendMessage(Max.Utils.mergeObj(self.messageContent || {}, {
                    _attachments: JSON.stringify(attachments)
                }));
            }).error(function(e) {
                def.reject(e);
            });
        });

    }, 0);

    return def.promise;
};

/**
 * Add one or more attachments.
 * @param {File|File[]|FileList} [attachmentOrAttachments] One or more File objects created by an input[type="file"] HTML element.
 */
Max.Message.prototype.addAttachments = function(attachmentOrAttachments) {
    if (!attachmentOrAttachments) return;

    if (attachmentOrAttachments[0] && attachmentOrAttachments[0].type) {
        this._attachments = this._attachments.concat(Array.prototype.slice.call(attachmentOrAttachments));
    } else if (Max.Utils.isArray(attachmentOrAttachments)) {
        this._attachments = this._attachments.concat(attachmentOrAttachments);
    } else {
        this._attachments.push(attachmentOrAttachments);
    }

    return this;
};

/**
 * Add a payload.
 * @param {object} payload A structured payload to add to the {Max.Message} instance.
 * @private
 */
Max.Message.prototype.addPayload = function(payload) {
    if (!payload) return;
    this.contentType = TYPED_PAYLOAD_CONTENT_TYPE + payload.TYPE;
    this.payload = payload;
    return this;
};

/**
 * Reply to a received message.
 * @param {object} contents an object containing your custom message body.
 * @returns {Max.Promise.<string>} A promise object returning messageId or reason of failure.
 */
Max.Message.prototype.reply = function(contents, replyAll) {
    var self = this;
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!contents) return def.reject('invalid reply message content');
        if (self.sender.userId == mCurrentUser.userId) return def.reject('cannot reply to yourself');

        self.recipients = (replyAll && self.recipients && self.recipients.length) ? self.recipients : [];
        self.recipients.push(formatUser(self.sender));

        for (var i=0;i<self.recipients.length;++i) {
            if (mCurrentUser && self.recipients[i].userId == mCurrentUser.userId) {
                self.splice(i, 1);
                break;
            }
        }

        self.messageContent = contents;

        self.send().success(function() {
           def.resolve.apply(def, arguments);
        }).error(function() {
           def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Reply to all recipients of a received message.
 * @param {object} contents an object containing your custom message body.
 * @returns {Max.Promise.<string>} A promise object returning messageId or reason of failure.
 */
Max.Message.prototype.replyAll = function(contents) {
    return this.reply(contents, true);
};

/**
 * @constructor
 * @class
 * A {Max.Invite} is received from the {Max.EventListener} when the current user is invited to a channel. This class
 * contains methods to view invitation comments and subsequently accept or deny an invitation.
 * @property {object|Max.User} sender The message sender.
 * @property {string} comments Invitation comments sent by the sender.
 * @property {Max.Channel} channel Channel the current user has been invited to.
 * @property {Date} timestamp The date and time this message was sent.
 * @property {object[]|Max.User[]} recipients An array of recipients who have been sent the invitation.
 */
Max.Invite = function() {
    this.meta = {};
    this.recipients = [];
    this.mType = Max.MessageType.INVITATION;
    return this;
};

/**
 * Accept or deny the invite to the channel.
 * @param {boolean} accepted True to accept the invitation.
 * @param {string} [comments] An optional custom message to return to the sender.
 * @returns {Max.Promise.<string>} A promise object returning messageId or reason of failure.
 * @private
 */
Max.Invite.prototype.respond = function(accepted, comments) {
    var self = this, msg;
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);
        if (!self.channel) return def.reject(Max.Error.INVALID_CHANNEL);
        if (accepted === null || typeof accepted === 'undefined') return def.reject(Max.Error.INVALID_ACCEPTED);

        self.invitationMeta.inviteResponseText = comments;
        self.invitationMeta.inviteIsAccepted = accepted + '';

        msg = new Max.Message(self.invitationMeta, self.sender);
        msg.mType = Max.MessageType.INVITATION_RESPONSE;

        msg.send().success(function() {
            if (!accepted) return def.resolve.apply(def, arguments);

            self.channel.subscribe().success(function() {
                def.resolve.apply(def, arguments);
            }).error(function() {
                def.reject.apply(def, arguments);
            });
        }).error(function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Accept the invite to the channel and start receiving messages published to the channel.
 * @param {string} [comments] An optional custom message to return to the sender.
 * @returns {Max.Promise.<string>} A promise object returning messageId or reason of failure.
 */
Max.Invite.prototype.accept = function(comments) {
    return this.respond(true, comments);
};

/**
 * Decline the invite to the channel.
 * @param {string} [comments] An optional custom message to return to the sender.
 * @returns {Max.Promise.<string>} A promise object returning messageId or reason of failure.
 */
Max.Invite.prototype.decline = function(comments) {
    return this.respond(false, comments);
};

/**
 * @constructor
 * @class
 * A {Max.InviteResponse} is received from the {Max.EventListener} when a recipient of a channel invitation sent by
 * the current user responds. This class contains information about the invitation, including whether or the user
 * accepted or declined the channel invitation.
 * @property {object|Max.User} sender The message sender.
 * @property {string} comments Invitation comments sent by the sender.
 * @property {Max.Channel} channel Channel the current user has been invited to.
 * @property {Date} timestamp The date and time this message was sent.
 * @property {boolean} accepted Indicates whether the invitation recipient accepted or declined the invitation.
 */
Max.InviteResponse = function() {
    this.meta = {};
    this.recipients = [];
    this.mType = Max.MessageType.INVITATION_RESPONSE;
    return this;
};

/**
 * @constructor
 * @class
 * The ObjectIdentifier class is returned by the {Max.EventListener} when the associated object is created in a channel which the current user is subscribed to.
 * @property {Max.MessageType} objectType An object type. Available options are {Max.MessageType.POLL}, {Max.MessageType.CHECKLIST}, and {Max.MessageType.APPROVAL}.
 * @property {string} objectId An object identifier.
 */
Max.ObjectIdentifier = function(objectType, objectId) {
    this.TYPE = Max.MessageType.OBJECT_IDENTIFIER;
    this.objectType = TYPED_PAYLOAD_CONTENT_TYPE + objectType;
    this.objectId = objectId;
};

Max.registerPayloadType(Max.MessageType.OBJECT_IDENTIFIER, Max.ObjectIdentifier);

var DEFAULT_POLL_CONFIG_NAME = 'DefaultPollConfig';
var DEFAULT_POLL_ANSWER_CONFIG_NAME = 'DefaultPollAnswerConfig';

/**
 * @constructor
 * @class
 * The Poll class is a local representation of a poll in the MagnetMax platform. This class provides various
 * poll specific methods, like creating a poll and selecting poll options.
 * @param {object} pollObj An object containing poll information.
 * @param {string} pollObj.name A user-friendly name for the poll.
 * @param {string} pollObj.question The question this poll should answer.
 * @param {Max.PollOption[]} pollObj.options A list of {Max.PollOption}.
 * @param {boolean} [pollObj.allowMultiChoice] If enabled, users can select more than one option. Defaults to true.
 * @param {boolean} [pollObj.hideResultsFromOthers] If enabled, participants cannot obtain results from the poll, and will not receive {Max.PollAnswer} when a participant chooses a poll option. The poll creator can still obtain results using {Max.Poll.get} or poll.refreshResults. Defaults to false.
 * @param {object} [pollObj.extras] A user-defined object used to store arbitrary data will can accessed from a {Max.Poll} instance.
 * @param {Date} [pollObj.endDate] Optionally, specify a date this poll ends. After a poll ends, users can no longer select options.
 * @property {string} pollId Poll identifier.
 * @property {string} name A user-friendly name of the poll.
 * @property {string} question The question this poll should answer.
 * @property {Max.PollOption[]} options The available poll selection options.
 * @property {boolean} allowMultiChoice If enabled, users can select more than one option.
 * @property {boolean} hideResultsFromOthers If enabled, participants cannot obtain results from the poll, and will not receive {Max.PollAnswer} when a participant chooses a poll option. The poll creator can still obtain results using {Max.Poll.get} or poll.refreshResults. Defaults to false.
 * @property {object} extras A user-defined object used to store arbitrary data will can accessed from a {Max.Poll} instance.
 * @property {Date} startDate The date this poll was created.
 * @property {Date} [endDate] The date this poll ends. After a poll ends, users can no longer select options.
 * @property {string} ownerId User identifier of the poll creator.
 * @property {Max.PollOption[]} [myVotes] Poll options selected by the current user, if hideResultsFromOthers was set to false.
 */
Max.Poll = function(pollObj) {
    if (pollObj.allowMultiChoice !== false && pollObj.allowMultiChoice !== true)
        pollObj.allowMultiChoice = true;

    if (pollObj.hideResultsFromOthers !== false && pollObj.hideResultsFromOthers !== true)
        pollObj.hideResultsFromOthers = false;

    pollObj.extras = pollObj.extras || {};
    this.TYPE = Max.MessageType.POLL;
    this.startDate = new Date();

    Max.Utils.mergeObj(this, pollObj);
    return this;
};

/**
 * Get a {Max.Poll} by identifier.
 * @param {string} pollId Poll identifier.
 * @returns {Max.Promise.<Max.Poll>} A promise object returning a {Max.Poll} or reason of failure.
 */
Max.Poll.get = function(pollId) {
    var def = new Max.Deferred(), poll, paths;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!pollId) return def.reject(Max.Error.INVALID_POLL_ID);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/surveys/survey/' + pollId + '/poll/results'
        }, function(data, details) {
            poll = Max.PollHelper.surveyToPoll(data.survey, data.summary, data.myAnswers);
            paths = poll.channelIdentifier.split('#');

            Max.Channel.getChannel(paths[1] || paths[0], paths[1] ? paths[0] : null).success(function(channel) {
                poll.channel = channel;
                def.resolve(poll, details);
            }).error(function() {
                def.reject.apply(def, arguments);
            });
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Find {Max.Poll}.
 * Get all polls related to the current user, with ability to filter by creator and whether a poll has replies.
 * @param {string} [searchQuery] Filter results to only return polls with title or description containing the given input.
 * @param {Max.ObjectCreator} [pollCreator] Filter results to only return polls created by certain users. Defaults to 'ALL'.
 * @param {Max.ObjectStatus} [pollStatus] Filter results to only return polls which have been replied to. Defaults to 'ALL'.
 * @param {number} [limit] The number of results to return per page. Default is 10.
 * @param {number} [offset] The starting index of results.
 * @returns {Max.Promise.<Max.Poll[]>} A promise object returning a list of {Max.Poll} or reason of failure.
 * @ignore
 */
Max.Poll.findPolls = function(searchQuery, pollCreator, pollStatus, limit, offset) {
    var def = new Max.Deferred(), polls = [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (pollCreator && !Max.ObjectCreator[pollCreator]) return def.reject(Max.Error.INVALID_CREATOR_TYPE);
        if (pollStatus && !Max.ObjectStatus[pollStatus]) return def.reject(Max.Error.INVALID_OBJECT_STATUS);
        offset = offset || 0;
        limit = limit || 10;
        pollCreator = pollCreator || Max.ObjectCreator.ALL;
        pollStatus = pollStatus || Max.ObjectStatus.ALL;

        query = ((searchQuery ? ('&query=' + searchQuery) : '') +
            (pollCreator ? ('&postedByMe=' + pollCreator) : '') +
            (pollStatus ? ('&replied=' + pollStatus) : '') +
            '&type=POLL' +
            '&offset=' + offset +
            '&limit=' + limit).replace('&', '?');

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/surveys/survey/results' + query
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                polls.push(Max.PollHelper.surveyToPoll(data[i].survey, data[i].summary, data[i].myAnswers));
            }

            def.resolve(polls, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Types of users who created the object.
 * @readonly
 * @enum {string}
 */
Max.ObjectCreator = {
    POSTED_BY_ME: 'POSTED_BY_ME',
    POSTED_BY_OTHERS: 'POSTED_BY_OTHERS',
    ALL: 'ALL'
};

/**
 * Types of object statuses to determine whether the object has replies.
 * @readonly
 * @enum {string}
 */
Max.ObjectStatus = {
    REPLIED: 'REPLIED',
    NOT_REPLIED: 'NOT_REPLIED',
    ALL: 'ALL'
};

/**
 * Get a summary of all polls associated with the current user.
 * @returns {Max.Promise.<object>} A promise object returning an object containing poll summary or reason of failure.
 */
Max.Poll.getPollDetails = function() {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/surveys/poll/summary'
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Publish a {Max.Poll} to the given channel.
 * @param {Max.Channel} channel A {Max.Channel} instance of the channel which will receive the poll.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} published to the channel or reason of failure.
 */
Max.Poll.prototype.publish = function(channel) {
    var self = this, survey, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!channel || !channel.getChannelId)
            return def.reject(Max.Error.INVALID_CHANNEL);
        if (!self.name)
            return def.reject(Max.Error.INVALID_POLL_NAME);
        if (!self.question)
            return def.reject(Max.Error.INVALID_POLL_QUESTION);
        if (!self.options || !self.options.length)
            return def.reject(Max.Error.INVALID_POLL_OPTIONS);
        if (self.endDate && self.endDate < new Date())
            return def.reject(Max.Error.INVALID_END_DATE);

        survey = Max.PollHelper.pollToSurvey(self, channel);

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/surveys/survey',
            data: survey
        }, function (data) {
            self.pollId = data.id;
            self.questionId = data.surveyDefinition.questions[0].questionId;
            self.channel = channel;
            self.channelIdentifier = channel.getChannelId();
            self.ownerId = mCurrentUser.userId;

            for (var i=0;i<self.options.length;++i) {
                self.options[i].pollId = self.pollId;
                self.options[i].optionId = data.surveyDefinition.questions[0].choices[i];
            }

            var msg = new Max.Message({
                question: self.question
            }, null, null, DEFAULT_POLL_CONFIG_NAME)
                .addPayload(new Max.ObjectIdentifier(Max.MessageType.POLL, self.pollId));

            channel.publish(msg).success(function(data, details) {
                def.resolve(msg, details);
            }).error(function() {
                def.reject.apply(def, arguments);
            });
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Choose options for a poll and publish a message to the channel.
 * @param {Max.PollOption|Max.PollOption[]} [pollOptions] One or more {Max.PollOption}. If no options are passed, all votes are removed.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} published to the channel or reason of failure.
 */
Max.Poll.prototype.choose = function(pollOptions) {
    var self = this, def = new Max.Deferred(), previousOpts = [], pollAnswer;
    var surveyAnswers = {pollId: self.pollId, answers: []};
    self.myVotes = self.myVotes || [];

    pollOptions = pollOptions || [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!self.allowMultiChoice && pollOptions && pollOptions.length && pollOptions.length > 1)
            return def.reject(Max.Error.TOO_MANY_POLL_OPTIONS);
        if (self.endDate < new Date())
            return def.reject(Max.Error.POLL_ENDED);

        if (!Max.Utils.isArray(pollOptions))
            pollOptions = [pollOptions];

        previousOpts = self.myVotes.splice(0);

        for (var i=0;i<pollOptions.length;++i) {
            surveyAnswers.answers.push({
                text: pollOptions[i].text,
                questionId: self.questionId,
                selectedOptionId: pollOptions[i].optionId
            });
        }

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/surveys/answers/' + self.pollId,
            data: surveyAnswers
        }, function() {
            pollAnswer = new Max.PollAnswer(self, previousOpts, pollOptions, mCurrentUser.userId);
            self.myVotes = pollOptions;

            if (!self.hideResultsFromOthers) {
                self.updateResults(pollAnswer, true);

                var msg = new Max.Message({
                    question: self.question
                }, null, null, DEFAULT_POLL_ANSWER_CONFIG_NAME).addPayload(pollAnswer);

                self.channel.publish(msg);
            }

            def.resolve('ok');
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Delete the current poll. Can only be deleted by the poll creator.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 * @private
 */
Max.Poll.prototype.delete = function() {
    var self = this, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (self.ownerId != mCurrentUser.userId) return def.reject(Max.Error.FORBIDDEN);

        Max.Request({
            method: 'DELETE',
            url: '/com.magnet.server/surveys/survey/' + self.pollId
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Update poll results using a poll answer.
 * @param {Max.PollAnswer} pollAnswer A poll answer.
 */
Max.Poll.prototype.updateResults = function(pollAnswer, forceUpdate) {
    var optsObj = {}, i;

    if ((!pollAnswer.previousSelection.length && !pollAnswer.currentSelection.length)
      || (!forceUpdate && mCurrentUser && pollAnswer.userId == mCurrentUser.userId)) return;

    for (i=0;i<this.options.length;++i) {
        optsObj[this.options[i].optionId] = i;
    }

    for (i=0;i<pollAnswer.previousSelection.length;++i) {
        --this.options[optsObj[pollAnswer.previousSelection[i].optionId]].count;
    }
    for (i=0;i<pollAnswer.currentSelection.length;++i) {
        ++this.options[optsObj[pollAnswer.currentSelection[i].optionId]].count;
    }
};

/**
 * Refresh the poll results.
 * @returns {Max.Promise.<Max.Poll>} A promise object returning the updated {Max.Poll} or reason of failure.
 */
Max.Poll.prototype.refreshResults = function() {
    var self = this, def = new Max.Deferred();

    Max.Poll.get(self.pollId).success(function(poll) {
        self.myVotes = poll.myVotes;
        self.options = poll.options;
        def.resolve.apply(def, arguments);
    }).error(function() {
        def.reject.apply(def, arguments);
    });

    return def.promise;
};

/**
 * @constructor
 * @class
 * The PollOption class is a local representation of a poll option in the MagnetMax platform. A {Max.PollOption} instance contains information about the poll option.
 * @property {string} pollId Poll identifier.
 * @property {string} optionId Poll option identifier.
 * @property {string} text A user-friendly answer to the {Max.Poll} question.
 * @property {object} extras A user-defined object used to store arbitrary data related to the current poll option.
 * @property {number} count The current number of votes cast towards this poll option. Only available if the related {Max.Poll} was created with hideResultsFromOthers set to false.
 */
Max.PollOption = function(text, extras) {
    if (!text) throw('invalid text');

    this.TYPE = Max.MessageType.POLL_OPTION;
    this.text = text;
    this.extras = extras || {};
    this.count = 0;

    return this;
};

/**
 * @constructor
 * @class
 * The PollAnswer class is returned by the {Max.EventListener} after a user selects a poll option. It contains all the {Max.PollOption} selected by the user.
 * @property {string} pollId {Max.Poll} identifier.
 * @property {string} name Name of the poll.
 * @property {string} question The question this poll should answer.
 * @property {Max.PollOption[]} previousSelection The previous list of poll options selected by the current user.
 * @property {Max.PollOption[]} currentSelection The current list of poll options selected by the current user.
 * @property {string} userId Identifier of the user who answered the poll.
 */
Max.PollAnswer = function(poll, previousSelection, currentSelection, userId) {
    poll = poll || {};
    this.TYPE = Max.MessageType.POLL_ANSWER;
    this.pollId = poll.pollId;
    this.name = poll.name;
    this.question = poll.question;
    this.previousSelection = previousSelection || [];
    this.currentSelection = currentSelection || [];
    this.userId = userId;
};

Max.registerPayloadType(Max.MessageType.POLL, Max.Poll);
Max.registerPayloadType(Max.MessageType.POLL_OPTION, Max.PollOption);
Max.registerPayloadType(Max.MessageType.POLL_ANSWER, Max.PollAnswer);

/**
 * @constructor
 * @class
 * Contains helper methods related to polls.
 * @private
 */
Max.PollHelper = {
    /**
     * Create {Max.Poll} from Survey.
     * @param {object} survey A Survey object.
     * @param {object[]} results A list of objects containing the number of times a {Max.PollOption} was chosen.
     * @param {object[]} myAnswers A list of objects containing choices made by the current user.
     * @returns {Max.Poll} a poll.
     */
    surveyToPoll: function(survey, results, myAnswers) {
        var choices, i, opt, myAnswerOptionIds = [], myAnswerOptions = [], pollObj = {
            options: {}
        };
        results = results || [];

        pollObj.pollId = survey.id;
        pollObj.name = survey.name;
        pollObj.question = survey.surveyDefinition.questions[0].text;
        pollObj.questionId = survey.surveyDefinition.questions[0].questionId;
        pollObj.hideResultsFromOthers = survey.surveyDefinition.resultAccessModel === 'PRIVATE';
        pollObj.allowMultiChoice = survey.surveyDefinition.questions[0].type === 'MULTI_CHOICE';
        pollObj.channelIdentifier = survey.surveyDefinition.notificationChannelId;
        pollObj.ownerId = survey.owners[0];
        pollObj.extras = survey.metaData;
        pollObj.options = [];
        choices = survey.surveyDefinition.questions[0].choices;

        if (survey.surveyDefinition.startDate)
            pollObj.startDate = Max.Utils.ISO8601ToDate(survey.surveyDefinition.startDate);

        if (survey.surveyDefinition.endDate)
            pollObj.endDate = Max.Utils.ISO8601ToDate(survey.surveyDefinition.endDate);

        if (myAnswers) {
            for (i = 0; i < myAnswers.length; ++i) {
                myAnswerOptionIds.push(myAnswers[i].selectedOptionId);
            }
        }

        for (i = 0; i < choices.length; ++i) {
            opt = new Max.PollOption(choices[i].value, choices[i].metaData);
            opt.pollId = survey.id;
            opt.optionId = choices[i].optionId;
            opt.count = (results && results[i] && typeof results[i].count !== 'undefined') ? results[i].count : null;
            opt.extras = choices[i].metaData || {};
            pollObj.options.push(opt);
            if (myAnswerOptionIds.indexOf(opt.optionId) != -1)
                myAnswerOptions.push(opt);
        }

        if (myAnswerOptions.length)
            pollObj.myVotes = myAnswerOptions;

        if (pollObj.channelIdentifier) {
            pollObj.channel = Max.ChannelHelper.channelIdToChannel(pollObj.channelIdentifier);
        }

        return new Max.Poll(pollObj);
    },
    /**
     * Create Survey from {Max.Poll}.
     * @param {Max.Poll} poll A poll.
     * @param {Max.Channel} channel A channel.
     * @returns {object} A survey.
     */
    pollToSurvey: function(poll, channel) {
        var survey = {};

        survey.name = poll.name;
        survey.owners = [mCurrentUser.userId];
        survey.metaData = poll.extras;
        survey.surveyDefinition = {
            resultAccessModel: poll.hideResultsFromOthers ? 'PRIVATE' : 'PUBLIC',
            type: 'POLL',
            notificationChannelId: channel.getChannelId(),
            startDate: poll.startDate,
            endDate: poll.endDate,
            questions: this.pollOptionToSurveyQuestions(poll),
            participantModel: 'PRIVATE' // for user access control
        };
        if (poll.startDate) {
            survey.surveyDefinition.startDate = Max.Utils.dateToISO8601(poll.startDate);
        }
        if (poll.endDate) {
            survey.surveyDefinition.endDate = Max.Utils.dateToISO8601(poll.endDate);
        }
        return survey;
    },
    /**
     * Get a list of Survey questions from {Max.Poll}.
     * @param {object} poll A poll.
     * @returns {object[]} A list of survey questions.
     */
    pollOptionToSurveyQuestions: function(poll) {
        var opts = poll.options, questions = [], choices = [];

        for (var i=0; i<opts.length; ++i) {
            choices.push({
                value: opts[i].text,
                displayOrder: i,
                metaData: opts[i].extras
            });
        }
        questions.push({
            text: poll.question,
            choices: choices,
            displayOrder: 0,
            type: poll.allowMultiChoice ? 'MULTI_CHOICE' : 'SINGLE_CHOICE'
        });
        return questions;
    }
};

/**
 * @constructor
 * @class
 * The Checklist class is a local representation of a checklist in the MagnetMax platform. This class provides various
 * checklist specific methods, like creating a checklist and selecting checklist items.
 * @param {object} checklistObj An object containing checklist information.
 * @param {string} checklistObj.name A user-friendly name for the checklist.
 * @param {string} checklistObj.subject The topic of this checklist.
 * @param {Max.ChecklistItem[]} checklistObj.items A list of {Max.ChecklistItem}.
 * @param {object} [checklistObj.extras] A user-defined object used to store arbitrary data will can accessed from a {Max.Checklist} instance.
 * @param {Date} [checklistObj.endDate] Optionally, specify a date this checklist ends. After a checklist ends, users can no longer select items.
 * @property {string} checklistId Checklist identifier.
 * @property {string} name A user-friendly name of the checklist.
 * @property {string} subject The topic of this checklist.
 * @property {Max.ChecklistItem[]} items The available checklist selection items.
 * @property {object} extras A user-defined object used to store arbitrary data will can accessed from a {Max.Checklist} instance.
 * @property {Date} startDate The date this checklist was created.
 * @property {Date} [endDate] The date this checklist ends. After a checklist ends, users can no longer select items.
 * @property {string} ownerId User identifier of the checklist creator.
 * @property {Max.ChecklistItem[]} [mySelections] Checklist items selected by the current user.
 */
Max.Checklist = function(checklistObj) {
    checklistObj.extras = checklistObj.extras || {};
    this.TYPE = Max.MessageType.CHECKLIST;
    this.startDate = new Date();

    Max.Utils.mergeObj(this, checklistObj);
    return this;
};

/**
 * Get a {Max.Checklist} by identifier.
 * @param {string} checklistId Checklist identifier.
 * @returns {Max.Promise.<Max.Checklist>} A promise object returning a {Max.Checklist} or reason of failure.
 */
Max.Checklist.get = function(checklistId) {
    var def = new Max.Deferred(), checklist, paths;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!checklistId) return def.reject(Max.Error.INVALID_CHECKLIST_ID);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/surveys/survey/' + checklistId + '/poll/results'
        }, function(data, details) {
            checklist = Max.ChecklistHelper.surveyToChecklist(data.survey, data.summary, data.myAnswers);
            paths = checklist.channelIdentifier.split('#');

            Max.Channel.getChannel(paths[1] || paths[0], paths[1] ? paths[0] : null).success(function(channel) {
                checklist.channel = channel;
                def.resolve(checklist, details);
            }).error(function() {
                def.reject.apply(def, arguments);
            });
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get all checklists related to the current user, with ability to filter by creator and whether a checklist has replies.
 * @param {string} [searchQuery] Filter results to only return checklists with title or description containing the given input.
 * @param {Max.ObjectCreator} [checklistCreator] Filter results to only return checklist created by certain users. Defaults to 'ALL'.
 * @param {Max.ObjectStatus} [checklistStatus] Filter results to only return checklist which have been replied to. Defaults to 'ALL'.
 * @param {number} [limit] The number of results to return per page. Default is 10.
 * @param {number} [offset] The starting index of results.
 * @returns {Max.Promise.<Max.Checklist[]>} A promise object returning a list of {Max.Checklist} or reason of failure.
 * @ignore
 */
Max.Checklist.findChecklists = function(searchQuery, checklistCreator, checklistStatus, limit, offset) {
    var def = new Max.Deferred(), checklists = [], query;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (checklistCreator && !Max.ObjectCreator[checklistCreator]) return def.reject(Max.Error.INVALID_CREATOR_TYPE);
        if (checklistStatus && !Max.ObjectStatus[checklistStatus]) return def.reject(Max.Error.INVALID_OBJECT_STATUS);
        offset = offset || 0;
        limit = limit || 10;
        checklistCreator = checklistCreator || Max.ObjectCreator.ALL;
        checklistStatus = checklistStatus || Max.ObjectStatus.ALL;

        query = ((searchQuery ? ('&query=' + searchQuery) : '') +
            (checklistCreator ? ('&postedByMe=' + checklistCreator) : '') +
            (checklistStatus ? ('&replied=' + checklistStatus) : '') +
            '&type=CHECKLIST' +
            '&offset=' + offset +
            '&limit=' + limit).replace('&', '?');

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/surveys/survey/results' + query
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                checklists.push(Max.ChecklistHelper.surveyToChecklist(data[i].survey, data[i].summary, data[i].myAnswers));
            }

            def.resolve(checklists, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get a summary of all checklists associated with the current user.
 * @returns {Max.Promise.<object>} A promise object returning an object containing checklist summary or reason of failure.
 */
Max.Checklist.getChecklistDetails = function() {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/surveys/checklist/summary'
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Publish a {Max.Checklist} to the given channel.
 * @param {Max.Channel} channel A {Max.Channel} instance of the channel which will receive the checklist.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} published to the channel or reason of failure.
 */
Max.Checklist.prototype.publish = function(channel) {
    var self = this, survey, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!channel || !channel.getChannelId)
            return def.reject(Max.Error.INVALID_CHANNEL);
        if (!self.name)
            return def.reject(Max.Error.INVALID_CHECKLIST_NAME);
        if (!self.subject)
            return def.reject(Max.Error.INVALID_SUBJECT);
        if (!self.items || !self.items.length)
            return def.reject(Max.Error.INVALID_CHECKLIST_OPTIONS);
        if (self.endDate && self.endDate < new Date())
            return def.reject(Max.Error.INVALID_END_DATE);

        survey = Max.ChecklistHelper.checklistToSurvey(self, channel);

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/surveys/survey',
            data: survey
        }, function (data) {
            self.checklistId = data.id;
            self.subjectId = data.surveyDefinition.questions[0].questionId;
            self.channel = channel;
            self.channelIdentifier = channel.getChannelId();
            self.ownerId = mCurrentUser.userId;

            for (var i=0;i<self.items.length;++i) {
                self.items[i].checklistId = self.checklistId;
                self.items[i].itemId = data.surveyDefinition.questions[0].choices[i];
            }

            var msg = new Max.Message({
                subject: self.subject
            }, null, null, DEFAULT_POLL_CONFIG_NAME)
                .addPayload(new Max.ObjectIdentifier(Max.MessageType.CHECKLIST, self.checklistId));

            channel.publish(msg).success(function(data, details) {
                def.resolve(msg, details);
            }).error(function() {
                def.reject.apply(def, arguments);
            });
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Select and deselect checklist items and publish a message to the channel.
 * @param {Max.ChecklistItem|Max.ChecklistItem[]} [selectedItems] All of the currently selected {Max.ChecklistItem}.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} published to the channel or reason of failure.
 */
Max.Checklist.prototype.select = function(selectedItems, newItems) {
    var self = this, def = new Max.Deferred(), selectedItemIds, userSelectedItems = [], userDeselectedItems = [],
        checklistSelection, i;
    var surveyAnswers = {pollId: self.checklistId, answers: []};
    self.mySelections = self.mySelections || [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (self.endDate < new Date()) return def.reject(Max.Error.CHECKLIST_ENDED);

        if (!Max.Utils.isArray(selectedItems))
            selectedItems = selectedItems ? [selectedItems] : [];

        if (newItems) {
            if (!Max.Utils.isArray(newItems)) newItems = [newItems];
            if (newItems.length) {
                surveyAnswers.customAnswers = [];
                for (i=0;i<newItems.length;++i) {
                    if (newItems[i].length) {
                        surveyAnswers.customAnswers.push(newItems[i]);
                    }
                }
            }
        }

        selectedItemIds = Max.ChecklistHelper.aryToItemIdObj(selectedItems);

        for (i=0;i<self.items.length;++i) {
            if (selectedItemIds[self.items[i].itemId]) {
                if (!self.items[i].selected) {
                    userSelectedItems.push(self.items[i]);
                }
                self.items[i].selected = true;

                surveyAnswers.answers.push({
                    text: self.items[i].text,
                    questionId: self.subjectId,
                    selectedOptionId: self.items[i].itemId
                });
            } else {
                if (self.items[i].selected) {
                    userDeselectedItems.push(self.items[i]);
                }
                self.items[i].selected = false;
            }
        }

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/surveys/answers/' + self.checklistId,
            data: surveyAnswers
        }, function() {
            checklistSelection = new Max.ChecklistSelection(self, userSelectedItems, userDeselectedItems,
                newItems, mCurrentUser.userId);
            self.mySelections = userSelectedItems;

            var msg = new Max.Message({
                subject: self.subject
            }, null, null, DEFAULT_POLL_ANSWER_CONFIG_NAME).addPayload(checklistSelection);

            self.channel.publish(msg);

            def.resolve('ok');
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Add items to an existing checklist.
 * @param {string|string[]} items One or more items to add to the checklist.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} published to the channel or reason of failure.
 */
Max.Checklist.prototype.addItems = function(items) {
    var selectedItems = [];
    for (i=0;i<this.items.length;++i) {
        if (this.items[i].selected) selectedItems.push(this.items[i]);
    }

    return this.select(selectedItems, items);
};

/**
 * Delete the current checklist. Can only be deleted by the checklist creator.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 * @private
 */
Max.Checklist.prototype.delete = function() {
    var self = this, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (self.ownerId != mCurrentUser.userId) return def.reject(Max.Error.FORBIDDEN);

        Max.Request({
            method: 'DELETE',
            url: '/com.magnet.server/surveys/survey/' + self.checklistId
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Update checklist state using a checklist selection.
 * @param {ChecklistSelection} checklistSelection A checklist selection.
 */
Max.Checklist.prototype.updateResults = function(checklistSelection, forceUpdate) {
    var optsObj, i;

    if ((!checklistSelection.selectedItems.length && !checklistSelection.deselectedItems.length)
      || (!forceUpdate && mCurrentUser && checklistSelection.userId == mCurrentUser.userId)) return;

    optsObj = Max.ChecklistHelper.aryToItemIdObj(this.items, true);

    for (i=0;i<checklistSelection.deselectedItems.length;++i) {
        this.items[optsObj[checklistSelection.deselectedItems[i].itemId]].selected = false;
    }
    for (i=0;i<checklistSelection.selectedItems.length;++i) {
        this.items[optsObj[checklistSelection.selectedItems[i].itemId]].selected = true;
    }
};

/**
 * Refresh the checklist results.
 * @returns {Max.Promise.<Max.Checklist>} A promise object returning the updated {Max.Checklist} or reason of failure.
 */
Max.Checklist.prototype.refreshResults = function() {
    var self = this, def = new Max.Deferred();

    Max.Checklist.get(self.checklistId).success(function(checklist) {
        self.mySelections = checklist.mySelections;
        self.items = checklist.items;
        def.resolve.apply(def, arguments);
    }).error(function() {
        def.reject.apply(def, arguments);
    });

    return def.promise;
};

/**
 * @constructor
 * @class
 * The ChecklistItem class is a local representation of a checklist item in the MagnetMax platform. A {Max.ChecklistItem} instance contains information about the checklist item.
 * @property {string} checklistId Checklist identifier.
 * @property {string} itemId Checklist item identifier.
 * @property {string} text A user-friendly item description.
 * @property {object} extras A user-defined object used to store arbitrary data related to the current checklist item.
 * @property {boolean} selected The current selection state of this checklist item.
 */
Max.ChecklistItem = function(text, extras) {
    if (!text) throw('invalid text');

    this.TYPE = Max.MessageType.CHECKLIST_ITEM;
    this.text = text;
    this.extras = extras || {};
    this.selected = false;

    return this;
};

/**
 * @constructor
 * @class
 * The ChecklistSelection class is returned by the {Max.EventListener} after a user selects a checklist item. It contains all the {Max.ChecklistItem} selected by the user.
 * @property {string} checklistId {Max.Checklist} identifier.
 * @property {string} name Name of the checklist.
 * @property {string} subject The subject of this checklist.
 * @property {Max.ChecklistItem[]} selectedItems The list of checklist items selected by the current user.
 * @property {Max.ChecklistItem[]} deselectedItems The list of checklist items deselected by the current user.
 * @property {string[]} [newItems] New items added to the checklist.
 * @property {string} userId Identifier of the user who answered the checklist.
 */
Max.ChecklistSelection = function(checklist, selectedItems, deselectedItems, newItems, userId) {
    checklist = checklist || {};
    this.TYPE = Max.MessageType.CHECKLIST_SELECTION;
    this.checklistId = checklist.checklistId;
    this.name = checklist.name;
    this.subject = checklist.subject;
    this.selectedItems = selectedItems || [];
    this.deselectedItems = deselectedItems || [];
    this.userId = userId;
    this.newItems = newItems;
};

Max.registerPayloadType(Max.MessageType.CHECKLIST, Max.Checklist);
Max.registerPayloadType(Max.MessageType.CHECKLIST_ITEM, Max.ChecklistItem);
Max.registerPayloadType(Max.MessageType.CHECKLIST_SELECTION, Max.ChecklistSelection);

/**
 * @constructor
 * @class
 * Contains helper methods related to checklists.
 * @private
 */
Max.ChecklistHelper = {
    /**
     * Create {Max.Checklist} from Survey.
     * @param {object} survey A Survey object.
     * @param {object[]} results A list of objects containing the number of times a {Max.ChecklistItem} was chosen.
     * @param {object[]} mySelections A list of objects containing choices made by the current user.
     * @returns {Max.Checklist} a checklist.
     */
    surveyToChecklist: function(survey, results, mySelections) {
        var choices, i, opt, myAnswerOptionIds = [], myAnswerOptions = [], checklistObj = {
            items: {}
        };
        results = results || [];

        checklistObj.checklistId = survey.id;
        checklistObj.name = survey.name;
        checklistObj.subject = survey.surveyDefinition.questions[0].text;
        checklistObj.subjectId = survey.surveyDefinition.questions[0].questionId;
        checklistObj.channelIdentifier = survey.surveyDefinition.notificationChannelId;
        checklistObj.ownerId = survey.owners[0];
        checklistObj.extras = survey.metaData;
        checklistObj.items = [];
        choices = survey.surveyDefinition.questions[0].choices;

        if (survey.surveyDefinition.startDate)
            checklistObj.startDate = Max.Utils.ISO8601ToDate(survey.surveyDefinition.startDate);

        if (survey.surveyDefinition.endDate)
            checklistObj.endDate = Max.Utils.ISO8601ToDate(survey.surveyDefinition.endDate);

        if (mySelections) {
            for (i = 0; i < mySelections.length; ++i) {
                myAnswerOptionIds.push(mySelections[i].selectedOptionId);
            }
        }

        for (i = 0; i < choices.length; ++i) {
            opt = new Max.ChecklistItem(choices[i].value, choices[i].metaData);
            opt.checklistId = survey.id;
            opt.itemId = choices[i].optionId;
            opt.selected = (results && results[i] && typeof results[i].count !== 'undefined' && results[i].count) ? true : false;
            opt.extras = choices[i].metaData || {};
            checklistObj.items.push(opt);
            if (myAnswerOptionIds.indexOf(opt.itemId) != -1)
                myAnswerOptions.push(opt);
        }

        if (myAnswerOptions.length)
            checklistObj.mySelections = myAnswerOptions;

        if (checklistObj.channelIdentifier) {
            checklistObj.channel = Max.ChannelHelper.channelIdToChannel(checklistObj.channelIdentifier);
        }

        return new Max.Checklist(checklistObj);
    },
    /**
     * Create Survey from {Max.Checklist}.
     * @param {Max.Checklist} checklist A checklist.
     * @param {Max.Channel} channel A channel.
     * @returns {object} A survey.
     */
    checklistToSurvey: function(checklist, channel) {
        var survey = {};

        survey.name = checklist.name;
        survey.owners = [mCurrentUser.userId];
        survey.metaData = checklist.extras;
        survey.surveyDefinition = {
            resultAccessModel: 'PUBLIC',
            type: 'CHECKLIST',
            notificationChannelId: channel.getChannelName(),
            startDate: checklist.startDate,
            endDate: checklist.endDate,
            questions: this.checklistOptionToSurveyQuestions(checklist),
            participantModel: 'PRIVATE' // for user access control
        };
        if (checklist.startDate) {
            survey.surveyDefinition.startDate = Max.Utils.dateToISO8601(checklist.startDate);
        }
        if (checklist.endDate) {
            survey.surveyDefinition.endDate = Max.Utils.dateToISO8601(checklist.endDate);
        }
        return survey;
    },
    /**
     * Get a list of Survey questions from {Max.Checklist}.
     * @param {object} checklist A checklist.
     * @returns {object[]} A list of survey questions.
     */
    checklistOptionToSurveyQuestions: function(checklist) {
        var opts = checklist.items, questions = [], choices = [];

        for (var i=0; i<opts.length; ++i) {
            choices.push({
                value: opts[i].text,
                displayOrder: i,
                metaData: opts[i].extras
            });
        }
        questions.push({
            text: checklist.subject,
            choices: choices,
            displayOrder: 0,
            type: 'MULTI_CHOICE'
        });
        return questions;
    },
    /**
     * Given an array of {Max.ChecklistItem}, return an object of item ids.
     * @param {Max.ChecklistItem[]} items An array of {Max.ChecklistItem}.
     * @param {boolean} [useIndex] Set to true for the object property to be the index.
     * @returns {object} An object containing item ids.
     */
    aryToItemIdObj: function(items, useIndex) {
        var obj = {};
        for (var i=0;i<items.length;++i) {
            obj[items[i].itemId] = useIndex ? i : true;
        }
        return obj;
    }
};

/**
 * @constructor
 * @class
 * The Channel class is the local representation of a channel. This class provides various channel specific methods, like publishing and subscribing users.
 * @property {string} channelId The identifier of the channel.
 * @property {string} name The name of the channel.
 * @property {boolean} isPublic True if the channel public.
 * @property {boolean} isSubscribed True if the current user is subscribed to the channel.
 * @property {string} [summary] An optional summary of the channel.
 * @property {string} [publishPermissions] Permissions level required to be able to post, must be in ['anyone', 'owner', 'subscribers']. The channel owner can always publish.
 * @property {string} [ownerUserId] The userId for the owner/creator of the channel.
 * @property {boolean} isMuted True if the channel was muted for the current user. Muted channels will not receive any messages published to the channel.
 * @property {Date} [mutedUntil] The date when the channel will become unmuted, or null if it is not muted.
 */
Max.Channel = function(channelObj) {
    var channelAry;
    this.isMuted = false;
    this.mutedUntil = null;
    this.isSubscribed = false;

    channelObj.ownerUserId = channelObj.ownerUserId || channelObj.ownerUserID;

    if (channelObj.topicName) {
        delete channelObj.topicName;
    }
    if (channelObj.creator && channelObj.creator.indexOf('%') != -1)
        channelObj.creator = channelObj.creator.split('%')[0];
    if (channelObj.creator) {
        channelObj.ownerUserId = channelObj.creator;
        delete channelObj.creator;
    }
    if (channelObj.userId) {
        channelObj.ownerUserId = channelObj.userId;
    }
    if (channelObj.description) {
        channelObj.summary = channelObj.description;
        delete channelObj.description;
    }
    if (channelObj.publisherType) {
        channelObj.publishPermissions = channelObj.publisherType;
        delete channelObj.publisherType;
    }
    if (channelObj.publishPermission) {
        channelObj.publishPermissions = channelObj.publishPermission;
        delete channelObj.publishPermission;
    }
    if (channelObj.privateChannel !== false && channelObj.privateChannel !== true)
        channelObj.privateChannel = channelObj.userId ? true : false;
    if (channelObj.privateChannel === true)
        channelObj.userId = channelObj.userId || channelObj.ownerUserId;
    if (channelObj.privateChannel === false)
        delete channelObj.userId;

    if (typeof channelObj.isSubscribed === 'undefined')
        channelObj.isSubscribed = false;

    channelObj.isPublic = !channelObj.privateChannel;
    delete channelObj.privateChannel;

    channelObj.isMuted = channelObj.isPushMutedByUser;
    delete channelObj.isPushMutedByUser;

    if (channelObj.isMuted && channelObj.pushMutedUntil) {
        channelObj.mutedUntil = Max.Utils.ISO8601ToDate(channelObj.pushMutedUntil);
    }
    delete channelObj.pushMutedUntil;

    Max.Utils.mergeObj(this, channelObj);

    this.channelId = channelObj.topicId || this.getChannelId();
    channelAry = (this.channelId || '').split('#');
    this.name = channelAry[1] || channelAry[0];
    delete this.topicId;

    return this;
};

/**
 * Find public channels based on search criteria.
 * @param {string} [channelName] A channel prefix to find all channels starting with the given string, or null to return all.
 * @param {number} [limit] The number of users to return in the request. Defaults to 10.
 * @param {number} [offset]	The starting index of users to return.
 * @returns {Max.Promise.<Max.Channel[]>} A promise object returning a list of {Max.Channel} or reason of failure.
 */
Max.Channel.findPublicChannels = function(channelName, limit, offset) {
    return Max.Channel.findChannels(channelName, null, limit, offset, 'public');
};

/**
 * Find private channels based on search criteria. Only private channels created by the current user will be returned.
 * @param {string} [channelName] A channel prefix to find all channels starting with the given string, or null to return all.
 * @param {number} [limit] The number of users to return in the request. Defaults to 10.
 * @param {number} [offset]	The starting index of users to return.
 * @returns {Max.Promise.<Max.Channel[]>} A promise object returning a list of {Max.Channel} or reason of failure.
 */
Max.Channel.findPrivateChannels = function(channelName, limit, offset) {
    return Max.Channel.findChannels(channelName, null, limit, offset, 'private');
};

/**
 * Find channels which contain any of the specified tags. Only private channels created by the current user will be returned.
 * @param {string[]} [tags] An array of tags to filter by.
 * @param {number} [limit] The number of users to return in the request. Defaults to 10.
 * @param {number} [offset]	The starting index of users to return.
 * @returns {Max.Promise.<Max.Channel[]>} A promise object returning a list of {Max.Channel} or reason of failure.
 */
Max.Channel.findByTags = function(tags, limit, offset) {
    return Max.Channel.findChannels(null, tags, limit, offset, 'both');
};

/**
 * Find public or private channels that start with the specified text. Only private channels created by the current user will be returned.
 * @param {string} [channelName] A channel prefix to find all channels starting with the given string, or null to return all.
 * @param {string[]} [tags] An array of tags to filter by.
 * @param {number} [limit] The number of users to return in the request. Defaults to 10.
 * @param {number} [offset]	The starting index of users to return.
 * @param {string} [type] The type of search. Must be in ['private', 'public', 'both']. Defaults to both.
 * @returns {Max.Promise.<Max.Channel[]>} A promise object returning a list of {Max.Channel} or reason of failure.
 * @private
 */
Max.Channel.findChannels = function(channelName, tags, limit, offset, type) {
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();
    var channels = [];
    limit = limit || 10;
    offset = offset || 0;
    type = type || 'both';
    type = type == 'private' ? 'personal' : type;
    type = type == 'public' ? 'global' : type;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            operator: 'AND',
            limit: limit,     // -1 for max # of records imposed by system, or > 0
            offset: offset,
            type: type
        };
        if (channelName)
            mmxMeta.topicName = {
                match: 'PREFIX',
                value: channelName
            };
        if (tags && tags.length)
            mmxMeta.tags = {
                match: 'EXACT',
                values: tags
            };
        /*
            description: {
                match: EXACT|PREFIX|SUFFIX,     // optional
                value: topic description
            },
            t
         */

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'get', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'searchTopic', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var payload, json = x2js.xml2json(msg);
            json = json || {};

            payload = (json.mmx && json.mmx.__text) ? JSON.parse(json.mmx.__text) : JSON.parse(json.mmx || {});
            if (!payload || !payload.results || !payload.results.length) return def.resolve([]);

            payload.results = Max.Utils.objToObjAry(payload.results);

            for (var i=0;i<payload.results.length;++i)
                channels.push(new Max.Channel(payload.results[i]));

            Max.Channel.setSubscriptionState(channels, function(e, channels) {
                ChannelStore.add(channels);
                def.resolve(channels);
            });
        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());
    }, 0);

    return def.promise;
};

/**
 * set subscribed flag for a list of channels
 * @private
 */
Max.Channel.setSubscriptionState = function(channelOrChannels, cb) {
    var ids = {}, i;

    function getId(obj) {
        return (obj.userId || '*') + '/' + obj.name.toLowerCase();
    }

    Max.Channel.getAllSubscriptions(true).success(function(channelObjs) {
        for (i=0;i<channelObjs.length;++i)
            ids[getId(channelObjs[i])] = true;

        if (!Max.Utils.isArray(channelOrChannels) && ids[getId(channelOrChannels)]) {
            channelOrChannels.isSubscribed = true;
        } else if (Max.Utils.isArray(channelOrChannels)) {
            for (i=0;i<channelOrChannels.length;++i) {
                if (ids[getId(channelOrChannels[i])])
                    channelOrChannels[i].isSubscribed = true;
            }
        }
        cb(null, channelOrChannels);
    }).error(function(e) {
        cb(e);
    });
};

/**
 * Create a public or private channel.
 * @param {object} channelObj An object containing channel information.
 * @param {string} channelObj.name The name of the channel.
 * @param {string} [channelObj.summary] An optional summary of the channel.
 * @param {boolean} [channelObj.isPublic] Set to true to make the channel public. Defaults to true.
 * @param {string} [channelObj.publishPermissions] Permissions level required to be able to post, must be in ['anyone', 'owner', 'subscribers']. The channel owner can always publish. Defaults to 'subscribers' only if private channel, and 'anyone' if public channel.
 * @param {string|Max.User|string[]|Max.User[]} [channelObj.subscribers] A list of userId or {Max.User} to automatically subscribe.
 * @param {string} [channelObj.pushConfigName] Optional push config name. Should match the name given when the push config was created in the Magnet Console.
 * @returns {Max.Promise.<Max.Channel>} A promise object returning the newly created {Max.Channel} or reason of failure.
 */
Max.Channel.create = function(channelObj) {
    var def = new Max.Deferred(), subscriberlist = [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!channelObj.name)
            return def.reject(Max.Error.INVALID_CHANNEL_NAME);
        if (channelObj.publishPermissions) channelObj.publishPermission = channelObj.publishPermissions;
        if (channelObj.publishPermission
            && (['anyone', 'owner', 'subscribers'].indexOf(channelObj.publishPermission) == -1))
            return def.reject(Max.Error.INVALID_PUBLISH_PERMISSIONS);

        channelObj.channelName = channelObj.name;
        channelObj.ownerId = mCurrentUser.userId;
        channelObj.privateChannel = (channelObj.isPublic === true || channelObj.isPublic === false)
            ? !channelObj.isPublic : false;
        if (channelObj.summary) channelObj.description = channelObj.summary;
        if (channelObj.privateChannel) channelObj.userId = mCurrentUser.userId;
        if (!channelObj.publishPermission && channelObj.isPublic) channelObj.publishPermission = 'anyone';
        if (!channelObj.publishPermission && !channelObj.isPublic) channelObj.publishPermission = 'subscribers';

        if (channelObj.subscribers) {
            if (!Max.Utils.isArray(channelObj.subscribers))
                channelObj.subscribers = [channelObj.subscribers];

            for (var i in channelObj.subscribers)
                subscriberlist.push(Max.Utils.isObject(channelObj.subscribers[i])
                    ? channelObj.subscribers[i].userId : channelObj.subscribers[i]);

            channelObj.subscribers = subscriberlist;
        }

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/channel/create',
            data: channelObj
        }, function (data, details) {
            delete channelObj.ownerId;
            delete channelObj.channelName;
            channelObj.creator = mCurrentUser.userId;
            channelObj.isSubscribed = true;
            channelObj.channelId = (data || {}).channelId;
            channelObj.name += '';

            def.resolve(new Max.Channel(channelObj), details);
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get all the channels the current user is the subscribed to.
 * @returns {Max.Promise.<Max.Channel[]>} A promise object returning a list of subscribed {Max.Channel} or reason of failure.
 */
Max.Channel.getAllSubscriptions = function(subscriptionOnly) {
    var def = new Max.Deferred();
    var msgId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var payload = $iq({to: 'pubsub.mmx', from: mCurrentUser.jid, type: 'get', id: msgId})
            .c('pubsub', {xmlns: 'http://jabber.org/protocol/pubsub'})
            .c('subscriptions');

        mXMPPConnection.addHandler(function(msg) {
            var json = x2js.xml2json(msg);
            var channels = [];

            if (!json.pubsub || !json.pubsub.subscriptions || !json.pubsub.subscriptions.subscription)
                return def.resolve(channels);

            var subs = Max.Utils.objToObjAry(json.pubsub.subscriptions.subscription);

            for (var i=0;i<subs.length;++i) {
                channels.push(Max.MessageHelper.nodePathToChannel(subs[i]._node));
                channels[i].isSubscribed = true;
            }

            if (subscriptionOnly) return def.resolve(channels);

            Max.Channel.getChannels(channels, true).success(function(channels) {
                Max.Channel.getSummary(channels).success(function() {
                  ChannelStore.add(channels);
                  def.resolve(channels);
                });
            }).error(function() {
                def.reject.apply(def, arguments);
            });
        }, null, null, null, msgId,  null);

        mXMPPConnection.send(payload.tree());

    }, 0);

    return def.promise;
};

/**
 * Get all the channels the current user is the subscribed to.
 * @returns {Max.Promise} A promise object returning a list of {Max.Channel} (containing basic information only) or reason of failure.
 * @ignore
 */
Max.Channel.getSummary = function(channels) {
    var def = new Max.Deferred(), topicNodes = [], t, channelIds = {};
    var msgId = Max.Utils.getCleanGUID();

    for (var i=0;i<channels.length;++i)
        topicNodes.push({
            userId: channels[i].userId,
            topicId: channels[i].channelId
        });

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicNodes: topicNodes
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'get', id: msgId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'getSummary', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var json = x2js.xml2json(msg);
            var payload;

            if (!json || !json.mmx) return def.reject(Max.Error.INVALID_CHANNEL);
            payload = JSON.parse(json.mmx);
            if (payload.message) return def.reject(payload.message);

            for (var i=0;i<payload.length;++i) {
              t = new Max.Channel({
                name: payload[i].topicNode.topicName || payload[i].topicNode.displayName,
                userId: payload[i].topicNode.userId
              });
              channelIds[t.channelId] = payload[i].lastPubTime;
            }
            for (var i=0;i<channels.length;++i) {
              if (channelIds[channels[i].channelId]) {
                channels[i].lastPubTime = Max.Utils.ISO8601ToDate(channelIds[channels[i].channelId])
              } else {
                channels[i].lastPubTime = Max.Utils.ISO8601ToDate(channels[i].creationDate);
              }
            }

            def.resolve(channels);
        }, null, null, null, msgId,  null);

        mXMPPConnection.send(payload.tree());

    }, 0);

    return def.promise;
};

/**
 * Get channels the given subscribers are subscribed to.
 * @param {string[]|Max.User[]} subscribers A list of userId or {Max.User} objects.
 * @returns {Max.Promise.<Max.Channel[]>} A promise object returning a list of {Max.Channel} (containing basic information only) or reason of failure.
 */
Max.Channel.findChannelsBySubscribers = function(subscribers) {
    var def = new Max.Deferred();
    var subscriberlist = [];
    var channels = [];

    if (!Max.Utils.isArray(subscribers))
        subscribers = [subscribers];

    for (var i in subscribers)
        subscriberlist.push(Max.Utils.isObject(subscribers[i]) ? subscribers[i].userId : subscribers[i]);

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/channel/query',
            data: {
                subscribers: subscriberlist,
                matchFilter: 'EXACT_MATCH'
            }
        }, function(data, details) {
            if (!data.channels || !data.channels.length) return  def.resolve(channels, details);

            for (var i=0;i<data.channels.length;++i)
                channels.push(new Max.Channel(data.channels[i]));

            Max.Channel.setSubscriptionState(channels, function(e, channels) {
                ChannelStore.add(channels);
                def.resolve(channels);
            });
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get the extended channel information, including a summary of subscribers and chat history.
 * @param {Max.Channel|Max.Channel[]} channelOrChannels One or more channels.
 * @param {number} subscriberCount The number of subscribers to return.
 * @param {number} messageCount The number of messages to return.
 * @returns {Max.Promise.<object[]>} A promise object returning a list of channel summaries or reason of failure.
 */
Max.Channel.getChannelSummary = function(channelOrChannels, subscriberCount, messageCount) {
    var def = new Max.Deferred();
    var channelIds = [];
    var channelSummaries = [];

    if (!Max.Utils.isArray(channelOrChannels))
        channelOrChannels = [channelOrChannels];

    for (var i=0;i<channelOrChannels.length;++i) {
        channelIds.push(
            channelOrChannels[i].channelId
        );
    }

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/channel/summary',
            data: {
                requestUserId: mCurrentUser.userId,
                appId: Max.App.appId,
                channelIds: channelIds
            }
        }, function (data, details) {
            var i, j;
            if (data && data.length) {
                for (i = 0; i < data.length; ++i) {
                    if (data[i].owner) {
                        // TODO: this is quick fix until server bug is fixed
                        if (data[i].userId)
                            data[i].owner = {
                                userId: data[i].userId
                            };
                        data[i].owner = new Max.User(data[i].owner);
                    }
                    data[i].channel = Max.ChannelHelper.matchChannel(channelOrChannels, data[i].displayName, data[i].userId);
                    data[i].messages = Max.ChannelHelper.parseMessageList(data[i].messages, data[i].channel);
                    data[i].subscribers = Max.Utils.objToObjAry(data[i].subscribers);
                    for (j = 0; j < data[i].subscribers.length; ++j)
                        data[i].subscribers[j] = new Max.User(data[i].subscribers[j]);

                    channelSummaries.push(data[i]);
                }
            }

            def.resolve(channelSummaries, details);
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get the basic information about a private channel. Only private channels created by the current user will be returned.
 * @param {string} channelName The channel name.
 * @returns {Max.Promise.<Max.Channel>} A promise object returning a {Max.Channel} or reason of failure.
 */
Max.Channel.getPrivateChannel = function(channelName) {
    return Max.Channel.getChannel(channelName, mCurrentUser.userId);
};

/**
 * Get the basic information about a public channel.
 * @param {string} channelName The channel name.
 * @returns {Max.Promise.<Max.Channel>} A promise object returning a {Max.Channel} or reason of failure.
 */
Max.Channel.getPublicChannel = function(channelName) {
    return Max.Channel.getChannel(channelName);
};

/**
 * Get the basic channel information about a public or private channel.
 * @param {string} channelId The channel identifier.
 * @returns {Max.Promise.<Max.Channel>} A promise object returning a {Max.Channel} or reason of failure.
 */
Max.Channel.getChannelById = function(channelId) {
    var channel = channelId.split('#');
    return Max.Channel.getChannel(channel[1] || channel[0], channel[1] ? channel[0] : null);
};

/**
 * Get the basic channel information.
 * @param {string} channelName The channel name.
 * @param {string} [userId] The userId of the channel owner if the channel is private.
 * @returns {Max.Promise.<Max.Channel>} A promise object returning a {Max.Channel} or reason of failure.
 * @private
 */
Max.Channel.getChannel = function(channelName, userId) {
    var def = new Max.Deferred();
    var msgId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicId: userId + '#' + channelName
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'get', id: msgId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'getTopic', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var json = x2js.xml2json(msg);
            var payload, channel;

            if (!json || !json.mmx) return def.reject(Max.Error.INVALID_CHANNEL);
            payload = JSON.parse(json.mmx);
            if (payload.message) return def.reject(payload.message);

            channel = new Max.Channel(payload);

            Max.Channel.setSubscriptionState(channel, function(e, channel) {
                ChannelStore.add(channel);
                def.resolve(channel);
            });
        }, null, null, null, msgId,  null);

        mXMPPConnection.send(payload.tree());

    }, 0);

    return def.promise;
};

/**
 * Get the full channel information using basic channel object (name and userId).
 * @param {object|object[]} channelOrChannels One or more channel objects containing channel name (and userId, if private channel). Should be in the format {name: 'channelName', userId: 'your-user-id'}.
 * @returns {Max.Promise.<Max.Channel[]>} A promise object returning a list of {Max.Channel} or reason of failure.
 * @private
 */
Max.Channel.getChannels = function(channelOrChannels, allSubscribed) {
    var def = new Max.Deferred();
    var msgId = Max.Utils.getCleanGUID();

    if (!Max.Utils.isArray(channelOrChannels))
        channelOrChannels = [channelOrChannels];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = [];
        for (var i=0;i<channelOrChannels.length;++i)
            mmxMeta.push({
                topicId: channelOrChannels[i].channelId
            });

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'get', id: msgId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'getTopics', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var json = x2js.xml2json(msg);
            var payload, channels = [];

            if (!json || !json.mmx) return def.resolve([]);

            payload = Max.Utils.objToObjAry(JSON.parse(json.mmx));

            for (var i=0;i<payload.length;++i) {
                if (allSubscribed) payload[i].isSubscribed = true;
                channels.push(new Max.Channel(payload[i]));
            }

            if (allSubscribed) return def.resolve(channels);

            Max.Channel.setSubscriptionState(channels, function(e, channels) {
                ChannelStore.add(channels);
                def.resolve(channels);
            });
        }, null, null, null, msgId,  null);

        mXMPPConnection.send(payload.tree());
    }, 0);

    return def.promise;
};

/**
 * Get the total number of unread messages for all subscribed channels.
 * @returns {Max.Promise.<number>} A promise object returning total unread count or reason of failure.
 */
Max.Channel.getTotalUnreadCount = function() {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/badge/app'
        }, function(data, details) {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Update the number of unread messages for each of the given channels. Access the number of unread messages using channel.unreadCount.
 * @param {Max.Channel|Max.Channel[]} channelOrChannels One or more {Max.Channel} objects.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.getUnreadCount = function(channelOrChannels) {
    var def = new Max.Deferred();
    var channelIds = [], index;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!channelOrChannels) return def.reject(Max.Error.INVALID_CHANNEL);

        if (!Max.Utils.isArray(channelOrChannels))
            channelOrChannels = [channelOrChannels];
        for (var i=0;i<channelOrChannels.length;++i)
            channelIds.push('channels='+encodeURIComponent(channelOrChannels[i].getChannelId()));

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/badge?' + channelIds.join('&')
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                index = channelIds.indexOf('channels='+encodeURIComponent(data[i].channelId));
                if (index !== -1) channelOrChannels[index].unreadCount = data[i].unreadCount;
            }

            def.resolve('ok', details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Set read state to notify the server that channel messages are being actively read by the current user. When a channel is active, unread counts will be updated automatically across all devices.
 * @param {object|object[]} channelOrChannels One or more {Max.Channel} objects.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.setActive = function(channelOrChannels) {
    return Max.Channel.setReadState(channelOrChannels, true);
};

/**
 * Set read state to notify the server that channel messages are no longer being actively read by the current user. Unread counts will no longer be updated automatically.
 * @param {object|object[]} channelOrChannels One or more {Max.Channel} objects.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.setInactive = function(channelOrChannels) {
    return Max.Channel.setReadState(channelOrChannels);
};

/**
 * Set read state to notify the server that channel messages are being actively read by the current user. When a channel is being read, unread counts will be updated automatically across all devices.
 * @param {object|object[]} channelOrChannels One or more {Max.Channel} objects.
 * @param {boolean} [isActive] Set to true if the channel is being read. Defaults to false.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 * @private
 */
Max.Channel.setReadState = function(channelOrChannels, isActive) {
    var def = new Max.Deferred();
    var channelIds = [];
    var readState = isActive === true ? 'active' : 'inactive';

    if (!Max.Utils.isArray(channelOrChannels))
        channelOrChannels = [channelOrChannels];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        for (var i=0;i<channelOrChannels.length;++i)
            channelIds.push(channelOrChannels[i].getChannelId());

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/badge/mark/' + readState,
            data: channelIds
        }, function(data, details) {
            def.resolve('ok', details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 Notify the server that the current user has read all the messages for the channel until the given messageId. This method will update unread counts across all devices owned by the current user.
 * @param {string} messageId The latest message read.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.prototype.readUntil = function(messageId) {
    var def = new Max.Deferred();
    var self = this;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!messageId) return def.reject(Max.Error.INVALID_MESSAGE_ID);

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/badge/watermark',
            data: [{
                channelId: self.getChannelId(),
                messageId: messageId
            }]
        }, function(data, details) {
            def.resolve('ok', details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Set read state to notify the server that channel messages are being actively read by the current user. When a channel is active, unread counts will be updated automatically across all devices.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.prototype.setActive = function() {
    return Max.Channel.setReadState(this, true);
};

/**
 * Set read state to notify the server that channel messages are no longer being actively read by the current user. Unread counts will no longer be updated automatically.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.prototype.setInactive = function() {
    return Max.Channel.setReadState(this);
};

/**
 * Get a list of the users subscribed to the channel.
 * @param {number} [limit] The number of users to return in the request. Defaults to 10.
 * @param {number} [offset]	The starting index of users to return.
 * @returns {Max.Promise.<Max.User[]>} A promise object returning a list of {Max.User} or reason of failure.
 */
Max.Channel.prototype.getAllSubscribers = function(limit, offset) {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();
    var userIds = [];
    limit = limit || 10;
    offset = offset || 0;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicId: self.channelId,
            limit: limit,            // -1 for unlimited, or > 0
            offset: offset           // offset starting from zero
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'get', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'getSubscribers', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var payload, json = x2js.xml2json(msg);
            payload = (json.mmx && json.mmx.__text) ? JSON.parse(json.mmx.__text) : JSON.parse(json.mmx);

            if (!payload || !payload.subscribers) return def.resolve([]);

            payload.subscribers = Max.Utils.objToObjAry(payload.subscribers);
            for (var i=0;i<payload.subscribers.length;++i)
                userIds.push(payload.subscribers[i].userId);

            Max.User.getUsersByUserIds(userIds).success(function() {
                def.resolve.apply(def, arguments);
            }).error(function(e) {
                def.reject(e);
            });

        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());
    }, 0);

    return def.promise;
};

/**
 * Add the given subscribers to the channel.
 * @param {string|Max.User|string[]|Max.User[]} subscribers A list of userId or {Max.User} objects.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 */
Max.Channel.prototype.addSubscribers = function(subscribers) {
    var self = this;
    var subscriberlist = [];
    var def = new Max.Deferred();

    if (!Max.Utils.isArray(subscribers))
        subscribers = [subscribers];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!self.name) return def.reject(Max.Error.INVALID_CHANNEL);
        if (!self.isOwner() && !self.isPublic) return def.reject(Max.Error.FORBIDDEN);

        for (var i in subscribers)
            subscriberlist.push(Max.Utils.isObject(subscribers[i]) ? subscribers[i].userId : subscribers[i]);

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/channel/'+encodeURIComponent(self.getChannelId())+'/subscribers/add',
            data: {
                privateChannel: !self.isPublic,
                subscribers: subscriberlist
            }
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Unsubscribe the given subscribers from the channel.
 * @param {string|Max.User|string[]|Max.User[]} subscribers A list of subscribers to unsubscribe from the channel.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 */
Max.Channel.prototype.removeSubscribers = function(subscribers) {
    var self = this;
    var subscriberlist = [];
    var def = new Max.Deferred();

    if (!Max.Utils.isArray(subscribers))
        subscribers = [subscribers];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!self.name) return def.reject(Max.Error.INVALID_CHANNEL);
        if (!self.isOwner() && !self.isPublic) return def.reject(Max.Error.FORBIDDEN);

        for (var i in subscribers)
            subscriberlist.push(Max.Utils.isObject(subscribers[i]) ? subscribers[i].userId : subscribers[i]);

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/channel/'+self.name+'/subscribers/remove',
            data: {
                privateChannel: !self.isPublic,
                subscribers: subscriberlist
            }
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Subscribe the current user to the channel.
 * @returns {Max.Promise.<string>} A promise object returning subscription Id or reason of failure.
 */
Max.Channel.prototype.subscribe = function() {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicId: self.channelId,
            devId: null,             // null for any devices, or a specific device
            errorOnDup: false        // true to report error if duplicated subscription, false (default) to not report error
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'set', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'subscribe', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var payload, json = x2js.xml2json(msg);

            if (json.mmx)
                payload = JSON.parse(json.mmx);

            self.isSubscribed = true;
            ChannelStore.add(self);
            def.resolve(payload.subscriptionId);
        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());
    }, 0);

    return def.promise;
};

/**
 * Unsubscribe the current user from the channel.
 * @returns {Max.Promise.<string>} A promise object returning success report or reason of failure.
 */
Max.Channel.prototype.unsubscribe = function() {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicId: self.channelId,
            subscriptionId: null        // | a-subscription-ID  // null for all subscriptions to the topic
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'set', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'unsubscribe', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var payload, json = x2js.xml2json(msg);

            if (json.mmx)
                payload = JSON.parse(json.mmx);

            self.isSubscribed = false;
            ChannelStore.add(self);
            def.resolve(payload.message);
        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());

    }, 0);

    return def.promise;
};

/**
 * Publish a message and/or attachments to the channel.
 * @param {Max.Message} mmxMessage A {Max.Message} instance containing message payload.
 * @param {File|File[]|FileList} [attachments] One or more File objects created by an input[type="file"] HTML element.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.prototype.publish = function(mmxMessage, attachments) {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();
    self.msgId = Max.Utils.getCleanGUID()+'c';
    var dt = Max.Utils.dateToISO8601(new Date());
    var typedPayload;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        function sendMessage(msgMeta) {
            if (mmxMessage.contentType && mmxMessage.payload)
                typedPayload = JSON.stringify(mmxMessage.payload);

            var meta = JSON.stringify(msgMeta);
            var mmxMeta = {
                From: {
                    userId: mCurrentUser.userId,
                    devId: mCurrentDevice.deviceId,
                    displayName: (mCurrentUser.firstName || '') + ' ' + (mCurrentUser.lastName || ''),
                    firstName: mCurrentUser.firstName,
                    lastName: mCurrentUser.lastName,
                    userName: mCurrentUser.userName
                }
            };
            if (mmxMessage.pushConfigName || self.pushConfigName)
                mmxMeta['Push-Config-Name'] = mmxMessage.pushConfigName || self.pushConfigName;

            mmxMeta = JSON.stringify(mmxMeta);

            var payload = $iq({to: 'pubsub.mmx', from: mCurrentUser.jid, type: 'set', id: iqId})
                .c('pubsub', {xmlns: 'http://jabber.org/protocol/pubsub'})
                .c('publish', {node: self.getNodePath()})
                .c('item', {id: self.msgId})
                .c('mmx', {xmlns: 'com.magnet:msg:payload'})
                .c('mmxmeta', mmxMeta).up()
                .c('meta', meta).up()
                .c('payload', {mtype: mmxMessage.contentType || 'unknown', stamp: dt, chunk: '0/0/0'});

            if (typedPayload) payload.t(typedPayload);

            mXMPPConnection.addHandler(function(msg) {
                var json = x2js.xml2json(msg);

                if (json.error) {
                    if (json.error._type == 'auth') json.error._type = Max.Error.FORBIDDEN;
                    return def.reject(json.error._type, json.error._code);
                }

                def.resolve(self.msgId);
            }, null, null, null, iqId, null);

            mXMPPConnection.send(payload.tree());
        }

        if (!attachments) return sendMessage(mmxMessage.messageContent);

        new Max.Uploader(attachments, function(e, multipart) {
            if (e || !multipart) return def.reject(e);

            multipart.channelUpload(self, iqId).success(function(attachments) {
                sendMessage(Max.Utils.mergeObj(mmxMessage.messageContent || {}, {
                    _attachments: JSON.stringify(attachments)
                }));
            }).error(function(e) {
                def.reject(e);
            });
        });
    }, 0);

    return def.promise;
};

/**
 * Retrieve all of the messages for this channel within date range.
 * @param {Date} [startDate] Filter based on start date, or null for no filter.
 * @param {Date} [endDate] Filter based on end date, or null for no filter.
 * @param {number} [limit] The number of messages to return in the request.
 * @param {number} [offset]	The starting index of messages to return.
 * @param {boolean} [ascending] Set to false to sort by descending order. Defaults to true.
 * @returns {Max.Promise.<Max.Message[]>} A promise object returning a list of {Max.Message} and total number of messages payload or reason of failure.
 */
Max.Channel.prototype.getMessages = function(startDate, endDate, limit, offset, ascending) {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();
    startDate = Max.Utils.dateToISO8601(startDate);
    endDate = Max.Utils.dateToISO8601(endDate);
    limit = limit || 10;
    offset = offset || 0;
    ascending = typeof ascending !== 'boolean' ? true : ascending;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicId: self.channelId,
            options: {
                subscriptionId: null,    // optional (if null, any subscriptions to the topic will be assumed)
                since: startDate,        // optional (inclusive, 2015-03-06T13:23:45.783Z)
                until: endDate,          // optional (inclusive)
                ascending: ascending,    // optional.  Default is false (i.e. descending)
                maxItems: limit,         // optional.  -1 (default) for system specified max, or > 0.
                offset: offset           // optional.  offset starting from zero
            }
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'get', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'fetch', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg, json) {
            json = json || x2js.xml2json(msg);

            if (json.mmx) {
                payload = (json.mmx && json.mmx.__text) ? JSON.parse(json.mmx.__text) : JSON.parse(json.mmx);
                if (payload) {
                    payload.items = Max.Utils.objToObjAry(payload.items);
                    Max.ChannelHelper.formatMessage([], self, payload.items, 0, function(messages) {
                        def.resolve(messages, payload.totalCount);
                    });
                }
            }
        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());

    }, 0);

    return def.promise;
};

/**
 * Get the tags for this channel.
 * @returns {Max.Promise.<string[]>} A promise object returning a list of tags or reason of failure.
 */
Max.Channel.prototype.getTags = function() {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicId: self.channelId
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'get', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'getTags', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var payload, json = x2js.xml2json(msg);

            if (json.mmx)
                payload = JSON.parse(json.mmx);

            if (!payload || !payload.tags) return def.resolve([]);

            payload.tags = Max.Utils.objToObjAry(payload.tags);

            def.resolve(payload.tags, Max.Utils.ISO8601ToDate(payload.lastModTime));
        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());
    }, 0);

    return def.promise;
};

/**
 * Set tags for a specific channel. This will overwrite ALL existing tags for the chanel. This can be used to delete tags by passing in the sub-set of existing tags that you want to keep.
 * @param {string[]} tags An array of tags.
 * @returns {Max.Promise.<string[]>} A promise object returning a list of tags or reason of failure.
 */
Max.Channel.prototype.setTags = function(tags) {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);
        if (!tags || !Max.Utils.isArray(tags)) return def.reject(Max.Error.INVALID_TAGS);

        var mmxMeta = {
            topicId: self.channelId,
            tags: tags
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'set', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'setTags', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var payload, json = x2js.xml2json(msg);

            if (json.mmx) payload = JSON.parse(json.mmx);
            if (payload.code != 200) return def.reject(payload.message);

            def.resolve(payload.message);
        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());
    }, 0);

    return def.promise;
};

/**
 * Sends invitations to the specified users for this channel. If the recipients accept the invitation, they will be
 * become subscibed to the channel.
 * @param {string|Max.User|string[]|Max.User[]} recipients A list of userId or {Max.User} objects.
 * @param {string} comments Comments to include with the invitation.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 */
Max.Channel.prototype.inviteUsers = function(recipients, comments) {
    var self = this, msg;
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);
        if (!self.isOwner()) return def.reject(Max.Error.FORBIDDEN);

        msg = new Max.Message({
            text: comments,
            channelSummary: self.summary,
            channelName: self.name,
            channelIsPublic: self.isPublic+'',
            channelOwnerId: self.ownerUserId,
            channelPublishPermissions: self.publishPermissions,
            channelCreationDate: self.creationDate
            //_attachments: 'encoded-JSON-string'   // optional, see Attachments section
        }, recipients);

        msg.mType = Max.MessageType.INVITATION;

        msg.send().success(function() {
            def.resolve.apply(def, arguments);
        }).error(function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Delete a message from the channel. Must be channel owner, message creator, or administrator.
 * @param {string} messageId Identifier of the message to delete.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 */
Max.Channel.prototype.deleteMessage = function(messageId) {
    var self = this;
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!self.name) return def.reject(Max.Error.INVALID_CHANNEL);
        if (!self.isOwner()) return def.reject(Max.Error.FORBIDDEN);
        if (!messageId) return def.reject(Max.Error.INVALID_MESSAGE_ID);

        Max.Request({
            method: 'DELETE',
            url: '/com.magnet.server/channel/message/' + messageId,
            isLogin: true
        }, function(res) {
            def.resolve(res.message, res.code);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Delete this channel
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 */
Max.Channel.prototype.delete = function() {
    var self = this;
    var def = new Max.Deferred();
    var iqId = Max.Utils.getCleanGUID();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!mXMPPConnection || !mXMPPConnection.connected) return def.reject(Max.Error.NOT_CONNECTED);

        var mmxMeta = {
            topicName: self.name,                   // without /appID/* or /appID/userID
            isPersonal: self.userId ? true : false  // true for personal user topic, false for global topic
        };

        mmxMeta = JSON.stringify(mmxMeta);

        var payload = $iq({from: mCurrentUser.jid, type: 'set', id: iqId})
            .c('mmx', {xmlns: 'com.magnet:pubsub', command: 'deletetopic', ctype: 'application/json'}, mmxMeta);

        mXMPPConnection.addHandler(function(msg) {
            var payload, json = x2js.xml2json(msg);

            if (json.mmx)
                payload = JSON.parse(json.mmx);

            def.resolve(payload.message);
        }, null, null, null, iqId,  null);

        mXMPPConnection.send(payload.tree());
    }, 0);

    return def.promise;
};

/**
 * Disable push notifications to the channel for the current user. This feature has no effect on web apps, but allows users to mute push notifications for their mobile devices.
 * @param {Date} [endDate] Optional date when push notifications will be unmuted.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.prototype.mute = function(endDate) {
    var self = this;
    var def = new Max.Deferred();

    setTimeout(function() {
        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/channel/' + encodeURIComponent(self.getChannelId()) + '/push/mute',
            data: {
                untilDate: endDate ? Max.Utils.dateToISO8601(endDate) : null
            }
        }, function(res, details) {
            self.isMuted = true;
            self.isMuted = true;
            if (ChannelStore.get(self)) {
                ChannelStore.get(self).isMuted = true;
            }
            def.resolve('ok', details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Re-enable push notifications to the channel for the current user.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Channel.prototype.unmute = function() {
    var self = this;
    var def = new Max.Deferred();

    setTimeout(function() {
        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/channel/' + encodeURIComponent(self.getChannelId()) + '/push/unmute'
        }, function(res, details) {
            self.isMuted = false;
            if (ChannelStore.get(self)) {
                ChannelStore.get(self).isMuted = false;
            }
            def.resolve('ok', details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Determines if the currently logged in user is the owner of the channel.
 * @returns {boolean} True if the currently logged in user is the owner of the channel.
 */
Max.Channel.prototype.isOwner = function() {
    return this.userId == mCurrentUser.userId || (this.ownerUserId && this.ownerUserId == mCurrentUser.userId);
};

/**
 * Get the formal channel name used by REST APIs.
 * @returns {string} The formal channel name.
 * @private
 */
Max.Channel.prototype.getChannelName = function() {
    return this.isPublic === true ? this.name : (this.userId + '#' + this.name);
};

/**
 * Get the channel Id.
 * @returns {string} The formal channelId.
 */
Max.Channel.prototype.getChannelId = function() {
//    return (this.isPublic === true ? (this.name+'') : (this.userId + '#' + this.name)).toLowerCase();
    return this.channelId || (this.userId + '#' + this.name).toLowerCase();
};

Max.Channel.prototype.getNodePath = function() {
    return ('/' + Max.App.appId + '/' + (this.userId ? this.userId : '*') + '/' + (this.name+'')).toLowerCase();
};

// non-persistent cache of channel information to improve message receive performance
var ChannelStore = {
    store: {},
    add: function(channelOrChannels) {
        if (!Max.Utils.isArray(channelOrChannels))
            return this.store[this.getChannelId(channelOrChannels)] = channelOrChannels;
        for (var i=0;i<channelOrChannels.length;++i)
            this.store[this.getChannelId(channelOrChannels[i])] = channelOrChannels[i];
    },
    get: function(channel) {
        return this.store[this.getChannelId(channel)];
    },
    remove: function(channel) {
        if (this.store[this.getChannelId(channel)])
            delete this.store[this.getChannelId(channel)];
    },
    getChannelId: function(channel) {
        return (channel.userId || '*') + '/' + (channel.name.toLowerCase());
    },
    clear: function() {
        this.store = {};
    }
};

Max.ChannelHelper = {
    /**
     * Converts an ary of message data into Message object
     */
    parseMessageList: function(ary, channel) {
        if (!ary) return [];
        if (!Max.Utils.isArray(ary)) ary = [ary];
        for (j = 0; j < ary.length; ++j) {
            var mmxMsg = new Max.Message();
            mmxMsg.sender = new Max.User(ary[j].publisher);
            if (ary[j].metaData)
                mmxMsg.timestamp = Max.Utils.ISO8601ToDate(ary[j].metaData.creationDate);
            mmxMsg.channel = channel;
            mmxMsg.messageId = ary[j].itemId;
            if (ary[j].content) {
                Max.MessageHelper.attachmentRefsToAttachment(mmxMsg, ary[j].content);
                mmxMsg.messageContent = ary[j].content || {};
            }
            ary[j] = mmxMsg;
        }
        return ary;
    },
    /**
     * Get matching channel.
     */
    matchChannel: function(channels, matchName, matchOwner) {
        var channel;
        for (var i=0;i<channels.length;++i) {
            if (!channels[i].userId) delete channels[i].userId;
            if ((channels[i].displayName || '').toLowerCase() === (matchName || '').toLowerCase() && channels[i].userId == matchOwner) {
                channel = channels[i];
                break;
            }
        }
        return channel;
    },
    /**
     * Recursively convert message metadata into Message object
     */
    formatMessage: function(messages, channel, msgAry, index, cb) {
        var self = this;
        if (!msgAry[index] || !msgAry[index].payloadXML) return cb(messages);
        var jsonObj = x2js.xml_str2json(msgAry[index].payloadXML);

        Max.Message.formatEvent(jsonObj, channel, function(e, mmxMsg) {
            if (mmxMsg) {
                mmxMsg.messageId = msgAry[index].itemId;
                messages.push(mmxMsg);
            }
            self.formatMessage(messages, channel, msgAry, ++index, cb);
        });
    },
    /**
     * Create a channel object given channelId
     */
    channelIdToChannel: function(channelId) {
        var channelAry = channelId.split('#');
        return new Max.Channel({
            name: channelAry[1] || channelAry[0],
            userId: channelAry[1] ? channelAry[0] : null
        });
    }
};

/**
 * @constructor
 * @class
 * The Bookmark class can be used to store a position in a chat window so that it can be located conveniently at a later time.
 * @property {string} id The identifier of the bookmark.
 * @property {string} name A user-friendly name for the bookmark.
 * @property {object} extras Additional custom metadata.
 * @property {Max.Bookmark.ObjectType} objectType The type of the object in which the bookmark exists.
 * @property {string} objectId The identifier of the object in which the bookmark exists.
 * @property {Date} [objectTime] Time when the bookmark was created.
 * @property {string} creatorId Identifier of the user who created the bookmark.
 */
Max.Bookmark = function(bookmarkObj) {
    Max.Utils.mergeObj(this, bookmarkObj || {});

    this.extras = this.extras || this.metaData || {};
    delete this.metaData;

    if (this.objectTime && typeof this.objectTime == 'string') {
        this.objectTime = Max.Utils.ISO8601ToDate(this.objectTime);
    }

    return this;
};

/**
 * Create a bookmark.
 * @param {Max.Bookmark} bookmark Contents of the bookmark. See {Max.Bookmark} for more information.
 * @returns {Max.Promise.<Max.Bookmark>} A promise object returning the newly created {Max.Bookmark} or reason of failure.
 */
Max.Bookmark.create = function(bookmark) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!bookmark) return def.reject(Max.Error.INVALID_BOOKMARK_BODY);

        bookmark.creatorId = mCurrentUser.userId;

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/bookmark',
            data: Max.Bookmark.Helper.bookmarkToServerObj(bookmark)
        }, function(data, details) {
            def.resolve(new Max.Bookmark(data), details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Fetch a bookmark by bookmark name.
 * @param {Max.Bookmark.ObjectType} objectType The type of the object in which the bookmark exists.
 * @param {string} objectId The identifier of the object in which the bookmark exists.
 * @param {string} bookmarkName The user-friendly name given when the bookmark was created or last updated.
 * @returns {Max.Promise.<Max.Bookmark>} A promise object returning a {Max.Bookmark} or reason of failure.
 */
Max.Bookmark.getByName = function(objectType, objectId, bookmarkName) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!objectType) return def.reject(Max.Error.INVALID_OBJECT_TYPE);
        if (!objectId) return def.reject(Max.Error.INVALID_OBJECT_ID);
        if (!bookmarkName) return def.reject(Max.Error.INVALID_BOOKMARK_NAME);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/bookmark' +
            '?objectType=' + objectType +
            '&objectId=' + encodeURIComponent(objectId) +
            '&name=' + bookmarkName
        }, function(data, details) {
            def.resolve(new Max.Bookmark(data), details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Fetch a bookmark by object information.
 * @param {Max.Bookmark.ObjectType} objectType The type of the object in which the bookmark exists.
 * @param {string} objectId The identifier of the object in which the bookmark exists.
 * @returns {Max.Promise.<Max.Bookmark[]>} A promise object returning a list of {Max.Bookmark} or reason of failure.
 */
Max.Bookmark.getByObjectId = function(objectType, objectId) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!objectType) return def.reject(Max.Error.INVALID_OBJECT_TYPE);
        if (!objectId) return def.reject(Max.Error.INVALID_OBJECT_ID);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/bookmark/object' +
            '?objectType=' + objectType +
            '&objectId=' + encodeURIComponent(objectId)
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                data[i] = new Max.Bookmark(data[i]);
            }
            def.resolve(data, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Fetch all bookmarks given a object type.
 * @param {Max.Bookmark.ObjectType} objectType The type of the object in which the bookmark exists.
 * @returns {Max.Promise.<Max.Bookmark[]>} A promise object returning a list of {Max.Bookmark} or reason of failure.
 */
Max.Bookmark.get = function(objectType) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!objectType) return def.reject(Max.Error.INVALID_OBJECT_TYPE);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/bookmark/objecttype' +
            '?objectType=' + objectType
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                data[i] = new Max.Bookmark(data[i]);
            }
            def.resolve(data, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Update a bookmark.
 * @param {Max.Bookmark} bookmark Contents of the bookmark. See {Max.Bookmark} for more information.
 * @returns {Max.Promise.<Max.Bookmark>} A promise object returning the updated {Max.Bookmark} or reason of failure.
 */
Max.Bookmark.update = function(bookmark) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!bookmark) return def.reject(Max.Error.INVALID_BOOKMARK_BODY);
        if (!bookmark.id) return def.reject(Max.Error.INVALID_BOOKMARK_ID);

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/bookmark/' + bookmark.id,
            data: Max.Bookmark.Helper.bookmarkToServerObj(bookmark)
        }, function(data, details) {
            def.resolve(new Max.Bookmark(data), details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Delete a bookmark.
 * @param {string} bookmarkId Unique identifier of the bookmark.
 * @returns {Max.Promise.<string>} A promise object returning "ok" or reason of failure.
 */
Max.Bookmark.delete = function(bookmarkId) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!bookmarkId) return def.reject(Max.Error.INVALID_BOOKMARK_ID);

        Max.Request({
            method: 'DELETE',
            url: '/com.magnet.server/bookmark/' + bookmarkId
        }, function(data, details) {
            def.resolve('ok', details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Enum for all bookmark object types.
 * @readonly
 * @enum {string}
 */
Max.Bookmark.ObjectType = {
    CHANNEL: 'CHANNEL'
};

/**
 * @constructor
 * @class
 * Contains helper methods related to bookmarks.
 * @private
 */
Max.Bookmark.Helper = {
    /**
     * Convert {Max.Bookmark} object to server bookmark.
     * @param {Max.Bookmark} bookmark A bookmark object.
     * @returns {object} A server bookmark.
     */
    bookmarkToServerObj: function(bookmark) {
        var bookmarkObj = Max.Utils.mergeObj({}, bookmark);

        bookmarkObj.metaData = bookmarkObj.extras;
        delete bookmarkObj.extras;

        if (bookmarkObj.objectTime) {
            bookmarkObj.objectTime = Max.Utils.dateToISO8601(bookmarkObj.objectTime);
        }

        return bookmarkObj;
    }
};

/**
 * The Approval class is a local representation of an approval in the MagnetMax platform. This class provides various
 * approval specific methods, like creating an approval request and approving or rejecting an approval.
 * @constructor
 * @param {object} approvalObj An object containing approval information.
 * @param {string} approvalObj.title The title of this approval.
 * @param {string} approvalObj.description A description of this approval.
 * @param {Max.Approval.Mode} [approvalObj.mode] The order in which approvals will occur. Defaults to {Max.Approval.Mode.ANY_ORDER}. See {Max.Approval.Mode} for more information.
 * @param {Max.ApprovalProperty[]} approvalObj.properties A list of properties concerning an approval request. The approver will look at the approval properties to decide for an approval or rejection.
 * @param {string|Max.User|string[]|Max.User[]} approvalObj.approvers A list of userId or {Max.User} objects.
 * @param {File|File[]|FileList} [approvalObj.attachments] One or more File objects created by an input[type="file"] HTML element.
 * @param {object} [approvalObj.extras] A user-defined object used to store arbitrary data will can accessed from a {Max.Approval} instance.
 * @property {string} approvalId Approval identifier.
 * @property {string} title The title of this approval.
 * @property {string} description The description of this approval.
 * @property {Max.Approval.Mode} mode The order in which approvals will occur. See {Max.Approval.Mode} for more information.
 * @property {Max.ApprovalProperty[]} properties A list of properties concerning an approval request. The approver will look at the approval properties to decide for an approval or rejection.
 * @property {Max.Approval.Status} status The status of the approval. If response has not been made, status will be 'PENDING'.
 * @property {Max.Attachment[]} [attachments] An array of file attachments.
 * @property {object} extras A user-defined object used to store arbitrary data will can accessed from a {Max.Approval} instance.
 * @property {Max.ApprovalHistoryItem[]} historyItems Each time an approver approves or rejects the approval, a record of the action is pushed to this property. If no approvers have taken action yet, this property will be empty.
 * @property {Max.ApprovalLineItem[]} lineItems After an approval has been approved, purchases related to the approval can be added as line items for tracking purposes. If the approval has not been approved by all of the approvers, this property will be empty.
 * @property {Date} createdDate The date this approval was created.
 * @property {Max.User[]} approvers A list of approvers.
 * @property {Max.Channel} [preApprovalChannel] A {Max.Channel} instance of the channel which contains the approval.
 * @property {Max.Channel} [channel] A {Max.Channel} instance of a channel which was created specifically for this approval.
 * @property {Max.User} createdBy Approval creator.
 * @property {boolean} isTemplate True if the approval was created as a template.
 * @property {Date} [updatedDate] Date when the approval was last updated.
 * @property {Max.User} [updatedBy] User identifier of the user who last updated the approval.
 * @property {Max.User[]} [assignedUsers] Users assigned to respond to an approval.
 */
Max.Approval = function(approvalObj) {
    Max.Utils.mergeObj(this, approvalObj);

    this.TYPE = Max.MessageType.APPROVAL;
    this.extras = this.extras || {};
    this.createdBy = this.createdBy || mCurrentUser;
    this.historyItems = this.historyItems || [];
    this.lineItems = this.lineItems || [];
    this.approvers = this.approvers || [];

    this.status = this.status || Max.Approval.Status.PENDING;
    this.mode = this.mode || Max.Approval.Mode.ANY_ORDER;

    return this;
};

/**
 * Get a {Max.Approval} by identifier.
 * @param {string} approvalId Approval identifier.
 * @returns {Max.Promise.<Max.Approval>} A promise object returning a {Max.Approval} or reason of failure.
 */
Max.Approval.get = function(approvalId) {
    var def = new Max.Deferred(), approval;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!approvalId) return def.reject(Max.Error.INVALID_APPROVAL_ID);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/approval/' + approvalId
        }, function(data, details) {
            approval = Max.ApprovalHelper.serverApprovalToApproval(data);

            if (!approval.preApprovalChannelId) {
                def.resolve(approval);
                return;
            }

            function getChannel(channelId, cb) {
                if (!channelId) return cb();
                Max.Channel.getChannelById(channelId).success(function(channel) {
                    return cb(channel);
                }).error(function() {
                    return cb();
                });
            }
            getChannel(approval.preApprovalChannelId, function(preApprovalChannel) {
                if (preApprovalChannel) approval.preApprovalChannel = preApprovalChannel;
                getChannel(approval.channelId, function(ownedChannel) {
                    if (ownedChannel) approval.channel = ownedChannel;
                    def.resolve(approval);
                });
            })
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Find {Max.Approval} matching the given approval type and status which are associated with the current user.
 * @param {string} [createdByMe] Determines whether to return approvals created by the current user. Defaults to false.
 * @param {Max.Approval.Status} [status] The status of the approval.
 * @param {number} [limit] The number of results to return per page. Default is 10.
 * @param {number} [offset] The starting index of results.
 * @returns {Max.Promise.<Max.Approval[]>} A promise object returning a list of {Max.Approval} or reason of failure.
 * @ignore
 */
Max.Approval.findAllApprovals = function(createdByMe, status, limit, offset) {
    var def = new Max.Deferred(), approvals = [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (status && !Max.Approval.Status[status]) return def.reject(Max.Error.INVALID_APPROVAL_STATUS);
        if (createdByMe === null || typeof createdByMe == 'undefined') createdByMe = false;
        offset = offset || 0;
        limit = limit || 10;

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/approval/summary/details?' +
            'createdByMe=' + createdByMe +
            (status ? ('&status=' + status) : '') +
            '&offset=' + offset +
            '&limit=' + limit
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                approvals.push(Max.ApprovalHelper.serverApprovalToApproval(data[i]));
            }

            def.resolve(approvals, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get all approvals related to the current user, with ability to filter by approval status and approval creator independently.
 * @param {string} [searchQuery] Filter results to only return approvals with title or description containing the given input.
 * @param {Max.Approval.Status[]} [createdFilter] One or more {Max.Approval.Status} of approvals created by the current user to filter the result set.
 * @param {Max.Approval.Status[]} [assignedFilter] One or more {Max.Approval.Status} of approvals assigned to the current user to filter the result set.
 * @param {number} [limit] The number of results to return per page. Default is 10.
 * @param {number} [offset] The starting index of results.
 * @returns {Max.Promise.<Max.Approval[]>} A promise object returning a list of {Max.Approval} or reason of failure.
 */
Max.Approval.findApprovals = function(searchQuery, createdFilter, assignedFilter, limit, offset) {
    var def = new Max.Deferred(), approvals = [], query = '';

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        offset = offset || 0;
        limit = limit || 10;

        query = (Max.ApprovalHelper.getStatusQuery('createdFilter', createdFilter) +
            Max.ApprovalHelper.getStatusQuery('assignedFilter', assignedFilter) +
            (searchQuery ? ('&query=' + searchQuery) : '') +
            '&offset=' + offset +
            '&limit=' + limit).replace('&', '?');

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/approval/summary/details/filtered' + query
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                approvals.push(Max.ApprovalHelper.serverApprovalToApproval(data[i]));
            }

            def.resolve(approvals, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Returns all {Max.Approval}.
 * @returns {Max.Promise.<Max.Approval[]>} A promise object returning a list of {Max.Approval} or reason of failure.
 * @ignore
 */
Max.Approval.findAll = function() {
    var def = new Max.Deferred(), approvals = [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/approval'
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                approvals.push(Max.ApprovalHelper.serverApprovalToApproval(data[i]));
            }

            def.resolve(approvals, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get a summary of all approvals associated with the current user.
 * @returns {Max.Promise.<object>} A promise object returning an object containing approval summary or reason of failure.
 */
Max.Approval.getApprovalDetails = function() {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/approval/summary'
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Create an approval. If a preApprovalChannel is specified, a message will be published to the channel notifying channel participants that the approval has been created.
 * @param {Max.Channel} [preApprovalChannel] A {Max.Channel} instance of the channel which contains the approval.
 * @param {Max.Channel} [channel] A {Max.Channel} instance of a channel which was created specifically for this approval.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} published to channel if a preApprovalChannel was specified, or reason of failure.
 */
Max.Approval.prototype.publish = function(preApprovalChannel, channel) {
    var self = this, def = new Max.Deferred();

    setTimeout(function() {
        if (self.createdDate)
            return def.reject(Max.Error.ALREADY_CREATED);

        self.create(preApprovalChannel, channel).success(function() {

            def.resolve('ok');

            if (!preApprovalChannel && !channel) return;

            var msg = new Max.Message({
                subject: self.title
            }, null, null, DEFAULT_POLL_CONFIG_NAME)
                .addPayload(new Max.ObjectIdentifier(Max.MessageType.APPROVAL, self.approvalId));

            if (preApprovalChannel) {
                preApprovalChannel.publish(msg);
            }
            if (channel) {
                channel.publish(msg);
            }
        }).error(function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Create an approval.
 * @param {Max.Channel} [preApprovalChannel] A {Max.Channel} instance of the channel which contains the approval.
 * @param {Max.Channel} [channel] A {Max.Channel} instance of a channel which was created specifically for this approval.
 * @returns {Max.Promise.<Max.Message>} A promise object returning {Max.Approval} reason of failure.
 * @ignore
 */
Max.Approval.prototype.create = function(preApprovalChannel, channel) {
    var self = this, serverApproval, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!self.title)
            return def.reject(Max.Error.INVALID_SUBJECT);
        if (!self.description)
            return def.reject(Max.Error.INVALID_DESCRIPTION);
        if (!self.approvers || !self.approvers.length)
            return def.reject(Max.Error.INVALID_APPROVERS);
//        if (!self.properties || !self.properties.length)
//            return def.reject(Max.Error.INVALID_PROPERTIES);

        function uploadComplete() {
            serverApproval = Max.ApprovalHelper.approvalToServerApproval(self, preApprovalChannel, channel);

            Max.Request({
                method: 'POST',
                url: '/com.magnet.server/approval',
                data: serverApproval
            }, function (data) {
                self.approvalId = data.id;
                self.createdDate = Max.Utils.ISO8601ToDate(data.createdDate);
                self.createdBy = new Max.User(data.createdBy);

                if (preApprovalChannel) {
                    self.preApprovalChannelId = preApprovalChannel.getChannelId();
                    self.preApprovalChannel = preApprovalChannel;
                }
                if (channel) {
                    self.channelId = channel.getChannelId();
                    self.channel = channel;
                }

                def.resolve(self);
            }, function () {
                def.reject.apply(def, arguments);
            });
        }

        if (!self._attachments || !self._attachments.length) return uploadComplete();

        new Max.Uploader(self._attachments, function(e, multipart) {
            if (e || !multipart) return def.reject(e);

            multipart.objectUpload(self.approvalId).success(function(attachmentRefs) {
                self.attachments = self.attachments || {};
                for (var i=0;i<attachmentRefs.length;++i) {
                    self.attachments[attachmentRefs[i].fileId] = new Max.Attachment(attachmentRefs[i]);
                }

                uploadComplete();
            }).error(function(e) {
                def.reject(e);
            });
        });

    }, 0);

    return def.promise;
};

/**
 * Update an approval.
 * @param {Max.Channel} [preApprovalChannel] A {Max.Channel} instance of the channel which contains the approval.
 * @param {Max.Channel} [channel] A {Max.Channel} instance of a channel which was created specifically for this approval.
 * @returns {Max.Promise.<Max.Message>} A promise object returning {Max.Approval} reason of failure.
 * @ignore
 */
Max.Approval.prototype.update = function(preApprovalChannel, channel) {
    var self = this, serverApproval, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!self.title)
            return def.reject(Max.Error.INVALID_SUBJECT);
        if (!self.description)
            return def.reject(Max.Error.INVALID_DESCRIPTION);
        if (!self.approvers || !self.approvers.length)
            return def.reject(Max.Error.INVALID_APPROVERS);
//        if (!self.properties || !self.properties.length)
//            return def.reject(Max.Error.INVALID_PROPERTIES);

        serverApproval = Max.ApprovalHelper.approvalToServerApproval(self, preApprovalChannel, channel);

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/approval',
            data: serverApproval
        }, function (data) {

            if (preApprovalChannel) {
                self.preApprovalChannelId = preApprovalChannel.getChannelId();
                self.preApprovalChannel = preApprovalChannel;
            }
            if (channel) {
                self.channelId = channel.getChannelId();
                self.channel = channel;
            }

            def.resolve(self);
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Update approval line items.
 * @param {Max.ApprovalLineItem[]} lineItems Updated list of all line items.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the updated {Max.Approval} or reason of failure.
 * @ignore
 */
Max.Approval.prototype.updateLineItems = function(lineItems) {
    var self = this, serverApproval, def = new Max.Deferred(), lineItemUpdate;

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!lineItems || !lineItems.length)
            return def.reject(Max.Error.INVALID_LINE_ITEM);

        self.lineItems = lineItems;
        serverApproval = Max.ApprovalHelper.approvalToServerApproval(self);

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/approval',
            data: serverApproval
        }, function (data) {

            lineItemUpdate = new Max.ApprovalLineItemUpdate(self, self.lineItems, mCurrentUser.userId,
                    Max.Utils.dateToISO8601(new Date()));

            if (self.channel) {
                var msg = new Max.Message({
                    subject: self.title
                }, null, null, DEFAULT_POLL_ANSWER_CONFIG_NAME).addPayload(lineItemUpdate);

                self.channel.publish(msg);
            }

            def.resolve(self);
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Add an approval line item.
 * @param {Max.ApprovalLineItem} lineItem Line item to add.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the updated {Max.Approval} or reason of failure.
 */
Max.Approval.prototype.addLineItem = function(lineItem) {
    var self = this, serverApproval, def = new Max.Deferred(), lineItemUpdate;

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!lineItem)
            return def.reject(Max.Error.INVALID_LINE_ITEM);

        function uploadComplete() {
            self.lineItems = self.lineItems || [];
            self.lineItems.push(lineItem);
            serverApproval = Max.ApprovalHelper.approvalToServerApproval(self);

            Max.Request({
                method: 'POST',
                url: '/com.magnet.server/approval/' + self.approvalId + '/lineitem',
                data: serverApproval.lineItems[serverApproval.lineItems.length-1]
            }, function (newLineItem) {

                self.lineItems[self.lineItems.length-1] = Max.ApprovalHelper.serverLineItemToLineItem(newLineItem);

                lineItemUpdate = new Max.ApprovalLineItemUpdate(self, self.lineItems, mCurrentUser.userId,
                        Max.Utils.dateToISO8601(new Date()));

                if (self.channel) {
                    var msg = new Max.Message({
                        subject: self.title
                    }, null, null, DEFAULT_POLL_ANSWER_CONFIG_NAME).addPayload(lineItemUpdate);

                    self.channel.publish(msg);
                }

                def.resolve(self);
            }, function () {
                def.reject.apply(def, arguments);
            });
        }

        if (!lineItem._attachments || !lineItem._attachments.length) return uploadComplete();

        new Max.Uploader(lineItem._attachments, function(e, multipart) {
            if (e || !multipart) return def.reject(e);

            multipart.objectUpload().success(function(attachmentRefs) {
                lineItem.attachments = lineItem.attachments || {};
                for (var i=0;i<attachmentRefs.length;++i) {
                    self.attachments[attachmentRefs[i].fileId] = new Max.Attachment(attachmentRefs[i]);
                }

                uploadComplete();
            }).error(function(e) {
                def.reject(e);
            });
        });

    }, 0);

    return def.promise;
};

/**
 * Update an approval line item.
 * @param {Max.ApprovalLineItem} lineItem Line item to update.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the updated {Max.Approval} or reason of failure.
 */
Max.Approval.prototype.updateLineItem = function(lineItem) {
    var self = this, serverApproval, def = new Max.Deferred(), lineItemUpdate;

    var index = Max.Utils.getIndexById(self.lineItems, lineItem.id);

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!lineItem || index === false)
            return def.reject(Max.Error.INVALID_LINE_ITEM);

        function uploadComplete() {
            self.lineItems = self.lineItems || [];
            self.lineItems[index] = lineItem;
            serverApproval = Max.ApprovalHelper.approvalToServerApproval(self);

            Max.Request({
                method: 'PUT',
                url: '/com.magnet.server/approval/' + self.approvalId + '/lineitem',
                data: serverApproval.lineItems[index]
            }, function (updatedLineItem) {

                updatedLineItem = Max.ApprovalHelper.serverLineItemToLineItem(updatedLineItem);
                self.lineItems[index] = updatedLineItem;

                lineItemUpdate = new Max.ApprovalLineItemUpdate(self, self.lineItems, mCurrentUser.userId,
                        Max.Utils.dateToISO8601(new Date()));

                if (self.channel) {
                    var msg = new Max.Message({
                        subject: self.title
                    }, null, null, DEFAULT_POLL_ANSWER_CONFIG_NAME).addPayload(lineItemUpdate);

                    self.channel.publish(msg);
                }

                def.resolve(self);
            }, function () {
                def.reject.apply(def, arguments);
            });
        }

        if (!lineItem._attachments || !lineItem._attachments.length) return uploadComplete();

        new Max.Uploader(lineItem._attachments, function(e, multipart) {
            if (e || !multipart) return def.reject(e);

            multipart.objectUpload().success(function(attachmentRefs) {
                lineItem.attachments = lineItem.attachments || {};
                delete lineItem._attachments;
                for (var i=0;i<attachmentRefs.length;++i) {
                    self.attachments[attachmentRefs[i].fileId] = new Max.Attachment(attachmentRefs[i]);
                }

                uploadComplete();
            }).error(function(e) {
                def.reject(e);
            });
        });

    }, 0);

    return def.promise;
};

/**
 * Remove an approval line item.
 * @param {Max.ApprovalLineItem} lineItem Line item to remove.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the updated {Max.Approval} or reason of failure.
 */
Max.Approval.prototype.removeLineItem = function(lineItem) {
    var self = this, serverApproval, def = new Max.Deferred(), lineItemUpdate;

    var index = Max.Utils.getIndexById(self.lineItems, lineItem.id);

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!lineItem || index === false)
            return def.reject(Max.Error.INVALID_LINE_ITEM);

        self.lineItems = self.lineItems || [];
        self.lineItems.splice(index, 1);

        Max.Request({
            method: 'DELETE',
            url: '/com.magnet.server/approval/' + self.approvalId + '/lineitem/' + lineItem.id
        }, function (data) {

            lineItemUpdate = new Max.ApprovalLineItemUpdate(self, self.lineItems, mCurrentUser.userId,
                    Max.Utils.dateToISO8601(new Date()));

            if (self.channel) {
                var msg = new Max.Message({
                    subject: self.title
                }, null, null, DEFAULT_POLL_ANSWER_CONFIG_NAME).addPayload(lineItemUpdate);

                self.channel.publish(msg);
            }

            def.resolve(self);
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Approve an approval and publish a message to the channel.
 * @param {string} [comments] Optional comments about this approval.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} which was published to channel or reason of failure.
 */
Max.Approval.prototype.approve = function(comments) {
    return this.choose(Max.Approval.Answer.YES, comments);
};

/**
 * Reject an approval and publish a message to the channel.
 * @param {string} [comments] Optional comments about this rejection.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} which was published to channel or reason of failure.
 */
Max.Approval.prototype.reject = function(comments) {
    return this.choose(Max.Approval.Answer.NO, comments);
};

/**
 * Choose whether to approve or reject an approval request. The result will be published to the channel.
 * @param {Max.Approval.Answer} answer The answer of the approval.
 * @param {string} [comments] Optional comments about this approval or rejection.
 * @returns {Max.Promise.<Max.Message>} A promise object returning the {Max.Message} which was published to channel or reason of failure.
 * @private
 */
Max.Approval.prototype.choose = function(answer, comments) {
    var self = this, def = new Max.Deferred(), approvalSelection, status, selection, user;

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        selection = answer === Max.Approval.Answer.YES ? 'approve' : 'reject';
        status = answer === Max.Approval.Answer.YES ? Max.Approval.Status.APPROVED : Max.Approval.Status.REJECTED;

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/approval/' + self.approvalId + '/' + selection +
            (comments ? ('?comment=' + encodeURIComponent(comments)) : '')
        }, function() {
                approvalSelection = new Max.ApprovalAnswer(self, status, comments, mCurrentUser.userId,
                    Max.Utils.dateToISO8601(new Date()));

            self.updateResults(approvalSelection);

            if (self.channel) {
                var msg = new Max.Message({
                    subject: self.title
                }, null, null, DEFAULT_POLL_ANSWER_CONFIG_NAME).addPayload(approvalSelection);

                self.channel.publish(msg);
            }

            def.resolve('ok');
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Pass in {Max.ApprovalAnswer} or {Max.ApprovalLineItemUpdate} to update the approval object locally without a fetch from the server.
 * @param {Max.ApprovalAnswer|Max.ApprovalLineItemUpdate} approvalUpdate An approval answer or approval update.
 */
Max.Approval.prototype.updateResults = function(approvalUpdate) {
    var alreadyUpdated = false, i;

    if (approvalUpdate.lineItems) {
        this.lineItems = approvalUpdate.lineItems;
        return;
    }

    this.historyItems = this.historyItems || [];

    for (i=0;i<this.historyItems.length;++i) {
        if (this.historyItems[i].user.userId == approvalUpdate.approverId) {
            alreadyUpdated = true;
            break;
        }
    }

    if (alreadyUpdated) return;

    this.historyItems.push({
        comment: approvalUpdate.comments,
        date: approvalUpdate.createdAt,
        status: approvalUpdate.status,
        user: approvalUpdate.approverId
    });

    if (this.mode == Max.Approval.Mode.SEQUENTIAL) {
        var nextApprover = Max.ApprovalHelper.getNextApprover(this);
        this.assignedUsers = nextApprover ? [nextApprover] : [];
    } else {
        for (i=0;i<this.assignedUsers.length;++i) {
            if (this.assignedUsers[i].userId == approvalUpdate.approverId) {
                this.assignedUsers.slice(i, 1);
                break;
            }
        }
    }

    if (this.mode == Max.Approval.Mode.NONE
        || this.historyItems.length == this.approvers.length
        || approvalUpdate.status == Max.Approval.Status.REJECTED) {
        this.status = Max.Approval.Status.APPROVED;
        for (i=0;i<this.historyItems.length;++i) {
            if (this.historyItems[i].status == Max.Approval.Status.REJECTED) {
                this.status = Max.Approval.Status.REJECTED;
                break;
            }
        }
    }
};

/**
 * Refresh the approval results.
 * @returns {Max.Promise.<Max.Approval>} A promise object returning the {Max.Approval} or reason of failure.
 */
Max.Approval.prototype.refreshResults = function() {
    var self = this, def = new Max.Deferred();

    Max.Approval.get(self.approvalId).success(function(approval) {
        self.assignedUsers = approval.assignedUsers;
        self.updatedDate = approval.updatedDate;
        self.updatedBy = approval.updatedBy;
        self.historyItems = approval.historyItems;
        self.lineItems = approval.lineItems;
        self.status = approval.status;

        def.resolve.apply(def, arguments);
    }).error(function() {
        def.reject.apply(def, arguments);
    });

    return def.promise;
};

/**
 * Delete the current approval. Can only be deleted by the approval creator.
 * @returns {Max.Promise.<object>} A promise object returning success report or reason of failure.
 * @private
 */
Max.Approval.prototype.delete = function() {
    var self = this, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if ((self.ownerId || (self.createdBy || {}).userId) != mCurrentUser.userId) return def.reject(Max.Error.FORBIDDEN);

        Max.Request({
            method: 'DELETE',
            url: '/com.magnet.server/approval/' + self.approvalId
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Add an attachment to the approval.
 * @param {string} metaKey The property name with which the attachment can be referenced by from the approval.attachments object.
 * @param {File} [attachment] One File object created by an input[type="file"] HTML element. A single File object should be passed, not a FileList.
 */
Max.Approval.prototype.addAttachment = function(metaKey, attachment) {
    if (!metaKey) throw ('INVALID_ATTACHMENT_KEY');

    this._attachments = this._attachments || [];

    if (attachment.type) {
        attachment.metaKey = metaKey;
        this._attachments.push(attachment);
    }
    return this;
};

/**
 * @constructor
 * @class
 * The ApprovalProperty class represents information about a property of an approval request. The approver will look at the approval properties to decide for an approval or rejection.
 * @param {object} approvalPropertyObj Object containing approval property details
 * @param {string} approvalPropertyObj.name Name of the approval property.
 * @param {string} approvalPropertyObj.value Value of the approval property.
 * @param {Max.Approval.PropertyType} approvalPropertyObj.type Data type of the property.
 * @param {boolean} approvalPropertyObj.optional If optional is false, the property value will be validated during creation.
 * @property {string} name Name of the approval property.
 * @property {string} value Value of the approval property.
 * @property {Max.Approval.PropertyType} type Data type of the property.
 * @property {boolean} optional If optional is false, the property value will be validated during creation.
 */
Max.ApprovalProperty = function(approvalPropertyObj) {
    Max.Utils.mergeObj(this, approvalPropertyObj);
};

/**
 * @constructor
 * @class
 * The ApprovalHistoryItem class contains information about the action taken each time an approver approves or rejects an approval.
 * @property {Max.Approval.Status} status The action taken by the approver, in the form of an {Max.Approval.Status}.
 * @property {string} userId User identifier of the approver who responded to the approval.
 * @property {Date} date Date when the approval was updated
 * @property {string} [comment] Comment is available if the approver commented on the approval or rejection.
 */
Max.ApprovalHistoryItem = function(status, userId, date, comment) {
    this.status = status;
    this.userId = userId;
    this.date = date;
    this.comment = comment;
};

/**
 * @constructor
 * @class
 * The ApprovalLineItem class represents a purchase related to an approval. It can be used for tracking expenses accrued when the approval creator spends money.
 * @param {object} lineItem An approval line item.
 * @param {string} lineItem.name Name of the line item.
 * @param {string} [lineItem.description] Description of the line item.
 * @param {number} [lineItem.amount] Quantity of the line item.
 * @param {string} [lineItem.timeUnit] Unit of time. Only available if the line item involves time.
 * @param {number} [lineItem.time] Unit of time. Only available if the line item involves time.
 * @param {Max.Attachment[]} [lineItem.attachments] Attachments associated with the line item.
 * @param {Date} lineItem.date Date when the line item was created.
 * @property {string} name Name of the line item.
 * @property {string} [description] Description of the line item.
 * @property {number} [amount] Quantity of the line item.
 * @property {string} [timeUnit] Unit of time. Only available if the line item involves time.
 * @property {number} [time] Unit of time. Only available if the line item involves time.
 * @property {Max.Attachment[]} [attachments] Attachments associated with the line item.
 * @property {Date} date Date when the line item was created.
 */
Max.ApprovalLineItem = function(lineItem) {
    Max.Utils.mergeObj(this, lineItem);
};

/**
 * Add an attachment to the approval line item.
 * @param {string} metaKey The property name with which the attachment can be referenced by from the lineItem.attachments object.
 * @param {File} [attachment] One File object created by an input[type="file"] HTML element. A single File object should be passed, not a FileList.
 */
Max.ApprovalLineItem.prototype.addAttachment = function(metaKey, attachment) {
    if (!metaKey) throw ('INVALID_ATTACHMENT_KEY');

    this._attachments = this._attachments || [];

    if (attachment.type) {
        attachment.metaKey = metaKey;
        this._attachments.push(attachment);
    }
    return this;
};

/**
 * @constructor
 * @class
 * The ApprovalAnswer class is returned by the {Max.EventListener} after a responder chooses to approve or rejected the approval.
 * @property {string} approvalId {Max.Approval} identifier.
 * @property {string} title The title of this approval.
 * @property {string} description The description of this approval.
 * @property {string} [comments] Optional comments about this approval.
 * @property {Max.Approval.Status} status The status of the approval.
 * @property {string} approverId User identifier of the responder who answered the approval.
 * @property {Date} createdAt Date when the answer was created.
 */
Max.ApprovalAnswer = function(approval, status, comments, userId, date) {
    approval = approval || {};
    this.TYPE = Max.MessageType.APPROVAL_ANSWER;
    this.approvalId = approval.approvalId;
    this.title = approval.title;
    this.description = approval.description;
    this.approvalDescription = approval.description;
    this.comments = comments;
    this.status = status;
    this.approverId = userId;
    this.createdAt = date;
};

Max.ApprovalAnswer.prototype.parsePayload = function() {
    this.createdAt = Max.Utils.ISO8601ToDate(this.createdAt);
};

/**
 * @constructor
 * @class
 * The ApprovalLineItem class is returned by the {Max.EventListener} after an update is made to the approval line items.
 * @property {string} approvalId {Max.Approval} identifier.
 * @property {Max.ApprovalLineItem[]} lineItems Updated list of approval line items.
 * @property {string} senderId User identifier of the line item updater.
 * @property {Date} updatedAt Date when the update was made.
 */
Max.ApprovalLineItemUpdate = function(approval, lineItems, userId, updatedAt) {
    approval = approval || {};
    this.TYPE = Max.MessageType.APPROVAL_LINE_ITEM_UPDATE;
    this.approvalId = approval.approvalId;
    this.lineItems = lineItems;
    this.senderId = userId;
    this.updatedAt = updatedAt;
};

Max.ApprovalLineItemUpdate.prototype.parsePayload = function() {
    this.updatedAt = Max.Utils.ISO8601ToDate(this.updatedAt);
    for (i=0;i<this.lineItems.length;++i) {
        this.lineItems[i].date = Max.Utils.ISO8601ToDate(this.lineItems[i].date);
        this.lineItems[i] = new Max.ApprovalLineItem(this.lineItems[i]);
    }
};

/**
 * The ApprovalTemplate class is a local representation of an approval template in the MagnetMax platform. This class provides various
 * approval template specific methods, like creating a template from an approval.
 * @constructor
 * @property {string} approvalTemplateId Approval template identifier.
 * @property {string} title The title of this approval.
 * @property {string} appId The identifier of the app this approval template belongs to.
 * @property {string} description A description of this approval.
 * @property {Max.ApprovalProperty[]} properties A list of properties concerning an approval request. The approver will look at the approval properties to decide for an approval or rejection.
 * @property {object} extras A user-defined object used to store arbitrary data will can accessed from a {Max.Approval} instance.
 * @property {Date} createdDate The date this approval template was created.
 * @property {Max.User} createdBy Approval template creator.
 * @property {Date} [updatedDate] Date when the approval template was last updated.
 * @property {Max.User} [updatedBy] User who last updated the approval template.
 */
Max.ApprovalTemplate = function(templateObj) {
    Max.Utils.mergeObj(this, templateObj);
    this.extras = this.extras || {};
    return this;
};

/**
 * Create an approval template from an approval.
 * @param {Max.Approval} approval An approval.
 * @returns {Max.ApprovalTemplate} An approval template created from the approval.
 */
Max.ApprovalTemplate.saveApprovalAsTemplate = function(approval) {
    var self = this, serverTmpl, def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser)
            return def.reject(Max.Error.SESSION_EXPIRED);
        if (!approval)
            return def.reject(Max.Error.INVALID_APPROVAL);

        serverTmpl = Max.ApprovalHelper.approvalToServerTemplate(approval);

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/approval/template',
            data: serverTmpl
        }, function (data) {
            def.resolve(Max.ApprovalHelper.serverTemplateToTemplate(data));
        }, function () {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Get all approval templates created by the current user.
 * @returns {Max.Promise.<Max.ApprovalTemplate[]>} A promise object returning a list of {Max.ApprovalTemplate} or reason of failure.
 */
Max.ApprovalTemplate.fetchAllTemplates = function() {
    var def = new Max.Deferred(), tmpls = [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/approval/template'
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                tmpls.push(Max.ApprovalHelper.serverTemplateToTemplate(data[i]));
            }

            def.resolve(tmpls, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Types of approvals. Approvals created by the current user are considered REQUESTED approvals, while RECEIVED approvals are created by others.
 * @readonly
 * @enum {string}
 */
Max.Approval.Type = {
    REQUESTED: 'REQUESTED',
    RECEIVED: 'RECEIVED'
};

/**
 * Status of an approval. All approvals are in PENDING state during creation, and change status after an approver responds.
 * @readonly
 * @enum {string}
 */
Max.Approval.Status = {
    NONE: 'NONE',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
    DELETED: 'DELETED',
    RESUBMITTED: 'RESUBMITTED'
};

/**
 * Mode of an approval. {Max.Approval.Mode.SEQUENTIAL} requires each of the approvers to approve and approval in the order of the approval.approvers array. If any of the approvers rejects the approval, the entire approval will be rejected. {Max.Approval.Mode.ANY_ORDER} allows all of the approvers to respond to the approval at any time.
 * @readonly
 * @enum {string}
 */
Max.Approval.Mode = {
    ANY_ORDER: 'ANY_ORDER',
    SEQUENTIAL: 'SEQUENTIAL',
    NONE: 'NONE'
};

/**
 * Data type of an approval property.
 * @readonly
 * @enum {string}
 */
Max.Approval.PropertyType = {
    AMOUNT: 'AMOUNT',
    DATE: 'DATE',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    TIME_IN_DAYS: 'TIME_IN_DAYS'
};

/**
 * Available choices for an approval.
 * @readonly
 * @enum {string}
 * @private
 */
Max.Approval.Answer = {
    YES: 'YES',
    NO: 'NO'
};

Max.registerPayloadType(Max.MessageType.APPROVAL, Max.Approval);
Max.registerPayloadType(Max.MessageType.APPROVAL_ANSWER, Max.ApprovalAnswer);
Max.registerPayloadType(Max.MessageType.APPROVAL_LINE_ITEM_UPDATE, Max.ApprovalLineItemUpdate);

/**
 * @constructor
 * @class
 * Contains helper methods related to approvals.
 * @private
 */
Max.ApprovalHelper = {
    /**
     * Create {Max.Approval} from server approval.
     * @param {object} serverApprovalObj A server approval object.
     * @returns {Max.Approval} a approval.
     */
    serverApprovalToApproval: function(serverApprovalObj) {
        var appr = serverApprovalObj, i;

        for (i=0;i<appr.historyItems.length;++i) {
            appr.historyItems[i].date = Max.Utils.ISO8601ToDate(appr.historyItems[i].date);
            appr.historyItems[i].user = new Max.User(appr.historyItems[i].user);
        }

        var approvalObj = {
            approvalId: appr.id,
            appId: appr.appId,
            status: appr.status || Max.Approval.Status.PENDING,
            title: appr.title,
            description: appr.description,
            channelId: appr.channelId,
            preApprovalChannelId: appr.preApprovalChannelId,
            updatedDate: appr.updatedDate ? Max.Utils.ISO8601ToDate(appr.updatedDate) : null,
            updatedBy: appr.updatedBy ? new Max.User(appr.updatedBy) : null,
            assignedUsers: [],
            properties: appr.properties,
            approvers: [],
            lineItems: appr.lineItems,
            historyItems: appr.historyItems,
            createdDate: appr.createdDate ? Max.Utils.ISO8601ToDate(appr.createdDate) : null,
            createdBy: new Max.User(appr.createdBy),
            mode: appr.mode || Max.Approval.Mode.ANY_ORDER,
            extras: appr.metaData || {}
            // TODO: templateId
        };

        for (i=0;i<approvalObj.lineItems.length;++i) {
            approvalObj.lineItems[i] = this.serverLineItemToLineItem(approvalObj.lineItems[i]);
        }

        if (appr.attachments && !Max.Utils.isEmptyObject(appr.attachments)) {
            approvalObj.attachments = Max.ApprovalHelper.fromServerAttachment(appr.attachments);
        }

        for (i=0;i<appr.approvers.length;++i) {
            approvalObj.approvers.push(new Max.User(appr.approvers[i]));
        }

        if (appr.assignedUsers.length) {
            for (var i=0;i<appr.assignedUsers.length;++i) {
                approvalObj.assignedUsers.push(new Max.User(appr.assignedUsers[i]));
            }
        }

        if (approvalObj.preApprovalChannelId) {
            approvalObj.preApprovalChannel = Max.ChannelHelper.channelIdToChannel(approvalObj.preApprovalChannelId);
        }

        if (approvalObj.channelId) {
            approvalObj.channel = Max.ChannelHelper.channelIdToChannel(approvalObj.channelId);
        }

        return new Max.Approval(approvalObj);
    },
    /**
     * Create {Max.ApprovalLineItem} from server line item.
     * @param {object} lineItemObj A server line item.
     * @returns {Max.ApprovalLineItem} A line item.
     */
    serverLineItemToLineItem: function(lineItemObj) {
        var lineItem = new Max.ApprovalLineItem(lineItemObj);
        lineItem.date = Max.Utils.ISO8601ToDate(lineItem.date);
        lineItem.attachments = Max.ApprovalHelper.fromServerAttachment(lineItem.attachments);
        return lineItem;
    },
    /**
     * Create server approval from {Max.Approval}.
     * @param {Max.Approval} approval An approval.
     * @param {Max.Channel} [preApprovalChannel] A preapproval channel.
     * @param {Max.Channel} [channel] A channel.
     * @returns {object} A server approval.
     */
    approvalToServerApproval: function(approval, preApprovalChannel, channel) {
        var serverApproval = {};

        if (approval.createdDate) {
            serverApproval = Max.Utils.mergeObj({}, approval);
            serverApproval.id = serverApproval.approvalId;
            serverApproval.createdDate = Max.Utils.dateToISO8601(serverApproval.createdDate);
            if (serverApproval.updatedDate) {
                serverApproval.updatedDate = Max.Utils.dateToISO8601(serverApproval.updatedDate);
            }
            delete serverApproval.createdBy;
            delete serverApproval.updatedBy;
            serverApproval.attachments = {};
            serverApproval.lineItems = [];
        }

        serverApproval.title = approval.title;
        serverApproval.description = approval.description;
        serverApproval.status = approval.status;
        serverApproval.mode = approval.mode;
        serverApproval.metaData = approval.extras;
        serverApproval.properties = approval.properties;
        // TODO: templateId

        if (preApprovalChannel) serverApproval.preApprovalChannelId = preApprovalChannel.getChannelId();
        if (channel) serverApproval.channelId = channel.getChannelId();

        serverApproval.approvers = Max.UserHelper.userToUserIds(approval.approvers, true);

        if (approval.attachments) {
            serverApproval.attachments = approval.attachments;
        }

        if (approval.lineItems && approval.lineItems.length) {
            for (var i=0;i<approval.lineItems.length;++i) {
                var lineItem = Max.Utils.mergeObj({}, approval.lineItems[i]);
                lineItem.date = Max.Utils.dateToISO8601(approval.date);
                lineItem.attachments = Max.ApprovalHelper.toServerAttachment(approval.lineItems[i].attachments) || {};
                serverApproval.lineItems.push(lineItem);
            }
        }

        return serverApproval;
    },
    /*
     * Get the next assignedUser from {Max.Approval}
     * @param {Max.Approval} approval An approval.
     * @param {Max.User} The next user to approver, or null if approval is completed or mode is not {Max.Approval.Mode.SEQUENTIAL}.
     */
    getNextApprover: function(approval) {
        var user = null;

        if (approval.mode != Max.Approval.Mode.SEQUENTIAL || approval.historyItems.length == approval.approvers.length)
            return user;

        for (var i=0;i<approval.approvers.length;++i) {
            if (!approval.historyItems[i]) {
                user = approval.approvers[i];
                break;
            }
        }
        return user;
    },
    /**
     * Create {Max.ApprovalTemplate} from server approval template.
     * @param {object} serverTemplateObj A server approval template object.
     * @returns {Max.ApprovalTemplate} an approval template.
     */
    serverTemplateToTemplate: function(serverTemplateObj) {
        var tmpl = serverTemplateObj;

        var templateObj = {
            approvalTemplateId: tmpl.id,
            appId: tmpl.appId,
            title: tmpl.title,
            description: tmpl.description,
            updatedDate: tmpl.updatedDate ? Max.Utils.ISO8601ToDate(tmpl.updatedDate) : null,
            updatedBy: tmpl.updatedBy ? new Max.User(tmpl.updatedBy) : null,
            properties: [],
            createdDate: tmpl.createdDate ? Max.Utils.ISO8601ToDate(tmpl.createdDate) : null,
            createdBy: new Max.User(tmpl.createdBy),
            extras: tmpl.metaData || {}
        };

        for (var i=0;i<serverTemplateObj.properties.length;++i) {
            templateObj.properties.push(new Max.ApprovalProperty(serverTemplateObj.properties[i]));
        }


        return new Max.ApprovalTemplate(templateObj);
    },
    /**
     * Create server approval template from {Max.Approval}.
     * @param {Max.Approval} approval An approval.
     * @returns {object} A server approval.
     */
    approvalToServerTemplate: function(approval) {
        var serverTmpl = {};

        serverTmpl.title = approval.title;
        serverTmpl.description = approval.description;
        serverTmpl.appId = approval.appId || Max.App.appId;
        serverTmpl.metaData = approval.extras;
        serverTmpl.properties = approval.properties;
        serverTmpl.createdBy = {
            userIdentifier: mCurrentUser.userId
        };

        return serverTmpl;
    },
    /**
     * Get a query containing list of approval statuses.
     * @param {string} param Name of the parameter to be represented as a REST.
     * @param {Max.Approval.Status[]} [statuses] List of approval statuses.
     * @returns {string} Querystring parameters to be included in REST path.
     */
    getStatusQuery: function(param, statuses) {
        var defaultFilter = [Max.Approval.Status.APPROVED, Max.Approval.Status.PENDING, Max.Approval.Status.REJECTED];
        var query = '';

        if (!statuses || !statuses.length) statuses = [];

        for (var i=0;i<statuses.length;++i) {
            query += '&' + param + '=' + statuses[i];
        }
        return query;
    },
    fromServerAttachment: function(attachments) {
        if (!attachments) return null;
        for (var key in attachments) {
//            attachments[key] = Max.Utils.getValidJSON(attachments[key]);
            attachments[key] = new Max.Attachment(attachments[key]);
        }
        return attachments;
    },
    toServerAttachment: function(attachments) {
        var obj = {};
        if (!attachments) return null;
        for (var key in attachments) {
            if(attachments.hasOwnProperty(key)) {
                obj[key] = JSON.stringify(attachments[key]);
            }
        }
        return obj;
    }
};

/**
 * @constructor
 * @class
 * The Usergroup class is a local representation of a usergroup in the MagnetMax platform. This class provides various user specific methods, like create, update and delete User Group.
 * @property {string} groupId Group's group identifier.
 * @property {string} groupName Group's groupname.
 * @property {string} [description] Group's Description.
 * @property {string} [type] Group's type.
 */
Max.Usergroup = function(userGroupObj) {
    userGroupObj = userGroupObj || {};
    if ( !userGroupObj.groupId && userGroupObj.id ) userGroupObj.groupId = userGroupObj.id;
    delete userGroupObj.id;
    userGroupObj.groupName = userGroupObj.name;

    Max.Utils.mergeObj(this, userGroupObj);
    return this;
};

/**
 * Create a usergroup.
 * @param {Max.Usergroup} usergroup Contents of the usergroup. See {Max.Usergroup} for more information.
 * @returns {Max.Promise.<Max.Usergroup>} A promise object returning the newly created {Max.Usergroup} or reason of failure.
 */
Max.Usergroup.create = function(Usergroup) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!Usergroup) return def.reject(Max.Error.INVALID_USERGROUP_BODY);

        Usergroup.creatorId = mCurrentUser.userId;

        Max.Request({
            method: 'POST',
            url: '/com.magnet.server/usergroup',
            data: Usergroup,
            headers: {
                'Authorization': 'Bearer ' + (Max.App.hatCredentials || {}).access_token
            }
        }, function(data, details) {
            def.resolve(new Max.Usergroup(data), details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Fetch created By Me usergroups given a object type.
 * @param {Max.Usergroup.ObjectType} objectType The type of the object in which the usergroup exists.
 * @returns {Max.Promise.<Max.Usergroup[]>} A promise object returning a list of {Max.Usergroup} or reason of failure.
 */
Max.Usergroup.get = function() {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/usergroup/createdByMe'
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                data[i] = new Max.Usergroup(data[i]);
            }
            def.resolve(data, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Fetch all usergroups given a object type.
 * @param {Max.Usergroup.ObjectType} objectType The type of the object in which the usergroup exists.
 * @returns {Max.Promise.<Max.Usergroup[]>} A promise object returning a list of {Max.Usergroup} or reason of failure.
 */
Max.Usergroup.getAll = function() {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/usergroup/v2'
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                data[i] = new Max.Usergroup(data[i]);
            }
            def.resolve(data, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Fetch all usergroups by GroupID given a object type.
 * @param {Max.Usergroup.groupId} groupId The type of the string in which the usergroup exists.
 * @returns {Max.Promise.<Max.Usergroup[]>} A promise object returning a list of {Max.Usergroup} or reason of failure.
 */
Max.Usergroup.getById = function(groupId) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!groupId) return def.reject(Max.Error.INVALID_USERGROUP_ID);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/usergroup/' + groupId
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                data[i] = new Max.Usergroup(data[i]);
            }
            def.resolve(data, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Fetch all Users of the Usergroup by GroupID given a object type.
 * @param {Max.Usergroup.groupId} groupId The type of the string in which the usergroup exists.
 * @returns {Max.Promise.<Max.Usergroup[]>} A promise object returning a list of {Max.Usergroup} or reason of failure.
 */
Max.Usergroup.getUsersById = function(groupId) {
    var def = new Max.Deferred(), userlist = [];

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!groupId) return def.reject(Max.Error.INVALID_USERGROUP_ID);

        Max.Request({
            method: 'GET',
            url: '/com.magnet.server/usergroup/' + groupId + '/users'
        }, function(data, details) {
            for (var i=0;i<data.length;++i) {
                userlist.push(new Max.User(data[i]));
            }
            def.resolve(userlist, details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Assign users to usergroup.
 * @param {Max.UserIds} userIds Contents of the array of the user ids.
 * @returns {Max.Promise.<Max.Usergroup>} A promise object returning the updated {Max.Usergroup} or reason of failure.
 */
Max.Usergroup.assign = function(groupId, userIds) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if ( !Max.Utils.isArray(userIds) || !userIds.length ) return def.reject(Max.Error.INVALID_USER_IDS);

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/usergroup/' + groupId + '/assign',
            data: userIds
        }, function(data, details) {
            def.resolve(new Max.Usergroup(data), details);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Unassign users from usergroup.
 * @param {Max.UserIds} userIds Contents of the array of the user ids.
 * @returns {Max.Promise.<Max.Usergroup>} A promise object returning the updated {Max.Usergroup} or reason of failure.
 */
Max.Usergroup.unassign = function(groupId, userIds) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        if (!Max.Utils.isArray(userIds) || !userIds.length) return def.reject(Max.Error.INVALID_USER_IDS);

        Max.Request({
            method: 'PUT',
            url: '/com.magnet.server/usergroup/' + groupId + '/unassign',
            data: userIds
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};

/**
 * Delete usergroup.
 * @param {Max.UserIds} userIds Contents of the array of the user ids.
 * @returns {Max.Promise.<Max.Usergroup>} A promise object returning success report or reason of failure.
 */
Max.Usergroup.delete = function(groupId) {
    var def = new Max.Deferred();

    setTimeout(function() {
        if (!mCurrentUser) return def.reject(Max.Error.SESSION_EXPIRED);
        Max.Request({
            method: 'DELETE',
            url: '/com.magnet.server/usergroup/' + groupId
        }, function() {
            def.resolve.apply(def, arguments);
        }, function() {
            def.reject.apply(def, arguments);
        });
    }, 0);

    return def.promise;
};


})(typeof exports === 'undefined' ? this['Max'] || (this['Max']={}) : exports);