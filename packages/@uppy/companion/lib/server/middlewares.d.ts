export function hasSessionAndProvider(req: any, res: any, next: any): any;
export function hasSearchQuery(req: any, res: any, next: any): any;
export function verifyToken(req: any, res: any, next: any): any;
export function gentleVerifyToken(req: any, res: any, next: any): void;
export function cookieAuthToken(req: any, res: any, next: any): any;
export function loadSearchProviderToken(req: any, res: any, next: any): any;
export function cors(options?: {}): (req: any, res: any, next: any) => void;
export function metrics({ path }?: {
    path?: any;
}): promBundle.Middleware;
export function getCompanionMiddleware(options: object): (req: object, res: object, next: Function) => void;
import promBundle = require("express-prom-bundle");
