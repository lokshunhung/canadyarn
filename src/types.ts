export type DependencyName = ({__type__: "DependencyName"} & string) | string;

export type MultipleVersionErrorMessage = ({__type__: "MultipleVersionErrorMessage"} & string) | string;

export type QualifiedName = ({__type__: "QualifiedName"} & string) | string;

export type Version = ({__type__: "Version"} & string) | string;

export type DependencyResolution = {
    version: string;
    resolved: string;
    integrity: string;
    dependencies?: Record<string, string>;
};

export type ParseResult = {
    type: "merge" | "success" | "conflict";
    object: Record<QualifiedName, DependencyResolution>;
};

export type CheckableDependencies = Record<DependencyName, Record<Version, DependencyResolution[]>>;
