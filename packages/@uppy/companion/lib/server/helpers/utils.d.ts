export function hasMatch(value: string, criteria: string[]): boolean;
export function jsonStringify(data: object): string;
export function getURLBuilder(options: object): (path: string, isExternal: boolean, excludeHost?: boolean) => string;
export function encrypt(input: string, secret: string | Buffer): string;
export function decrypt(encrypted: string, secret: string | Buffer): string;
export function defaultGetKey(req: any, filename: any): string;
export function prepareStream(stream: any): Promise<any>;
export function getBasicAuthHeader(key: any, secret: any): string;
