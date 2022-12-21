var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Uploader = require('../Uploader');
const logger = require('../logger');
const { errorToResponse } = require('../provider/error');
const { ValidationError } = Uploader;
function startDownUpload({ req, res, getSize, download, onUnhandledError }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const size = yield getSize();
            const { clientSocketConnectTimeout } = req.companion.options;
            logger.debug('Instantiating uploader.', null, req.id);
            const uploader = new Uploader(Uploader.reqToOptions(req, size));
            logger.debug('Starting download stream.', null, req.id);
            const stream = yield download();
            (() => __awaiter(this, void 0, void 0, function* () {
                // wait till the client has connected to the socket, before starting
                // the download, so that the client can receive all download/upload progress.
                logger.debug('Waiting for socket connection before beginning remote download/upload.', null, req.id);
                yield uploader.awaitReady(clientSocketConnectTimeout);
                logger.debug('Socket connection received. Starting remote download/upload.', null, req.id);
                yield uploader.tryUploadStream(stream);
            }))().catch((err) => logger.error(err));
            // Respond the request
            // NOTE: the Uploader will continue running after the http request is responded
            res.status(200).json({ token: uploader.token });
        }
        catch (err) {
            if (err instanceof ValidationError) {
                logger.debug(err.message, 'uploader.validator.fail');
                res.status(400).json({ message: err.message });
                return;
            }
            const errResp = errorToResponse(err);
            if (errResp) {
                res.status(errResp.code).json({ message: errResp.message });
                return;
            }
            onUnhandledError(err);
        }
    });
}
module.exports = { startDownUpload };
