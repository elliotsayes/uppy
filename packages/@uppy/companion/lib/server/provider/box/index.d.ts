export = Box;
/**
 * Adapter for API https://developer.box.com/reference/
 */
declare class Box extends Provider {
    constructor(options: any);
    authProvider: string;
    /**
     * Lists files and folders from Box API
     *
     * @param {object} options
     * @param {string} options.directory
     * @param {any} options.query
     * @param {string} options.token
     * @param {unknown} options.companion
     */
    list({ directory, token, query, companion }: {
        directory: string;
        query: any;
        token: string;
        companion: unknown;
    }): Promise<any>;
    download({ id, token }: {
        id: any;
        token: any;
    }): Promise<any>;
    thumbnail({ id, token }: {
        id: any;
        token: any;
    }): Promise<any>;
    size({ id, token }: {
        id: any;
        token: any;
    }): Promise<any>;
    logout({ companion, token }: {
        companion: any;
        token: any;
    }): Promise<any>;
    #private;
}
import Provider = require("../Provider");
