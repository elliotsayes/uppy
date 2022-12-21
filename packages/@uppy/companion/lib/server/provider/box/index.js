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
var _Box_instances, _Box_withErrorHandling;
const got = require('got').default;
const Provider = require('../Provider');
const adaptData = require('./adapter');
const { withProviderErrorHandling } = require('../providerErrors');
const { prepareStream } = require('../../helpers/utils');
const BOX_FILES_FIELDS = 'id,modified_at,name,permissions,size,type';
const BOX_THUMBNAIL_SIZE = 256;
const getClient = ({ token }) => got.extend({
    prefixUrl: 'https://api.box.com/2.0',
    headers: {
        authorization: `Bearer ${token}`,
    },
});
function getUserInfo({ token }) {
    return __awaiter(this, void 0, void 0, function* () {
        return getClient({ token }).get('users/me', { responseType: 'json' }).json();
    });
}
function list({ directory, query, token }) {
    return __awaiter(this, void 0, void 0, function* () {
        const rootFolderID = '0';
        return getClient({ token }).get(`folders/${directory || rootFolderID}/items`, { searchParams: { fields: BOX_FILES_FIELDS, offset: query.cursor }, responseType: 'json' }).json();
    });
}
/**
 * Adapter for API https://developer.box.com/reference/
 */
class Box extends Provider {
    constructor(options) {
        super(options);
        _Box_instances.add(this);
        this.authProvider = Box.authProvider;
        // needed for the thumbnails fetched via companion
        this.needsCookieAuth = true;
    }
    static get authProvider() {
        return 'box';
    }
    /**
     * Lists files and folders from Box API
     *
     * @param {object} options
     * @param {string} options.directory
     * @param {any} options.query
     * @param {string} options.token
     * @param {unknown} options.companion
     */
    list({ directory, token, query, companion }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Box_instances, "m", _Box_withErrorHandling).call(this, 'provider.box.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const [userInfo, files] = yield Promise.all([
                    getUserInfo({ token }),
                    list({ directory, query, token }),
                ]);
                return adaptData(files, userInfo.login, companion);
            }));
        });
    }
    download({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Box_instances, "m", _Box_withErrorHandling).call(this, 'provider.box.download.error', () => __awaiter(this, void 0, void 0, function* () {
                const stream = getClient({ token }).stream.get(`files/${id}/content`, { responseType: 'json' });
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    thumbnail({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Box_instances, "m", _Box_withErrorHandling).call(this, 'provider.box.thumbnail.error', () => __awaiter(this, void 0, void 0, function* () {
                const extension = 'jpg'; // you can set this to png to more easily reproduce http 202 retry-after
                // From box API docs:
                // Sometimes generating a thumbnail can take a few seconds.
                // In these situations the API returns a Location-header pointing to a placeholder graphic
                // for this file type.
                // The placeholder graphic can be used in a user interface until the thumbnail generation has completed.
                // The Retry-After-header indicates when to the thumbnail will be ready.
                // At that time, retry this endpoint to retrieve the thumbnail.
                //
                // This can be reproduced more easily by changing extension to png and trying on a newly uploaded image
                const stream = getClient({ token }).stream.get(`files/${id}/thumbnail.${extension}`, {
                    searchParams: { max_height: BOX_THUMBNAIL_SIZE, max_width: BOX_THUMBNAIL_SIZE },
                    responseType: 'json',
                });
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    size({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Box_instances, "m", _Box_withErrorHandling).call(this, 'provider.box.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const { size } = yield getClient({ token }).get(`files/${id}`, { responseType: 'json' }).json();
                return parseInt(size, 10);
            }));
        });
    }
    logout({ companion, token }) {
        return __classPrivateFieldGet(this, _Box_instances, "m", _Box_withErrorHandling).call(this, 'provider.box.logout.error', () => __awaiter(this, void 0, void 0, function* () {
            const { key, secret } = companion.options.providerOptions.box;
            yield getClient({ token }).post('oauth2/revoke', {
                prefixUrl: 'https://api.box.com',
                form: {
                    client_id: key,
                    client_secret: secret,
                    token,
                },
                responseType: 'json',
            });
            return { revoked: true };
        }));
    }
}
_Box_instances = new WeakSet(), _Box_withErrorHandling = function _Box_withErrorHandling(tag, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        return withProviderErrorHandling({
            fn,
            tag,
            providerName: this.authProvider,
            isAuthError: (response) => response.statusCode === 401,
            getJsonErrorMessage: (body) => body === null || body === void 0 ? void 0 : body.message,
        });
    });
};
module.exports = Box;
