/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "@yarnpkg/lockfile" {
    /**
     * Parse the lockfile.
     */
    export function parse(str: string, fileLoc?: string): any;
}
