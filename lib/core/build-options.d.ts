export declare type BuildOptions = {
    /** Target to serve. */
    target?: string;
    /**
     * Port to listen on.
     */
    port: number;
    /**
     * Host to listen on.
     */
    host: string;
    /**
     * Serve using HTTPS.
     */
    ssl: boolean;
    /**
     * Opens the url in default browser.
     */
    open: boolean;
    /**
     * Whether to reload the page on change, using live-reload.
     */
    liveReload: boolean;
    /**
     * Specify the URL that the browser client will use.
     */
    publicHost?: string;
    /**
     * Don't verify connected clients are part of allowed hosts.
     */
    disableHostCheck?: boolean;
    hmr?: boolean;
    poll?: string;
    servePath?: string;
    proxyConfig?: string;
};
export declare function getBuildOptions(options?: BuildOptions): BuildOptions;
