import ManagedObject from "sap/ui/base/ManagedObject";

export type PropertyGetter<T> = () => T;
export type PropertySetter<T, TThis> = (value: T) => TThis;
export type OptionalPropertyGetter<T> = () => T | undefined;
export type OptionalPropertySetter<T, TThis> = (value?: T) => TThis;
export type AggregationGetter<T extends ManagedObject | ManagedObject[] | undefined> = () => T;
export type AggregationSetter<T extends ManagedObject> = (aggregation: T) => void;