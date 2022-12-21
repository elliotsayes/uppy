export function withProviderErrorHandling({ fn, tag, providerName, isAuthError, getJsonErrorMessage }: {
    fn: any;
    tag: any;
    providerName: any;
    isAuthError: any;
    getJsonErrorMessage: any;
}): Promise<any>;
