export = Provider;
/**
 * Provider interface defines the specifications of any provider implementation
 */
declare class Provider {
    /**
     * config to extend the grant config
     */
    static getExtraConfig(): {};
    /**
     * @returns {string}
     */
    static get authProvider(): string;
    /**
     *
     * @param {object} options
     */
    constructor(options: object);
    needsCookieAuth: boolean;
    /**
     * list the files and folders in the provider account
     *
     * @param {object} options
     * @returns {Promise}
     */
    list(options: object): Promise<any>;
    /**
     * download a certain file from the provider account
     *
     * @param {object} options
     * @returns {Promise}
     */
    download(options: object): Promise<any>;
    /**
     * return a thumbnail for a provider file
     *
     * @param {object} options
     * @returns {Promise}
     */
    thumbnail(options: object): Promise<any>;
    /**
     * get the size of a certain file in the provider account
     *
     * @param {object} options
     * @returns {Promise}
     */
    size(options: object): Promise<any>;
    /**
     * handle deauthorization notification from oauth providers
     *
     * @param {object} options
     * @returns {Promise}
     */
    deauthorizationCallback(options: object): Promise<any>;
}
