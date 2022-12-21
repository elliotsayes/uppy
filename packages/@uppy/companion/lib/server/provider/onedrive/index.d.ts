export = OneDrive;
/**
 * Adapter for API https://docs.microsoft.com/en-us/onedrive/developer/rest-api/
 */
declare class OneDrive extends Provider {
    constructor(options: any);
    authProvider: string;
    /**
     * Makes 2 requests in parallel - 1. to get files, 2. to get user email
     * it then waits till both requests are done before proceeding with the callback
     *
     * @param {object} options
     * @param {string} options.directory
     * @param {any} options.query
     * @param {string} options.token
     */
    list({ directory, query, token }: {
        directory: string;
        query: any;
        token: string;
    }): Promise<any>;
    download({ id, token, query }: {
        id: any;
        token: any;
        query: any;
    }): Promise<any>;
    thumbnail(): Promise<void>;
    size({ id, query, token }: {
        id: any;
        query: any;
        token: any;
    }): Promise<any>;
    logout(): Promise<{
        revoked: boolean;
        manual_revoke_url: string;
    }>;
    #private;
}
import Provider = require("../Provider");
