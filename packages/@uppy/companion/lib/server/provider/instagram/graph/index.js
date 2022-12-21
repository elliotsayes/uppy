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
var _Instagram_instances, _Instagram_withErrorHandling;
const got = require('got').default;
const Provider = require('../../Provider');
const { getURLMeta } = require('../../../helpers/request');
const logger = require('../../../logger');
const adaptData = require('./adapter');
const { withProviderErrorHandling } = require('../../providerErrors');
const { prepareStream } = require('../../../helpers/utils');
const getClient = ({ token }) => got.extend({
    prefixUrl: 'https://graph.instagram.com',
    headers: {
        authorization: `Bearer ${token}`,
    },
});
function getMediaUrl({ token, id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield getClient({ token }).get(String(id), { searchParams: { fields: 'media_url' }, responseType: 'json' }).json();
        return body.media_url;
    });
}
/**
 * Adapter for API https://developers.facebook.com/docs/instagram-api/overview
 */
class Instagram extends Provider {
    constructor(options) {
        super(options);
        _Instagram_instances.add(this);
        this.authProvider = Instagram.authProvider;
    }
    // for "grant"
    static getExtraConfig() {
        return {
            protocol: 'https',
            scope: ['user_profile', 'user_media'],
        };
    }
    static get authProvider() {
        return 'instagram';
    }
    list({ directory, token, query = { cursor: null } }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Instagram_instances, "m", _Instagram_withErrorHandling).call(this, 'provider.instagram.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const qs = { fields: 'id,media_type,thumbnail_url,media_url,timestamp,children{media_type,media_url,thumbnail_url,timestamp}' };
                if (query.cursor)
                    qs.after = query.cursor;
                const client = getClient({ token });
                const [{ username }, list] = yield Promise.all([
                    client.get('me', { searchParams: { fields: 'username' }, responseType: 'json' }).json(),
                    client.get('me/media', { searchParams: qs, responseType: 'json' }).json(),
                ]);
                return adaptData(list, username, directory, query);
            }));
        });
    }
    download({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Instagram_instances, "m", _Instagram_withErrorHandling).call(this, 'provider.instagram.download.error', () => __awaiter(this, void 0, void 0, function* () {
                const url = yield getMediaUrl({ token, id });
                const stream = got.stream.get(url, { responseType: 'json' });
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    // eslint-disable-next-line class-methods-use-this
    thumbnail() {
        return __awaiter(this, void 0, void 0, function* () {
            // not implementing this because a public thumbnail from instagram will be used instead
            logger.error('call to thumbnail is not implemented', 'provider.instagram.thumbnail.error');
            throw new Error('call to thumbnail is not implemented');
        });
    }
    size({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Instagram_instances, "m", _Instagram_withErrorHandling).call(this, 'provider.instagram.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const url = yield getMediaUrl({ token, id });
                const { size } = yield getURLMeta(url, true);
                return size;
            }));
        });
    }
    // eslint-disable-next-line class-methods-use-this
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            // access revoke is not supported by Instagram's API
            return { revoked: false, manual_revoke_url: 'https://www.instagram.com/accounts/manage_access/' };
        });
    }
}
_Instagram_instances = new WeakSet(), _Instagram_withErrorHandling = function _Instagram_withErrorHandling(tag, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        return withProviderErrorHandling({
            fn,
            tag,
            providerName: this.authProvider,
            isAuthError: (response) => response.statusCode === 190,
            getJsonErrorMessage: (body) => { var _a; return (_a = body === null || body === void 0 ? void 0 : body.error) === null || _a === void 0 ? void 0 : _a.message; },
        });
    });
};
module.exports = Instagram;
