export = Instagram;
/**
 * Adapter for API https://developers.facebook.com/docs/instagram-api/overview
 */
declare class Instagram extends Provider {
    static getExtraConfig(): {
        protocol: string;
        scope: string[];
    };
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
    logout(): Promise<{
        revoked: boolean;
        manual_revoke_url: string;
    }>;
    #private;
}
import Provider = require("../../Provider");
