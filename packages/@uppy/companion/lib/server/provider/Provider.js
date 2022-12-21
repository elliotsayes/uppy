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
 * Provider interface defines the specifications of any provider implementation
 */
class Provider {
    /**
     *
     * @param {object} options
     */
    constructor(options) {
        this.needsCookieAuth = false;
        return this;
    }
    /**
     * config to extend the grant config
     */
    static getExtraConfig() {
        return {};
    }
    /**
     * list the files and folders in the provider account
     *
     * @param {object} options
     * @returns {Promise}
     */
    list(options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('method not implemented');
        });
    }
    /**
     * download a certain file from the provider account
     *
     * @param {object} options
     * @returns {Promise}
     */
    download(options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('method not implemented');
        });
    }
    /**
     * return a thumbnail for a provider file
     *
     * @param {object} options
     * @returns {Promise}
     */
    thumbnail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('method not implemented');
        });
    }
    /**
     * get the size of a certain file in the provider account
     *
     * @param {object} options
     * @returns {Promise}
     */
    size(options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('method not implemented');
        });
    }
    /**
     * handle deauthorization notification from oauth providers
     *
     * @param {object} options
     * @returns {Promise}
     */
    deauthorizationCallback(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // @todo consider doing something like throw new NotImplementedError() instead
            throw new Error('method not implemented');
        });
    }
    /**
     * @returns {string}
     */
    static get authProvider() {
        return '';
    }
}
module.exports = Provider;
