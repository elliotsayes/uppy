declare function _exports(redisUrl: any, redisPubSubScope: any): {
    on: (eventName: string, handler: any) => void | EventEmitter;
    once: (eventName: string, handler: any) => void | EventEmitter;
    emit: (eventName: string, ...args: any[]) => void;
    removeListener: (eventName: string, handler: any) => Promise<void> | EventEmitter;
    removeAllListeners: (eventName: string) => Promise<void> | EventEmitter;
};
export = _exports;
