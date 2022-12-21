var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const router = require('express').Router;
const validator = require('validator');
const { startDownUpload } = require('../helpers/upload');
const { prepareStream } = require('../helpers/utils');
const { getURLMeta, getProtectedGot } = require('../helpers/request');
const logger = require('../logger');
/**
 * Validates that the download URL is secure
 *
 * @param {string} url the url to validate
 * @param {boolean} ignoreTld whether to allow local addresses
 */
const validateURL = (url, ignoreTld) => {
    if (!url) {
        return false;
    }
    const validURLOpts = {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_tld: !ignoreTld,
    };
    if (!validator.isURL(url, validURLOpts)) {
        return false;
    }
    return true;
};
/**
 * @callback downloadCallback
 * @param {Error} err
 * @param {string | Buffer | Buffer[]} chunk
 */
/**
 * Downloads the content in the specified url, and passes the data
 * to the callback chunk by chunk.
 *
 * @param {string} url
 * @param {boolean} blockLocalIPs
 * @param {string} traceId
 * @returns {Promise}
 */
const downloadURL = (url, blockLocalIPs, traceId) => __awaiter(this, void 0, void 0, function* () {
    try {
        const protectedGot = getProtectedGot({ url, blockLocalIPs });
        const stream = protectedGot.stream.get(url, { responseType: 'json' });
        yield prepareStream(stream);
        return stream;
    }
    catch (err) {
        logger.error(err, 'controller.url.download.error', traceId);
        throw err;
    }
});
/**
 * Fteches the size and content type of a URL
 *
 * @param {object} req expressJS request object
 * @param {object} res expressJS response object
 */
const meta = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        logger.debug('URL file import handler running', null, req.id);
        const { allowLocalUrls } = req.companion.options;
        if (!validateURL(req.body.url, allowLocalUrls)) {
            logger.debug('Invalid request body detected. Exiting url meta handler.', null, req.id);
            return res.status(400).json({ error: 'Invalid request body' });
        }
        const urlMeta = yield getURLMeta(req.body.url, !allowLocalUrls);
        return res.json(urlMeta);
    }
    catch (err) {
        logger.error(err, 'controller.url.meta.error', req.id);
        return res.status(err.status || 500).json({ message: 'failed to fetch URL metadata' });
    }
});
/**
 * Handles the reques of import a file from a remote URL, and then
 * subsequently uploading it to the specified destination.
 *
 * @param {object} req expressJS request object
 * @param {object} res expressJS response object
 */
const get = (req, res) => __awaiter(this, void 0, void 0, function* () {
    logger.debug('URL file import handler running', null, req.id);
    const { allowLocalUrls } = req.companion.options;
    if (!validateURL(req.body.url, allowLocalUrls)) {
        logger.debug('Invalid request body detected. Exiting url import handler.', null, req.id);
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }
    function getSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const { size } = yield getURLMeta(req.body.url, !allowLocalUrls);
            return size;
        });
    }
    function download() {
        return __awaiter(this, void 0, void 0, function* () {
            return downloadURL(req.body.url, !allowLocalUrls, req.id);
        });
    }
    function onUnhandledError(err) {
        logger.error(err, 'controller.url.error', req.id);
        res.status(err.status || 500).json({ message: 'failed to fetch URL' });
    }
    startDownUpload({ req, res, getSize, download, onUnhandledError });
});
module.exports = () => router()
    .post('/meta', meta)
    .post('/get', get);
