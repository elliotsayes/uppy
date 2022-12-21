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
var _Zoom_instances, _Zoom_withErrorHandling;
const got = require('got').default;
const moment = require('moment-timezone');
const Provider = require('../Provider');
const { initializeData, adaptData } = require('./adapter');
const { withProviderErrorHandling } = require('../providerErrors');
const { prepareStream, getBasicAuthHeader } = require('../../helpers/utils');
const BASE_URL = 'https://zoom.us/v2';
const PAGE_SIZE = 300;
const DEAUTH_EVENT_NAME = 'app_deauthorized';
const getClient = ({ token }) => got.extend({
    prefixUrl: BASE_URL,
    headers: {
        authorization: `Bearer ${token}`,
    },
});
function findFile({ client, meetingId, fileId, recordingStart }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recording_files: files } = yield client.get(`meetings/${encodeURIComponent(meetingId)}/recordings`, { responseType: 'json' }).json();
        return files.find((file) => (fileId === file.id || (file.file_type === fileId && file.recording_start === recordingStart)));
    });
}
/**
 * Adapter for API https://marketplace.zoom.us/docs/api-reference/zoom-api
 */
class Zoom extends Provider {
    constructor(options) {
        super(options);
        _Zoom_instances.add(this);
        this.authProvider = Zoom.authProvider;
    }
    static get authProvider() {
        return 'zoom';
    }
    /*
    - returns list of months by default
    - drill down for specific files in each month
    */
    list(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Zoom_instances, "m", _Zoom_withErrorHandling).call(this, 'provider.zoom.list.error', () => __awaiter(this, void 0, void 0, function* () {
                const { token } = options;
                const query = options.query || {};
                const { cursor, from, to } = query;
                const meetingId = options.directory || '';
                const client = getClient({ token });
                const user = yield client.get('users/me', { responseType: 'json' }).json();
                const { timezone } = user;
                if (!from && !to && !meetingId) {
                    const end = cursor && moment.utc(cursor).endOf('day').tz(timezone || 'UTC');
                    return initializeData(user, end);
                }
                if (from && to) {
                    /*  we need to convert local datetime to UTC date for Zoom query
                    eg: user in PST (UTC-08:00) wants 2020-08-01 (00:00) to 2020-08-31 (23:59)
                    => in UTC, that's 2020-07-31 (16:00) to 2020-08-31 (15:59)
                    */
                    const searchParams = {
                        page_size: PAGE_SIZE,
                        from: moment.tz(from, timezone || 'UTC').startOf('day').tz('UTC').format('YYYY-MM-DD'),
                        to: moment.tz(to, timezone || 'UTC').endOf('day').tz('UTC').format('YYYY-MM-DD'),
                    };
                    if (cursor)
                        searchParams.next_page_token = cursor;
                    const meetingsInfo = yield client.get('users/me/recordings', { searchParams, responseType: 'json' }).json();
                    return adaptData(user, meetingsInfo, query);
                }
                if (meetingId) {
                    const recordingInfo = yield client.get(`meetings/${encodeURIComponent(meetingId)}/recordings`, { responseType: 'json' }).json();
                    return adaptData(user, recordingInfo, query);
                }
                throw new Error('Invalid list() arguments');
            }));
        });
    }
    download({ id: meetingId, token, query }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Zoom_instances, "m", _Zoom_withErrorHandling).call(this, 'provider.zoom.download.error', () => __awaiter(this, void 0, void 0, function* () {
                // meeting id + file id required
                // cc files don't have an ID or size
                const { recordingStart, recordingId: fileId } = query;
                const client = getClient({ token });
                const foundFile = yield findFile({ client, meetingId, fileId, recordingStart });
                const url = foundFile === null || foundFile === void 0 ? void 0 : foundFile.download_url;
                if (!url)
                    throw new Error('Download URL not found');
                const stream = client.stream.get(`${url}?access_token=${token}`, { prefixUrl: '', responseType: 'json' });
                yield prepareStream(stream);
                return { stream };
            }));
        });
    }
    size({ id: meetingId, token, query }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Zoom_instances, "m", _Zoom_withErrorHandling).call(this, 'provider.zoom.size.error', () => __awaiter(this, void 0, void 0, function* () {
                const client = getClient({ token });
                const { recordingStart, recordingId: fileId } = query;
                const foundFile = yield findFile({ client, meetingId, fileId, recordingStart });
                if (!foundFile)
                    throw new Error('File not found');
                return foundFile.file_size; // Note: May be undefined.
            }));
        });
    }
    logout({ companion, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Zoom_instances, "m", _Zoom_withErrorHandling).call(this, 'provider.zoom.logout.error', () => __awaiter(this, void 0, void 0, function* () {
                const { key, secret } = yield companion.getProviderCredentials();
                const { status } = yield got.post('https://zoom.us/oauth/revoke', {
                    searchParams: { token },
                    headers: { Authorization: getBasicAuthHeader(key, secret) },
                    responseType: 'json',
                }).json();
                return { revoked: status === 'success' };
            }));
        });
    }
    deauthorizationCallback({ companion, body, headers }) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Zoom_instances, "m", _Zoom_withErrorHandling).call(this, 'provider.zoom.deauth.error', () => __awaiter(this, void 0, void 0, function* () {
                if (!body || body.event !== DEAUTH_EVENT_NAME) {
                    return { data: {}, status: 400 };
                }
                const { verificationToken, key, secret } = yield companion.getProviderCredentials();
                const tokenSupplied = headers.authorization;
                if (!tokenSupplied || verificationToken !== tokenSupplied) {
                    return { data: {}, status: 400 };
                }
                yield got.post('https://api.zoom.us/oauth/data/compliance', {
                    headers: { Authorization: getBasicAuthHeader(key, secret) },
                    json: {
                        client_id: key,
                        user_id: body.payload.user_id,
                        account_id: body.payload.account_id,
                        deauthorization_event_received: body.payload,
                        compliance_completed: true,
                    },
                    responseType: 'json',
                });
                return {};
            }));
        });
    }
}
_Zoom_instances = new WeakSet(), _Zoom_withErrorHandling = function _Zoom_withErrorHandling(tag, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const authErrorCodes = [
            124,
            401,
        ];
        return withProviderErrorHandling({
            fn,
            tag,
            providerName: this.authProvider,
            isAuthError: (response) => authErrorCodes.includes(response.statusCode),
            getJsonErrorMessage: (body) => body === null || body === void 0 ? void 0 : body.message,
        });
    });
};
module.exports = Zoom;