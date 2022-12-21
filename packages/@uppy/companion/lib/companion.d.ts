export namespace errors {
    export { ProviderApiError };
    export { ProviderAuthError };
}
export const socket: (server: import("http").Server | import("https").Server) => void;
export function app(optionsArg?: object): {
    app: import('express').Express;
    emitter: any;
};
import { ProviderApiError } from "./server/provider/error";
import { ProviderAuthError } from "./server/provider/error";
