import ManagedObject, { AggregationBindingInfo } from "sap/ui/base/ManagedObject";

export type PropertyGetter<T> = () => T;
export type OptionalPropertyGetter<T> = () => T | undefined;

export type PropertySetter<T, TThis> = (value: T) => TThis;
export type OptionalPropertySetter<T, TThis> = (value?: T) => TThis;

export type AggregationGetterSingle<T extends ManagedObject> = () => T;
export type OptionalAggregationGetterSingle<T extends ManagedObject> = () => T | undefined;
export type AggregationGetterMulti<T extends ManagedObject> = () => T[];

export type AggregationSetterOrAdder<T extends ManagedObject, TThis> = (aggregation: T) => TThis;
export type AggregationInserter<T extends ManagedObject, TThis> = (aggregation: T, index: number) => TThis;

export type AggregationBinder<TThis> = (bindingInfo: AggregationBindingInfo) => TThis;

export type AggregationRemoverSingle<T extends ManagedObject> = (reference: number | string | T) => T | null;
export type AggregationRemoverAll<T extends ManagedObject> = () => T[];

export type AggregationDestroyer<TThis> = () => TThis;