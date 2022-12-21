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
var _Unsplash_instances, _Unsplash_withErrorHandling;
const got = require('got').default;
const SearchProvider = require('../SearchProvider');
const { getURLMeta } = require('../../helpers/request');
const adaptData = require('./adapter');
const { withProviderErrorHandling } = require('../providerErrors');
const { prepareStream } = require('../../helpers/utils');
const BASE_URL = 'https://api.unsplash.com';
const getClient = ({ token }) => got.extend({
    prefixUrl: BASE_URL,
    headers: {
        authorization: `Client-ID ${token}`,
    },
});
const getPhotoMeta = (client, id) => __awaiter(this, void 0, void 0, function* () { return client.get(`photos/${id}`, { responseType: 'json' }).json(); });
/**
 * Adapter for API https://api.unsplash.com
 */
class Unsplash extends SearchProvider {
    constructor() {
        super(...arguments);
        _Unsplash_instances.add(this);
    }
    list({ token, query = { cursor: null, q: null } }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Unsplash_instances, "m", _Unsplash_withErrorHandling).call(this, 'provider.unsplash.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const qs = { per_page: 40, query: query.q };
                if (query.cursor)
                    qs.page = query.cursor;
                const response = yield getClient({ token }).get('search/photos', { searchParams: qs, responseType: 'json' }).json();
                return adaptData(response, query);
            }));
        });
    }
    download({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Unsplash_instances, "m", _Unsplash_withErrorHandling).call(this, 'provider.unsplash.download.error', () => __awaiter(this, void 0, void 0, function* () {
                const client = getClient({ token });
                const { links: { download: url, download_location: attributionUrl } } = yield getPhotoMeta(client, id);
                const stream = got.stream.get(url, { responseType: 'json' });
                yield prepareStream(stream);
                // To attribute the author of the image, we call the `download_location`
                // endpoint to increment the download count on Unsplash.
                // https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
                yield client.get(attributionUrl, { prefixUrl: '', responseType: 'json' });
                // finally, stream on!
                return { stream };
            }));
        });
    }
    size({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Unsplash_instances, "m", _Unsplash_withErrorHandling).call(this, 'provider.unsplash.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const { links: { download: url } } = yield getPhotoMeta(getClient({ token }), id);
                const { size } = yield getURLMeta(url, true);
                return size;
            }));
        });
    }
}
_Unsplash_instances = new WeakSet(), _Unsplash_withErrorHandling = function _Unsplash_withErrorHandling(tag, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        return withProviderErrorHandling({
            fn,
            tag,
            providerName: 'Unsplash',
            getJsonErrorMessage: (body) => (body === null || body === void 0 ? void 0 : body.errors) && String(body.errors),
        });
    });
};
module.exports = Unsplash;
