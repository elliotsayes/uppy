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
var _Facebook_instances, _Facebook_withErrorHandling;
const got = require('got').default;
const Provider = require('../Provider');
const { getURLMeta } = require('../../helpers/request');
const logger = require('../../logger');
const { adaptData, sortImages } = require('./adapter');
const { withProviderErrorHandling } = require('../providerErrors');
const { prepareStream } = require('../../helpers/utils');
const getClient = ({ token }) => got.extend({
    prefixUrl: 'https://graph.facebook.com',
    headers: {
        authorization: `Bearer ${token}`,
    },
});
function getMediaUrl({ token, id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield getClient({ token }).get(String(id), { searchParams: { fields: 'images' }, responseType: 'json' }).json();
        const sortedImages = sortImages(body.images);
        return sortedImages[sortedImages.length - 1].source;
    });
}
/**
 * Adapter for API https://developers.facebook.com/docs/graph-api/using-graph-api/
 */
class Facebook extends Provider {
    constructor(options) {
        super(options);
        _Facebook_instances.add(this);
        this.authProvider = Facebook.authProvider;
    }
    static get authProvider() {
        return 'facebook';
    }
    list({ directory, token, query = { cursor: null } }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Facebook_instances, "m", _Facebook_withErrorHandling).call(this, 'provider.facebook.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const qs = { fields: 'name,cover_photo,created_time,type' };
                if (query.cursor)
                    qs.after = query.cursor;
                let path = 'me/albums';
                if (directory) {
                    path = `${directory}/photos`;
                    qs.fields = 'icon,images,name,width,height,created_time';
                }
                const client = getClient({ token });
                const [{ email }, list] = yield Promise.all([
                    client.get('me', { searchParams: { fields: 'email' }, responseType: 'json' }).json(),
                    client.get(path, { searchParams: qs, responseType: 'json' }).json(),
                ]);
                return adaptData(list, email, directory, query);
            }));
        });
    }
    download({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Facebook_instances, "m", _Facebook_withErrorHandling).call(this, 'provider.facebook.download.error', () => __awaiter(this, void 0, void 0, function* () {
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
            // not implementing this because a public thumbnail from facebook will be used instead
            logger.error('call to thumbnail is not implemented', 'provider.facebook.thumbnail.error');
            throw new Error('call to thumbnail is not implemented');
        });
    }
    size({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Facebook_instances, "m", _Facebook_withErrorHandling).call(this, 'provider.facebook.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const url = yield getMediaUrl({ token, id });
                const { size } = yield getURLMeta(url, true);
                return size;
            }));
        });
    }
    logout({ token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Facebook_instances, "m", _Facebook_withErrorHandling).call(this, 'provider.facebook.logout.error', () => __awaiter(this, void 0, void 0, function* () {
                yield getClient({ token }).delete('me/permissions', { responseType: 'json' }).json();
                return { revoked: true };
            }));
        });
    }
}
_Facebook_instances = new WeakSet(), _Facebook_withErrorHandling = function _Facebook_withErrorHandling(tag, fn) {
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
module.exports = Facebook;
