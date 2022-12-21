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
function deauthCallback({ body, companion, headers }, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // we need the provider instance to decide status codes because
        // this endpoint does not cater to a uniform client.
        // It doesn't respond to Uppy client like other endpoints.
        // Instead it responds to the providers themselves.
        try {
            const { data, status } = yield companion.provider.deauthorizationCallback({ companion, body, headers });
            res.status(status || 200).json(data);
            return;
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
module.exports = deauthCallback;
