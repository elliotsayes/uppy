export function getCredentialsOverrideMiddleware(providers: Record<string, typeof Provider>, companionOptions: object): import('express').RequestHandler;
export function getCredentialsResolver(providerName: string, companionOptions: object, req: object): (providerName: string, companionOptions: object, credentialRequestParams?: object) => Promise<any>;
import Provider = require("./Provider");
