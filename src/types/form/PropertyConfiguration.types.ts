import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import LayoutData from "sap/ui/core/LayoutData";
import {
    AggregationSetterOrAdder,
    OptionalAggregationGetterSingle,
    OptionalPropertyGetter,
    OptionalPropertySetter,
    PropertyGetter,
    PropertySetter
} from "ui5/genatrix/types/global/CustomClass.types";

export type PropertyConfigurationSettings = $ManagedObjectSettings & {
    name?: string | PropertyBindingInfo | `{${string}}`;
    label?: string | PropertyBindingInfo | `{${string}}`;
    required?: boolean | PropertyBindingInfo | `{${string}}`;
    requiredMessage?: string | PropertyBindingInfo | `{${string}}`;
    readonly?: boolean | PropertyBindingInfo | `{${string}}`;
    excluded?: boolean | PropertyBindingInfo | `{${string}}`;
    datePattern?: string | PropertyBindingInfo | `{${string}}`;
    timePattern?: string | PropertyBindingInfo | `{${string}}`;
    dateTimeSeparator?: string | PropertyBindingInfo | `{${string}}`;
    dateFirst?: boolean | PropertyBindingInfo | `{${string}}`;
    groupingEnabled?: boolean | PropertyBindingInfo | `{${string}}`;
    groupingSeparator?: string | PropertyBindingInfo | `{${string}}`;
    groupingSize?: number | PropertyBindingInfo | `{${string}}`;
    decimalSeparator?: string | PropertyBindingInfo | `{${string}}`;
    parseEmptyValueToZero?: boolean | PropertyBindingInfo | `{${string}}`;
    maximumValue?: string | PropertyBindingInfo | `{${string}}`;
    minimumValue?: string | PropertyBindingInfo | `{${string}}`;
    layoutData?: LayoutData;
};

declare module "ui5/genatrix/form/PropertyConfiguration" {
    export default interface PropertyConfiguration {
        getName: OptionalPropertyGetter<string>;
        setName: OptionalPropertySetter<string, PropertyConfiguration>;

        getLabel: OptionalPropertyGetter<string>;
        setLabel: OptionalPropertySetter<string, PropertyConfiguration>;

        getRequired: PropertyGetter<string>;
        setRequired: PropertySetter<string, PropertyConfiguration>;

        getRequiredMessage: OptionalPropertyGetter<string>;
        setRequiredMessage: OptionalPropertySetter<string, PropertyConfiguration>;

        getReadonly: PropertyGetter<string>;
        setReadonly: PropertySetter<string, PropertyConfiguration>;

        getExcluded: PropertyGetter<string>;
        setExcluded: PropertySetter<string, PropertyConfiguration>;

        getDatePattern: OptionalPropertyGetter<string>;
        setDatePattern: OptionalPropertySetter<string, PropertyConfiguration>;

        getTimePattern: OptionalPropertyGetter<string>;
        setTimePattern: OptionalPropertySetter<string, PropertyConfiguration>;

        getDateTimeSeparator: PropertyGetter<string>;
        setDateTimeSeparator: PropertySetter<string, PropertyConfiguration>;

        getDateFirst: PropertyGetter<boolean>;
        setDateFirst: PropertySetter<boolean, PropertyConfiguration>;

        getGroupingEnabled: PropertyGetter<boolean>;
        setGroupingEnabled: PropertySetter<boolean, PropertyConfiguration>;

        getGroupingSeparator: OptionalPropertyGetter<string>;
        setGroupingSeparator: OptionalPropertySetter<string, PropertyConfiguration>;

        getGroupingSize: PropertyGetter<number>;
        setGroupingSize: PropertySetter<number, PropertyConfiguration>;

        getDecimalSeparator: OptionalPropertyGetter<string>;
        setDecimalSeparator: OptionalPropertySetter<string, PropertyConfiguration>;

        getParseEmptyValueToZero: PropertyGetter<boolean>;
        setParseEmptyValueToZero: PropertySetter<boolean, PropertyConfiguration>;

        getMaximumValue: OptionalPropertyGetter<string>;
        setMaximumValue: OptionalPropertySetter<string, PropertyConfiguration>;

        getMinimumValue: OptionalPropertyGetter<string>;
        setMinimumValue: OptionalPropertySetter<string, PropertyConfiguration>;

        getLayoutData: OptionalAggregationGetterSingle<LayoutData>;
        setLayoutData: AggregationSetterOrAdder<LayoutData, PropertyConfiguration>;
    }
}