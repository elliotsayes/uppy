var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 *
 * @param {object} req
 * @param {object} res
 */
function thumbnail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { providerName, id } = req.params;
        const token = req.companion.providerTokens[providerName];
        const { provider } = req.companion;
        try {
            const { stream } = yield provider.thumbnail({ id, token });
            stream.pipe(res);
        }
        catch (err) {
            if (err.isAuthError)
                res.sendStatus(401);
            else
                next(err);
        }
    });
}
module.exports = thumbnail;
