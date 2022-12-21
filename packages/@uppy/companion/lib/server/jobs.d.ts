export function startCleanUpJob(dirPath: string): void;
export function startPeriodicPingJob({ urls, interval, count, staticPayload, version, processId }: {
    urls: any;
    interval?: number;
    count: any;
    staticPayload?: {};
    version: any;
    processId: any;
}): Promise<void>;
