import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type PropertyOptionSettings = $ManagedObjectSettings & {
    propertyName?: string;
    label?: string;
    required?: boolean;
    readonly?: boolean;
    excluded?: boolean;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator?: string;
    dateFirst?: boolean;
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
    parseEmptyValueToZero?: boolean;
};

declare module "ui5/genatrix/metadata/form/PropertyOption" {
    export default interface PropertyOption {
        getPropertyName: OptionalPropertyGetter<string>;
        setPropertyName: OptionalPropertySetter<string, PropertyOption>;
        getLabel: OptionalPropertyGetter<string>;
        setLabel: OptionalPropertySetter<string, PropertyOption>;
        getRequired: OptionalPropertyGetter<boolean>;
        setRequired: OptionalPropertySetter<boolean, PropertyOption>;
        getReadonly: OptionalPropertyGetter<boolean>;
        setReadonly: OptionalPropertySetter<boolean, PropertyOption>;
        getExcluded: OptionalPropertyGetter<boolean>;
        setExcluded: OptionalPropertySetter<boolean, PropertyOption>;
        getDatePattern: OptionalPropertyGetter<string>;
        setDatePattern: OptionalPropertySetter<string, PropertyOption>;
        getTimePattern: OptionalPropertyGetter<string>;
        setTimePattern: OptionalPropertySetter<string, PropertyOption>;
        getDateTimeSeparator: OptionalPropertyGetter<string>;
        setDateTimeSeparator: OptionalPropertySetter<string, PropertyOption>;
        getDateFirst: OptionalPropertyGetter<boolean>;
        setDateFirst: OptionalPropertySetter<boolean, PropertyOption>;
        getGroupingEnabled: OptionalPropertyGetter<boolean>;
        setGroupingEnabled: OptionalPropertySetter<boolean, PropertyOption>;
        getGroupingSeparator: OptionalPropertyGetter<string>;
        setGroupingSeparator: OptionalPropertySetter<string, PropertyOption>;
        getGroupingSize: OptionalPropertyGetter<number>;
        setGroupingSize: OptionalPropertySetter<number, PropertyOption>;
        getDecimalSeparator: OptionalPropertyGetter<string>;
        setDecimalSeparator: OptionalPropertySetter<string, PropertyOption>;
        getParseEmptyValueToZero: OptionalPropertyGetter<boolean>;
        setParseEmptyValueToZero: OptionalPropertySetter<boolean, PropertyOption>;
    }
}