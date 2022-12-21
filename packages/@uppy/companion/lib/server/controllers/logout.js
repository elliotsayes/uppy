var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const tokenService = require('../helpers/jwt');
const { errorToResponse } = require('../provider/error');
/**
 *
 * @param {object} req
 * @param {object} res
 */
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanSession = () => {
            if (req.session.grant) {
                req.session.grant.state = null;
                req.session.grant.dynamic = null;
            }
        };
        const { providerName } = req.params;
        const { companion } = req;
        const token = companion.providerTokens ? companion.providerTokens[providerName] : null;
        if (!token) {
            cleanSession();
            res.json({ ok: true, revoked: false });
            return;
        }
        try {
            const data = yield companion.provider.logout({ token, companion });
            delete companion.providerTokens[providerName];
            tokenService.removeFromCookies(res, companion.options, companion.provider.authProvider);
            cleanSession();
            res.json(Object.assign({ ok: true }, data));
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
module.exports = logout;
