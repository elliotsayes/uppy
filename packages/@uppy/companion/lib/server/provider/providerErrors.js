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
const { ProviderApiError, ProviderAuthError } = require('./error');
function convertProviderError({ err, providerName, isAuthError = () => false, getJsonErrorMessage }) {
    const { response } = err;
    function getErrorMessage() {
        if (typeof response.body === 'object') {
            const message = getJsonErrorMessage(response.body);
            if (message != null)
                return message;
        }
        if (typeof response.body === 'string') {
            return response.body;
        }
        return `request to ${providerName} returned ${response.statusCode}`;
    }
    if (response) {
        // @ts-ignore
        if (isAuthError(response))
            return new ProviderAuthError();
        return new ProviderApiError(getErrorMessage(), response.statusCode);
    }
    return err;
}
function withProviderErrorHandling({ fn, tag, providerName, isAuthError, getJsonErrorMessage }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (err) {
            const err2 = convertProviderError({ err, providerName, isAuthError, getJsonErrorMessage });
            logger.error(err2, tag);
            throw err2;
        }
    });
}
module.exports = { withProviderErrorHandling };
