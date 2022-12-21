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
 * SearchProvider interface defines the specifications of any Search provider implementation
 */
class SearchProvider {
    /**
     * list the files available based on the search query
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
     * download a certain file from the provider files
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
     * get the size of a certain file in the provider files
     *
     * @param {object} options
     * @returns {Promise}
     */
    size(options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('method not implemented');
        });
    }
}
module.exports = SearchProvider;
