import {MultipleVersionErrorMessage} from "./types";

const hasInternalType = (obj: unknown): obj is {__type__: string} => {
    return typeof obj === "object" && obj !== null && "__type__" in obj;
};

export const ERROR_EXECUTION_EXIT_CODE = 1;
export const ERROR_MULTIPLE_VERSION_EXIT_CODE = 2;
export const ERROR_UNKNOWN_EXIT_CODE = 3;

export class ExecutionError extends Error {
    static isInstance(error: unknown): error is ExecutionError {
        return hasInternalType(error) && error.__type__ === "ExecutionError";
    }

    readonly exitCode = ERROR_EXECUTION_EXIT_CODE;
    private readonly __type__ = "ExecutionError";

    constructor(message?: string) {
        super(message);
    }
}

export class MultipleVersionError extends Error {
    static isInstance(error: unknown): error is MultipleVersionError {
        return hasInternalType(error) && error.__type__ === "MultipleVersionError";
    }

    readonly exitCode = ERROR_MULTIPLE_VERSION_EXIT_CODE;
    readonly errorMessages: MultipleVersionErrorMessage[];
    private readonly __type__ = "MultipleVersionError";

    constructor(errorMessages: MultipleVersionErrorMessage[]) {
        super();
        this.errorMessages = errorMessages;
    }
}
