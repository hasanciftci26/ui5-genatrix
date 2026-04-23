import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import ValueListParameter from "ui5/genatrix/metadata/form/ValueListParameter";
import {
    AggregationBinder,
    AggregationDestroyer,
    AggregationGetterMulti,
    AggregationInserter,
    AggregationRemoverAll,
    AggregationRemoverSingle,
    AggregationSetterOrAdder,
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type ValueListSettings = $ManagedObjectSettings & {
    propertyName?: string;
    entitySet?: string;
    searchSupported?: boolean;
    caseSensitiveSearch?: boolean;
    title?: string;
    valueListWithFixedValues?: boolean;
    dateRangeOptions?: string;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator?: string;
    dateFirst?: boolean;
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
    parseEmptyValueToZero?: boolean;
    filterBarExpanded?: boolean;
    filterBarWithParametersOnly?: boolean;
    nonFilterableProperties?: string;
    parameters?: ValueListParameter[];
};

declare module "ui5/genatrix/metadata/form/ValueList" {
    export default interface ValueList {
        getPropertyName: OptionalPropertyGetter<string>;
        setPropertyName: OptionalPropertySetter<string, ValueList>;
        getEntitySet: OptionalPropertyGetter<string>;
        setEntitySet: OptionalPropertySetter<string, ValueList>;
        getSearchSupported: OptionalPropertyGetter<boolean>;
        setSearchSupported: OptionalPropertySetter<boolean, ValueList>;
        getCaseSensitiveSearch: OptionalPropertyGetter<boolean>;
        setCaseSensitiveSearch: OptionalPropertySetter<boolean, ValueList>;
        getTitle: OptionalPropertyGetter<string>;
        setTitle: OptionalPropertySetter<string, ValueList>;
        getValueListWithFixedValues: OptionalPropertyGetter<boolean>;
        setValueListWithFixedValues: OptionalPropertySetter<boolean, ValueList>;
        getDateRangeOptions: OptionalPropertyGetter<string>;
        setDateRangeOptions: OptionalPropertySetter<string, ValueList>;
        getDatePattern: OptionalPropertyGetter<string>;
        setDatePattern: OptionalPropertySetter<string, ValueList>;
        getTimePattern: OptionalPropertyGetter<string>;
        setTimePattern: OptionalPropertySetter<string, ValueList>;
        getDateTimeSeparator: OptionalPropertyGetter<string>;
        setDateTimeSeparator: OptionalPropertySetter<string, ValueList>;
        getDateFirst: OptionalPropertyGetter<boolean>;
        setDateFirst: OptionalPropertySetter<boolean, ValueList>;
        getGroupingEnabled: OptionalPropertyGetter<boolean>;
        setGroupingEnabled: OptionalPropertySetter<boolean, ValueList>;
        getGroupingSeparator: OptionalPropertyGetter<string>;
        setGroupingSeparator: OptionalPropertySetter<string, ValueList>;
        getGroupingSize: OptionalPropertyGetter<number>;
        setGroupingSize: OptionalPropertySetter<number, ValueList>;
        getDecimalSeparator: OptionalPropertyGetter<string>;
        setDecimalSeparator: OptionalPropertySetter<string, ValueList>;
        getParseEmptyValueToZero: OptionalPropertyGetter<boolean>;
        setParseEmptyValueToZero: OptionalPropertySetter<boolean, ValueList>;
        getFilterBarExpanded: OptionalPropertyGetter<boolean>;
        setFilterBarExpanded: OptionalPropertySetter<boolean, ValueList>;
        getFilterBarWithParametersOnly: OptionalPropertyGetter<boolean>;
        setFilterBarWithParametersOnly: OptionalPropertySetter<boolean, ValueList>;
        getNonFilterableProperties: OptionalPropertyGetter<string>;
        setNonFilterableProperties: OptionalPropertySetter<string, ValueList>;

        getParameters: AggregationGetterMulti<ValueListParameter>;
        addParameter: AggregationSetterOrAdder<ValueListParameter, ValueList>;
        insertParameter: AggregationInserter<ValueListParameter, ValueList>;
        bindParameters: AggregationBinder<ValueList>;
        removeParameter: AggregationRemoverSingle<ValueListParameter>;
        removeAllParameters: AggregationRemoverAll<ValueListParameter>;
        destroyParameters: AggregationDestroyer<ValueList>;
    }
}