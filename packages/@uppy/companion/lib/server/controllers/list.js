var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { errorToResponse } = require('../provider/error');
function list({ query, params, companion }, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = companion.providerToken;
        try {
            const data = yield companion.provider.list({ companion, token, directory: params.id, query });
            res.json(data);
        }
        catch (err) {
            const errResp = errorToResponse(err);
            if (errResp) {
                res.status(errResp.code).json({ message: errResp.message });
                return;
            }
            next(err);
        }
    });
}
module.exports = list;
