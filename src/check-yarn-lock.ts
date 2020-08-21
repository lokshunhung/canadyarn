import {bold as cb} from "chalk";
import {ExecutionError} from "./error";
import type {CheckableDependencies, DependencyName, MultipleVersionErrorMessage, ParseResult} from "./types";

export function checkYarnLock(checkSingleVersionDependencies: ReadonlyArray<DependencyName>, lockfile: Readonly<ParseResult>): MultipleVersionErrorMessage[] {
    const checkableDeps: CheckableDependencies = (function () {
        const checkableDeps = {};
        checkSingleVersionDependencies.forEach(dep => {
            checkableDeps[dep] = {};
        });
        return checkableDeps;
    })();

    if (lockfile.type !== "success") {
        throw new ExecutionError("failed to parse yarn.lock");
    }

    const lockfileEntries = Object.entries(lockfile.object);

    lockfileEntries.forEach(([qualifiedName, resolution]) => {
        const dep = checkSingleVersionDependencies.find(dep => qualifiedName.startsWith(`${dep}@`));
        if (dep !== undefined) {
            checkableDeps[dep][resolution.version] = checkableDeps[dep][resolution.version] || [];
            checkableDeps[dep][resolution.version].push(resolution); // only need resolution.version for now
        }
    });

    const errorMessages: MultipleVersionErrorMessage[] = [];

    Object.entries(checkableDeps).forEach(([dep, versionMap]) => {
        const versions: string[] = Object.keys(versionMap);
        if (versions.length !== 1) {
            const buffer: string[] = [];
            buffer.push(" > ", `${cb.red(versions.length)} versions of ${cb.blueBright(`"${dep}"`)} detected`);
            buffer.push("\n");
            buffer.push("   ", versions.join(", "));
            errorMessages.push(buffer.join(""));
        }
    });

    return errorMessages;
}
