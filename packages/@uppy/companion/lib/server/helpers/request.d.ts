/// <reference types="node" />
export function getRedirectEvaluator(rawRequestURL: any, isEnabled: any): ({ headers }: {
    headers: any;
}) => boolean;
export function getProtectedHttpAgent(protocol: string): typeof HttpAgent;
export function getURLMeta(url: string, blockLocalIPs?: boolean): Promise<{
    type: string;
    size: number;
}>;
export const FORBIDDEN_IP_ADDRESS: "Forbidden IP address";
declare class HttpAgent extends http.Agent {
    createConnection(options: any, callback: any): any;
}
export function getProtectedGot({ url, blockLocalIPs }: {
    url: any;
    blockLocalIPs: any;
}): import("got").Got;
import http = require("node:http");
export {};
