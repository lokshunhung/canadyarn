import {parse} from "@yarnpkg/lockfile";
import {bold as cb} from "chalk";
import {existsSync, readFileSync, statSync} from "fs";
import {join} from "path";
import {checkYarnLock} from "./check-yarn-lock";
import {ERROR_UNKNOWN_EXIT_CODE, ExecutionError, MultipleVersionError} from "./error";
import type {DependencyName, MultipleVersionErrorMessage, ParseResult} from "./types";

function execute(): void {
    const checkSingleVersionDependencies: DependencyName[] = (function () {
        const filepath = join(process.cwd(), "package.json");
        if (!(existsSync(filepath) && statSync(filepath).isFile())) {
            throw new ExecutionError("cannot find package.json");
        }
        const packageJson = JSON.parse(readFileSync(filepath, {encoding: "utf8"}));
        if (!("checkSingleVersionDependencies" in packageJson && Array.isArray(packageJson.checkSingleVersionDependencies))) {
            throw new ExecutionError("package.json#checkSingleVersionDependencies must be an array");
        }
        return packageJson.checkSingleVersionDependencies;
    })();
    const lockfile: ParseResult = (function () {
        const filepath = join(process.cwd(), "yarn.lock");
        if (!(existsSync(filepath) && statSync(filepath).isFile())) {
            throw new Error("[check-yarn-lock]: cannot find yarn.lock");
        }
        return parse(readFileSync(filepath, {encoding: "utf8"}));
    })();
    const errorMessages: MultipleVersionErrorMessage[] = checkYarnLock(checkSingleVersionDependencies, lockfile);
    if (errorMessages.length > 0) {
        throw new MultipleVersionError(errorMessages);
    }
}

try {
    execute();
} catch (error) {
    const buffer: string[] = [];
    let processExitCode: number;
    buffer.push(`${cb.yellowBright("[check-yarn-lock-single-version]")}: `);
    if (ExecutionError.isInstance(error)) {
        const {exitCode, message} = error;
        processExitCode = exitCode;
        buffer.push("an execution error occurred ", cb.whiteBright(":("));
        buffer.push("\n");
        buffer.push(" > ", cb.whiteBright(message));
        buffer.push("\n");
    } else if (MultipleVersionError.isInstance(error)) {
        const {exitCode, errorMessages} = error;
        processExitCode = exitCode;
        buffer.push(cb.whiteBright(`found ${cb.red(errorMessages.length)} modules with non-singular version resolutions`));
        buffer.push("\n");
        errorMessages.forEach(errorMessage => {
            buffer.push(errorMessage);
            buffer.push("\n");
        });
        buffer.push("\n");
        buffer.push(Array(40).fill("-").join(""));
        buffer.push("\n");
        buffer.push("\n");
        buffer.push(`The above list ${cb.whiteBright(`might contain ${cb.redBright("false")} positives`)} `);
        buffer.push("if the resolution of dependency version range is removed after upgrading, ");
        buffer.push(`but yarn does not remove the resolution from ${cb.whiteBright("yarn.lock")}.`);
        buffer.push("\n");
        buffer.push("\n");
        buffer.push(`Try running "${cb.blueBright("$ yarn install")}" again in the workspace root to update ${cb.whiteBright("yarn.lock")}.`);
        buffer.push("\n");
        buffer.push("\n");
        buffer.push(`Run "${cb.blueBright("$ yarn why <PACKAGE_NAME>")}" to find out where the duplicate dependencies come from.`);
        buffer.push("\n");
        buffer.push("\n");
        buffer.push(`If you don't know what to do, `);
        buffer.push(cb.whiteBright("ask the "), "🍁", cb.whiteBright("Canadian"), "🍁", cb.whiteBright(" guy"), " (he knows how to fix this) ", cb.whiteBright(":)"));
        buffer.push("\n");
    } else {
        processExitCode = ERROR_UNKNOWN_EXIT_CODE;
        buffer.push(cb.yellowBright("[check-yarn-lock-single-version]"));
        buffer.push(": an unknown error occurred");
        buffer.push("\n");
        let message: string | undefined;
        if (typeof error === "string") {
            message = error;
        } else if (typeof error === "object" && "message" in error && typeof error.message === "string") {
            message = error.message;
        }
        if (message) {
            buffer.push(" > ", cb.whiteBright(error.mess));
            buffer.push("\n");
        }
    }
    console.warn(buffer.join(""));
    process.exit(processExitCode);
}
