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
var _OneDrive_instances, _OneDrive_withErrorHandling;
const got = require('got').default;
const Provider = require('../Provider');
const logger = require('../../logger');
const adaptData = require('./adapter');
const { withProviderErrorHandling } = require('../providerErrors');
const { prepareStream } = require('../../helpers/utils');
const getClient = ({ token }) => got.extend({
    prefixUrl: 'https://graph.microsoft.com/v1.0',
    headers: {
        authorization: `Bearer ${token}`,
    },
});
const getRootPath = (query) => (query.driveId ? `drives/${query.driveId}` : 'me/drive');
/**
 * Adapter for API https://docs.microsoft.com/en-us/onedrive/developer/rest-api/
 */
class OneDrive extends Provider {
    constructor(options) {
        super(options);
        _OneDrive_instances.add(this);
        this.authProvider = OneDrive.authProvider;
    }
    static get authProvider() {
        return 'microsoft';
    }
    /**
     * Makes 2 requests in parallel - 1. to get files, 2. to get user email
     * it then waits till both requests are done before proceeding with the callback
     *
     * @param {object} options
     * @param {string} options.directory
     * @param {any} options.query
     * @param {string} options.token
     */
    list({ directory, query, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _OneDrive_instances, "m", _OneDrive_withErrorHandling).call(this, 'provider.onedrive.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const path = directory ? `items/${directory}` : 'root';
                const qs = { $expand: 'thumbnails' };
                if (query.cursor) {
                    qs.$skiptoken = query.cursor;
                }
                const client = getClient({ token });
                const [{ mail, userPrincipalName }, list] = yield Promise.all([
                    client.get('me', { responseType: 'json' }).json(),
                    client.get(`${getRootPath(query)}/${path}/children`, { searchParams: qs, responseType: 'json' }).json(),
                ]);
                return adaptData(list, mail || userPrincipalName);
            }));
        });
    }
    download({ id, token, query }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _OneDrive_instances, "m", _OneDrive_withErrorHandling).call(this, 'provider.onedrive.download.error', () => __awaiter(this, void 0, void 0, function* () {
                const stream = getClient({ token }).stream.get(`${getRootPath(query)}/items/${id}/content`, { responseType: 'json' });
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    // eslint-disable-next-line class-methods-use-this
    thumbnail() {
        return __awaiter(this, void 0, void 0, function* () {
            // not implementing this because a public thumbnail from onedrive will be used instead
            logger.error('call to thumbnail is not implemented', 'provider.onedrive.thumbnail.error');
            throw new Error('call to thumbnail is not implemented');
        });
    }
    size({ id, query, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _OneDrive_instances, "m", _OneDrive_withErrorHandling).call(this, 'provider.onedrive.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const { size } = yield getClient({ token }).get(`${getRootPath(query)}/items/${id}`, { responseType: 'json' }).json();
                return size;
            }));
        });
    }
    // eslint-disable-next-line class-methods-use-this
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return { revoked: false, manual_revoke_url: 'https://account.live.com/consent/Manage' };
        });
    }
}
_OneDrive_instances = new WeakSet(), _OneDrive_withErrorHandling = function _OneDrive_withErrorHandling(tag, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        return withProviderErrorHandling({
            fn,
            tag,
            providerName: this.authProvider,
            isAuthError: (response) => response.statusCode === 401,
            getJsonErrorMessage: (body) => { var _a; return (_a = body === null || body === void 0 ? void 0 : body.error) === null || _a === void 0 ? void 0 : _a.message; },
        });
    });
};
module.exports = OneDrive;
