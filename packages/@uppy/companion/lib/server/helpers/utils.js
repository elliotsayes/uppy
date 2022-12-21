var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const crypto = require('node:crypto');
/**
 *
 * @param {string} value
 * @param {string[]} criteria
 * @returns {boolean}
 */
exports.hasMatch = (value, criteria) => {
    return criteria.some((i) => {
        return value === i || (new RegExp(i)).test(value);
    });
};
/**
 *
 * @param {object} data
 * @returns {string}
 */
exports.jsonStringify = (data) => {
    const cache = [];
    return JSON.stringify(data, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            cache.push(value);
        }
        return value;
    });
};
// all paths are assumed to be '/' prepended
/**
 * Returns a url builder
 *
 * @param {object} options companion options
 */
module.exports.getURLBuilder = (options) => {
    /**
     * Builds companion targeted url
     *
     * @param {string} path the tail path of the url
     * @param {boolean} isExternal if the url is for the external world
     * @param {boolean} [excludeHost] if the server domain and protocol should be included
     */
    const buildURL = (path, isExternal, excludeHost) => {
        let url = path;
        // supports for no path specified too
        if (isExternal) {
            url = `${options.server.implicitPath || ''}${url}`;
        }
        url = `${options.server.path || ''}${url}`;
        if (!excludeHost) {
            url = `${options.server.protocol}://${options.server.host}${url}`;
        }
        return url;
    };
    return buildURL;
};
/**
 * Ensure that a user-provided `secret` is 32 bytes long (the length required
 * for an AES256 key) by hashing it with SHA256.
 *
 * @param {string|Buffer} secret
 */
function createSecret(secret) {
    const hash = crypto.createHash('sha256');
    hash.update(secret);
    return hash.digest();
}
/**
 * Create an initialization vector for AES256.
 *
 * @returns {Buffer}
 */
function createIv() {
    return crypto.randomBytes(16);
}
function urlEncode(unencoded) {
    return unencoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '~');
}
function urlDecode(encoded) {
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/~/g, '=');
    return encoded;
}
/**
 * Encrypt a buffer or string with AES256 and a random iv.
 *
 * @param {string} input
 * @param {string|Buffer} secret
 * @returns {string} Ciphertext as a hex string, prefixed with 32 hex characters containing the iv.
 */
module.exports.encrypt = (input, secret) => {
    const iv = createIv();
    const cipher = crypto.createCipheriv('aes256', createSecret(secret), iv);
    let encrypted = cipher.update(input, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    // add iv to encrypted string to use for decryption
    return iv.toString('hex') + urlEncode(encrypted);
};
/**
 * Decrypt an iv-prefixed or string with AES256. The iv should be in the first 32 hex characters.
 *
 * @param {string} encrypted
 * @param {string|Buffer} secret
 * @returns {string} Decrypted value.
 */
module.exports.decrypt = (encrypted, secret) => {
    // Need at least 32 chars for the iv
    if (encrypted.length < 32) {
        throw new Error('Invalid encrypted value. Maybe it was generated with an old Companion version?');
    }
    const iv = Buffer.from(encrypted.slice(0, 32), 'hex');
    const encryptionWithoutIv = encrypted.slice(32);
    let decipher;
    try {
        decipher = crypto.createDecipheriv('aes256', createSecret(secret), iv);
    }
    catch (err) {
        if (err.code === 'ERR_CRYPTO_INVALID_IV') {
            throw new Error('Invalid initialization vector');
        }
        else {
            throw err;
        }
    }
    let decrypted = decipher.update(urlDecode(encryptionWithoutIv), 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
module.exports.defaultGetKey = (req, filename) => `${crypto.randomUUID()}-${filename}`;
module.exports.prepareStream = (stream) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => (stream
        .on('response', () => {
        // Don't allow any more data to flow yet.
        // https://github.com/request/request/issues/1990#issuecomment-184712275
        stream.pause();
        resolve();
    })
        .on('error', (err) => {
        var _a, _b, _c;
        // got doesn't parse body as JSON on http error (responseType: 'json' is ignored and it instead becomes a string)
        if (((_b = (_a = err === null || err === void 0 ? void 0 : err.request) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.responseType) === 'json' && typeof ((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.body) === 'string') {
            try {
                // todo unit test this
                reject(Object.assign(new Error(), { response: { body: JSON.parse(err.response.body) } }));
            }
            catch (err2) {
                reject(err);
            }
        }
        else {
            reject(err);
        }
    })));
});
module.exports.getBasicAuthHeader = (key, secret) => {
    const base64 = Buffer.from(`${key}:${secret}`, 'binary').toString('base64');
    return `Basic ${base64}`;
};
