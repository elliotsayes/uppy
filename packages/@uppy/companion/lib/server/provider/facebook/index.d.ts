export = Facebook;
/**
 * Adapter for API https://developers.facebook.com/docs/graph-api/using-graph-api/
 */
declare class Facebook extends Provider {
    constructor(options: any);
    authProvider: string;
    list({ directory, token, query }: {
        directory: any;
        token: any;
        query?: {
            cursor: any;
        };
    }): Promise<any>;
    download({ id, token }: {
        id: any;
        token: any;
    }): Promise<any>;
    thumbnail(): Promise<void>;
    size({ id, token }: {
        id: any;
        token: any;
    }): Promise<any>;
    logout({ token }: {
        token: any;
    }): Promise<any>;
    #private;
}
import Provider = require("../Provider");
