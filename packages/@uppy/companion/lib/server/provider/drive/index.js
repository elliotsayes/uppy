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
var _Drive_instances, _Drive_withErrorHandling;
const got = require('got').default;
const Provider = require('../Provider');
const logger = require('../../logger');
const { VIRTUAL_SHARED_DIR, adaptData, isShortcut, isGsuiteFile, getGsuiteExportType } = require('./adapter');
const { withProviderErrorHandling } = require('../providerErrors');
const { prepareStream } = require('../../helpers/utils');
const DRIVE_FILE_FIELDS = 'kind,id,imageMediaMetadata,name,mimeType,ownedByMe,permissions(role,emailAddress),size,modifiedTime,iconLink,thumbnailLink,teamDriveId,videoMediaMetadata,shortcutDetails(targetId,targetMimeType)';
const DRIVE_FILES_FIELDS = `kind,nextPageToken,incompleteSearch,files(${DRIVE_FILE_FIELDS})`;
// using wildcard to get all 'drive' fields because specifying fields seems no to work for the /drives endpoint
const SHARED_DRIVE_FIELDS = '*';
const getClient = ({ token }) => got.extend({
    prefixUrl: 'https://www.googleapis.com/drive/v3',
    headers: {
        authorization: `Bearer ${token}`,
    },
});
function getStats({ id, token }) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = getClient({ token });
        const getStatsInner = (statsOfId) => __awaiter(this, void 0, void 0, function* () {
            return (client.get(`files/${encodeURIComponent(statsOfId)}`, { searchParams: { fields: DRIVE_FILE_FIELDS, supportsAllDrives: true }, responseType: 'json' }).json());
        });
        const stats = yield getStatsInner(id);
        // If it is a shortcut, we need to get stats again on the target
        if (isShortcut(stats.mimeType))
            return getStatsInner(stats.shortcutDetails.targetId);
        return stats;
    });
}
/**
 * Adapter for API https://developers.google.com/drive/api/v3/
 */
class Drive extends Provider {
    constructor(options) {
        super(options);
        _Drive_instances.add(this);
        this.authProvider = Drive.authProvider;
    }
    static get authProvider() {
        return 'google';
    }
    list(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Drive_instances, "m", _Drive_withErrorHandling).call(this, 'provider.drive.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const directory = options.directory || 'root';
                const query = options.query || {};
                const { token } = options;
                const isRoot = directory === 'root';
                const isVirtualSharedDirRoot = directory === VIRTUAL_SHARED_DIR;
                const client = getClient({ token });
                function fetchSharedDrives(pageToken = null) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const shouldListSharedDrives = isRoot && !query.cursor;
                        if (!shouldListSharedDrives)
                            return undefined;
                        const response = yield client.get('drives', { searchParams: { fields: SHARED_DRIVE_FIELDS, pageToken, pageSize: 100 }, responseType: 'json' }).json();
                        const { nextPageToken } = response;
                        if (nextPageToken) {
                            const nextResponse = yield fetchSharedDrives(nextPageToken);
                            if (!nextResponse)
                                return response;
                            return Object.assign(Object.assign({}, nextResponse), { drives: [...response.drives, ...nextResponse.drives] });
                        }
                        return response;
                    });
                }
                function fetchFiles() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Shared with me items in root don't have any parents
                        const q = isVirtualSharedDirRoot
                            ? `sharedWithMe and trashed=false`
                            : `('${directory}' in parents) and trashed=false`;
                        const searchParams = {
                            fields: DRIVE_FILES_FIELDS,
                            pageToken: query.cursor,
                            q,
                            // pageSize: 10, // can be used for testing pagination if you don't have many files
                            orderBy: 'folder,name',
                            includeItemsFromAllDrives: true,
                            supportsAllDrives: true,
                        };
                        return client.get('files', { searchParams, responseType: 'json' }).json();
                    });
                }
                const [sharedDrives, filesResponse] = yield Promise.all([fetchSharedDrives(), fetchFiles()]);
                // console.log({ directory, sharedDrives, filesResponse })
                return adaptData(filesResponse, sharedDrives, directory, query, isRoot && !query.cursor);
            }));
        });
    }
    download({ id: idIn, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Drive_instances, "m", _Drive_withErrorHandling).call(this, 'provider.drive.download.error', () => __awaiter(this, void 0, void 0, function* () {
                const client = getClient({ token });
                const { mimeType, id } = yield getStats({ id: idIn, token });
                let stream;
                if (isGsuiteFile(mimeType)) {
                    const mimeType2 = getGsuiteExportType(mimeType);
                    logger.info(`calling google file export for ${id} to ${mimeType2}`, 'provider.drive.export');
                    stream = client.stream.get(`files/${encodeURIComponent(id)}/export`, { searchParams: { supportsAllDrives: true, mimeType: mimeType2 }, responseType: 'json' });
                }
                else {
                    stream = client.stream.get(`files/${encodeURIComponent(id)}`, { searchParams: { alt: 'media', supportsAllDrives: true }, responseType: 'json' });
                }
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    // eslint-disable-next-line class-methods-use-this
    thumbnail() {
        return __awaiter(this, void 0, void 0, function* () {
            // not implementing this because a public thumbnail from googledrive will be used instead
            logger.error('call to thumbnail is not implemented', 'provider.drive.thumbnail.error');
            throw new Error('call to thumbnail is not implemented');
        });
    }
    size({ id, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Drive_instances, "m", _Drive_withErrorHandling).call(this, 'provider.drive.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const { mimeType, size } = yield getStats({ id, token });
                if (isGsuiteFile(mimeType)) {
                    // GSuite file sizes cannot be predetermined (but are max 10MB)
                    // e.g. Transfer-Encoding: chunked
                    return undefined;
                }
                return parseInt(size, 10);
            }));
        });
    }
    logout({ token }) {
        return __classPrivateFieldGet(this, _Drive_instances, "m", _Drive_withErrorHandling).call(this, 'provider.drive.logout.error', () => __awaiter(this, void 0, void 0, function* () {
            yield got.post('https://accounts.google.com/o/oauth2/revoke', {
                searchParams: { token },
                responseType: 'json',
            });
            return { revoked: true };
        }));
    }
}
_Drive_instances = new WeakSet(), _Drive_withErrorHandling = function _Drive_withErrorHandling(tag, fn) {
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
module.exports = Drive;
