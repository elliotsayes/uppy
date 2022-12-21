export function isGsuiteFile(mimeType: any): any;
export function isShortcut(mimeType: any): boolean;
export function getGsuiteExportType(mimeType: any): any;
export const VIRTUAL_SHARED_DIR: "shared-with-me";
export function adaptData(listFilesResp: any, sharedDrivesResp: any, directory: any, query: any, showSharedWithMe: any): {
    username: any;
    items: ({
        isFolder: boolean;
        icon: string;
        name: string;
        mimeType: string;
        id: "shared-with-me";
        requestPath: "shared-with-me";
    } | {
        isFolder: boolean;
        icon: any;
        name: any;
        mimeType: any;
        id: any;
        thumbnail: any;
        requestPath: any;
        modifiedDate: any;
        size: number;
        custom: {
            isSharedDrive: boolean;
            imageHeight: any;
            imageWidth: any;
            imageRotation: any;
            imageDateTime: any;
            videoHeight: any;
            videoWidth: any;
            videoDurationMillis: any;
        };
    })[];
    nextPagePath: string;
};
