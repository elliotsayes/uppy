export namespace defaultOptions {
    namespace server {
        const protocol: string;
        const path: string;
    }
    const providerOptions: {};
    namespace s3 {
        export const endpoint: string;
        export const conditions: any[];
        export const useAccelerateEndpoint: boolean;
        export { defaultGetKey as getKey };
        export const expires: number;
    }
    const allowLocalUrls: boolean;
    const logClientVersion: boolean;
    const periodicPingUrls: any[];
    const streamingUpload: boolean;
    const clientSocketConnectTimeout: number;
    const metrics: boolean;
}
/**
 * @param {object} companionOptions
 */
export function getMaskableSecrets(companionOptions: object): any[];
/**
 * validates that the mandatory companion options are set.
 * If it is invalid, it will console an error of unset options and exits the process.
 * If it is valid, nothing happens.
 *
 * @param {object} companionOptions
 */
export function validateConfig(companionOptions: object): void;
import { defaultGetKey } from "../server/helpers/utils";
