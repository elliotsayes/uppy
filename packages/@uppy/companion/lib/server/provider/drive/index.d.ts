export = Drive;
/**
 * Adapter for API https://developers.google.com/drive/api/v3/
 */
declare class Drive extends Provider {
    constructor(options: any);
    authProvider: string;
    list(options: any): Promise<any>;
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
