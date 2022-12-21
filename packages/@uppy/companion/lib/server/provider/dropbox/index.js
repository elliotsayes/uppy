var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DropBox_instances, _DropBox_withErrorHandling;
const got = require('got').default;
const Provider = require('../Provider');
const adaptData = require('./adapter');
const { withProviderErrorHandling } = require('../providerErrors');
const { prepareStream } = require('../../helpers/utils');
// From https://www.dropbox.com/developers/reference/json-encoding:
//
// This function is simple and has OK performance compared to more
// complicated ones: http://jsperf.com/json-escape-unicode/4
const charsToEncode = /[\u007f-\uffff]/g;
function httpHeaderSafeJson(v) {
    return JSON.stringify(v).replace(charsToEncode, (c) => {
        return `\\u${(`000${c.charCodeAt(0).toString(16)}`).slice(-4)}`;
    });
}
const getClient = ({ token }) => got.extend({
    prefixUrl: 'https://api.dropboxapi.com/2',
    headers: {
        authorization: `Bearer ${token}`,
    },
});
function list({ directory, query, token }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query.cursor) {
            return getClient({ token }).post('files/list_folder/continue', { json: { cursor: query.cursor }, responseType: 'json' }).json();
        }
        return getClient({ token }).post('files/list_folder', { searchParams: query, json: { path: `${directory || ''}`, include_non_downloadable_files: false }, responseType: 'json' }).json();
    });
}
function userInfo({ token }) {
    return __awaiter(this, void 0, void 0, function* () {
        return getClient({ token }).post('users/get_current_account', { responseType: 'json' }).json();
    });
}
/**
 * Adapter for API https://www.dropbox.com/developers/documentation/http/documentation
 */
class DropBox extends Provider {
    constructor(options) {
        super(options);
        _DropBox_instances.add(this);
        this.authProvider = DropBox.authProvider;
        // needed for the thumbnails fetched via companion
        this.needsCookieAuth = true;
    }
    static get authProvider() {
        return 'dropbox';
    }
    /**
     *
     * @param {object} options
     */
    list(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _DropBox_instances, "m", _DropBox_withErrorHandling).call(this, 'provider.dropbox.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const responses = yield Promise.all([
                    list(options),
                    userInfo(options),
                ]);
                // @ts-ignore
                const [stats, { email }] = responses;
                return adaptData(stats, email, options.companion.buildURL);
            }));
        });
    }
    download({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _DropBox_instances, "m", _DropBox_withErrorHandling).call(this, 'provider.dropbox.download.error', () => __awaiter(this, void 0, void 0, function* () {
                const stream = getClient({ token }).stream.post('files/download', {
                    prefixUrl: 'https://content.dropboxapi.com/2',
                    headers: {
                        'Dropbox-API-Arg': httpHeaderSafeJson({ path: String(id) }),
                    },
                    body: Buffer.alloc(0),
                    responseType: 'json',
                });
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    thumbnail({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _DropBox_instances, "m", _DropBox_withErrorHandling).call(this, 'provider.dropbox.thumbnail.error', () => __awaiter(this, void 0, void 0, function* () {
                const stream = getClient({ token }).stream.post('files/get_thumbnail_v2', {
                    prefixUrl: 'https://content.dropboxapi.com/2',
                    headers: { 'Dropbox-API-Arg': httpHeaderSafeJson({ resource: { '.tag': 'path', path: `${id}` }, size: 'w256h256' }) },
                    body: Buffer.alloc(0),
                    responseType: 'json',
                });
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    size({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _DropBox_instances, "m", _DropBox_withErrorHandling).call(this, 'provider.dropbox.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const { size } = yield getClient({ token }).post('files/get_metadata', { json: { path: id }, responseType: 'json' }).json();
                return parseInt(size, 10);
            }));
        });
    }
    logout({ token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _DropBox_instances, "m", _DropBox_withErrorHandling).call(this, 'provider.dropbox.logout.error', () => __awaiter(this, void 0, void 0, function* () {
                yield getClient({ token }).post('auth/token/revoke', { responseType: 'json' });
                return { revoked: true };
            }));
        });
    }
}
_DropBox_instances = new WeakSet(), _DropBox_withErrorHandling = function _DropBox_withErrorHandling(tag, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        return withProviderErrorHandling({
            fn,
            tag,
            providerName: this.authProvider,
            isAuthError: (response) => response.statusCode === 401,
            getJsonErrorMessage: (body) => body === null || body === void 0 ? void 0 : body.error_summary,
        });
    });
};
module.exports = DropBox;
