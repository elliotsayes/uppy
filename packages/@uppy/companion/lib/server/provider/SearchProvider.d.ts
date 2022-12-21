export = SearchProvider;
/**
 * SearchProvider interface defines the specifications of any Search provider implementation
 */
declare class SearchProvider {
    /**
     * list the files available based on the search query
     *
     * @param {object} options
     * @returns {Promise}
     */
    list(options: object): Promise<any>;
    /**
     * download a certain file from the provider files
     *
     * @param {object} options
     * @returns {Promise}
     */
    download(options: object): Promise<any>;
    /**
     * get the size of a certain file in the provider files
     *
     * @param {object} options
     * @returns {Promise}
     */
    size(options: object): Promise<any>;
}
