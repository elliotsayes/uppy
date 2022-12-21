var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const logger = require('../logger');
const { startDownUpload } = require('../helpers/upload');
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const token = req.companion.providerToken;
        const { provider } = req.companion;
        function getSize() {
            return __awaiter(this, void 0, void 0, function* () {
                return provider.size({ id, token, query: req.query });
            });
        }
        function download() {
            return __awaiter(this, void 0, void 0, function* () {
                const { stream } = yield provider.download({ id, token, query: req.query });
                return stream;
            });
        }
        function onUnhandledError(err) {
            logger.error(err, 'controller.get.error', req.id);
            res.status(400).json({ message: 'Failed to download file' });
        }
        startDownUpload({ req, res, getSize, download, onUnhandledError });
    });
}
module.exports = get;
