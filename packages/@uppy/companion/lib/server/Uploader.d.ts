/// <reference types="node" />
/// <reference types="node" />
export = Uploader;
declare class Uploader {
    /**
     * returns a substring of the token. Used as traceId for logging
     * we avoid using the entire token because this is meant to be a short term
     * access token between uppy client and companion websocket
     *
     * @param {string} token the token to Shorten
     * @returns {string}
     */
    static shortenToken(token: string): string;
    static reqToOptions(req: any, size: any): {
        headers: any;
        httpMethod: any;
        protocol: any;
        endpoint: any;
        uploadUrl: any;
        metadata: any;
        fieldname: any;
        useFormData: any;
        size: any;
        companionOptions: any;
        pathPrefix: string;
        storage: any;
        s3: {
            client: any;
            options: any;
        };
        chunkSize: any;
    };
    /**
     * Uploads file to destination based on the supplied protocol (tus, s3-multipart, multipart)
     * For tus uploads, the deferredLength option is enabled, because file size value can be unreliable
     * for some providers (Instagram particularly)
     *
     * @typedef {object} UploaderOptions
     * @property {string} endpoint
     * @property {string} [uploadUrl]
     * @property {string} protocol
     * @property {number} [size]
     * @property {string} [fieldname]
     * @property {string} pathPrefix
     * @property {any} [s3]
     * @property {any} metadata
     * @property {any} companionOptions
     * @property {any} [storage]
     * @property {any} [headers]
     * @property {string} [httpMethod]
     * @property {boolean} [useFormData]
     * @property {number} [chunkSize]
     *
     * @param {UploaderOptions} options
     */
    constructor(options: {
        endpoint: string;
        uploadUrl?: string;
        protocol: string;
        size?: number;
        fieldname?: string;
        pathPrefix: string;
        s3?: any;
        metadata: any;
        companionOptions: any;
        storage?: any;
        headers?: any;
        httpMethod?: string;
        useFormData?: boolean;
        chunkSize?: number;
    });
    options: {
        endpoint: string;
        uploadUrl?: string;
        protocol: string;
        size?: number;
        fieldname?: string;
        pathPrefix: string;
        s3?: any;
        metadata: any;
        companionOptions: any;
        storage?: any;
        headers?: any;
        httpMethod?: string;
        useFormData?: boolean;
        chunkSize?: number;
    };
    token: string;
    fileName: string;
    size: number;
    uploadFileName: any;
    uploadStopped: boolean;
    storage: any;
    _paused: boolean;
    downloadedBytes: number;
    readStream: import("stream").Readable | fs.ReadStream;
    abortReadStream(err: any): void;
    _uploadByProtocol(): Promise<any>;
    _downloadStreamAsFile(stream: any): Promise<void>;
    tmpPath: string;
    _needDownloadFirst(): boolean;
    /**
     *
     * @param {import('stream').Readable} stream
     */
    uploadStream(stream: import('stream').Readable): Promise<{
        url: any;
        extraData: any;
    }>;
    tryDeleteTmpPath(): void;
    /**
     *
     * @param {import('stream').Readable} stream
     */
    tryUploadStream(stream: import('stream').Readable): Promise<void>;
    /**
     * returns a substring of the token. Used as traceId for logging
     * we avoid using the entire token because this is meant to be a short term
     * access token between uppy client and companion websocket
     */
    get shortToken(): string;
    awaitReady(timeout: any): Promise<void>;
    /**
     * @typedef {{action: string, payload: object}} State
     * @param {State} state
     */
    saveState(state: {
        action: string;
        payload: object;
    }): void;
    throttledEmitProgress: any;
    /**
     *
     * @param {number} [bytesUploaded]
     * @param {number | null} [bytesTotalIn]
     */
    onProgress(bytesUploaded?: number, bytesTotalIn?: number | null): void;
    /**
     * start the tus upload
     *
     * @param {any} stream
     */
    _uploadTus(stream: any): Promise<any>;
    tus: tus.Upload;
    _uploadMultipart(stream: any): Promise<{
        url: any;
        extraData: {
            response: {
                responseText: any;
                status: any;
                statusText: any;
                headers: any;
            };
            bytesUploaded: number;
        };
    }>;
    /**
     * Upload the file to S3 using a Multipart upload.
     */
    _uploadS3Multipart(stream: any): Promise<any>;
    #private;
}
declare namespace Uploader {
    export { FILE_NAME_PREFIX, STORAGE_PREFIX, ValidationError };
}
import fs = require("node:fs");
import tus = require("tus-js-client");
declare var FILE_NAME_PREFIX: string;
declare var STORAGE_PREFIX: string;
declare class ValidationError extends Error {
}
