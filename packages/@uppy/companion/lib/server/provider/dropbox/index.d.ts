export = DropBox;
/**
 * Adapter for API https://www.dropbox.com/developers/documentation/http/documentation
 */
declare class DropBox extends Provider {
    constructor(options: any);
    authProvider: string;
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
    logout({ token }: {
        token: any;
    }): Promise<any>;
    #private;
}
import Provider = require("../Provider");
