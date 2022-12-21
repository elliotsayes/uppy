export function initializeData(body: any, initialEnd?: any): {
    items: any[];
    username: any;
};
export function adaptData(userResponse: any, results: any, query: any): {
    nextPagePath: string;
    items: any[];
    username: any;
} | {
    items: any[];
};
