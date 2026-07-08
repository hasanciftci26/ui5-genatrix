import Event from "sap/ui/base/Event";
import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import Context from "sap/ui/model/Context";
import ValueList from "ui5/genatrix/form/ValueList";
import ValueListParameter from "ui5/genatrix/form/ValueListParameter";
import {
    AggregationBinder,
    AggregationDestroyer,
    AggregationGetterMulti,
    AggregationInserter,
    AggregationRemoverAll,
    AggregationRemoverSingle,
    AggregationSetterOrAdder,
    OptionalPropertyGetter,
    OptionalPropertySetter,
    PropertyGetter,
    PropertySetter
} from "ui5/genatrix/types/global/CustomClass.types";

export type ValueList$ItemSelectedEventParameters = {
    context: Context;
};

export type ValueList$ItemSelectedEvent = Event<ValueList$ItemSelectedEventParameters, ValueList>;

export type ValueListSettings = $ManagedObjectSettings & {
    name?: string | PropertyBindingInfo | `{${string}}`;
    entitySet?: string | PropertyBindingInfo | `{${string}}`;
    searchSupported?: boolean | PropertyBindingInfo | `{${string}}`;
    caseSensitiveSearch?: boolean | PropertyBindingInfo | `{${string}}`;
    title?: string | PropertyBindingInfo | `{${string}}`;
    valueListWithFixedValues?: boolean | PropertyBindingInfo | `{${string}}`;
    dateRangeOptions?: string | PropertyBindingInfo | `{${string}}`;
    datePattern?: string | PropertyBindingInfo | `{${string}}`;
    timePattern?: string | PropertyBindingInfo | `{${string}}`;
    dateTimeSeparator?: string | PropertyBindingInfo | `{${string}}`;
    dateFirst?: boolean | PropertyBindingInfo | `{${string}}`;
    groupingEnabled?: boolean | PropertyBindingInfo | `{${string}}`;
    groupingSeparator?: string | PropertyBindingInfo | `{${string}}`;
    groupingSize?: number | PropertyBindingInfo | `{${string}}`;
    decimalSeparator?: string | PropertyBindingInfo | `{${string}}`;
    parseEmptyValueToZero?: boolean | PropertyBindingInfo | `{${string}}`;
    filterBarExpanded?: boolean | PropertyBindingInfo | `{${string}}`;
    filterBarWithParametersOnly?: boolean | PropertyBindingInfo | `{${string}}`;
    nonFilterableProperties?: string | PropertyBindingInfo | `{${string}}`;
    showUserInputError?: boolean | PropertyBindingInfo | `{${string}}`;
    userInputErrorMessage?: string | PropertyBindingInfo | `{${string}}`;
    parameters?: ValueListParameter[];
    itemSelected?: (event: ValueList$ItemSelectedEvent) => void;
};

declare module "ui5/genatrix/form/ValueList" {
    export default interface ValueList {
        getName: OptionalPropertyGetter<string>;
        setName: OptionalPropertySetter<string, ValueList>;

        getEntitySet: OptionalPropertyGetter<string>;
        setEntitySet: OptionalPropertySetter<string, ValueList>;

        getSearchSupported: PropertyGetter<boolean>;
        setSearchSupported: PropertySetter<boolean, ValueList>;

        getCaseSensitiveSearch: PropertyGetter<boolean>;
        setCaseSensitiveSearch: PropertySetter<boolean, ValueList>;

        getTitle: OptionalPropertyGetter<string>;
        setTitle: OptionalPropertySetter<string, ValueList>;

        getValueListWithFixedValues: PropertyGetter<boolean>;
        setValueListWithFixedValues: PropertySetter<boolean, ValueList>;

        getDateRangeOptions: OptionalPropertyGetter<string>;
        setDateRangeOptions: OptionalPropertySetter<string, ValueList>;

        getDatePattern: OptionalPropertyGetter<string>;
        setDatePattern: OptionalPropertySetter<string, ValueList>;

        getTimePattern: OptionalPropertyGetter<string>;
        setTimePattern: OptionalPropertySetter<string, ValueList>;

        getDateTimeSeparator: PropertyGetter<string>;
        setDateTimeSeparator: PropertySetter<string, ValueList>;

        getDateFirst: PropertyGetter<boolean>;
        setDateFirst: PropertySetter<boolean, ValueList>;

        getGroupingEnabled: PropertyGetter<boolean>;
        setGroupingEnabled: PropertySetter<boolean, ValueList>;

        getGroupingSeparator: OptionalPropertyGetter<string>;
        setGroupingSeparator: OptionalPropertySetter<string, ValueList>;

        getGroupingSize: PropertyGetter<boolean>;
        setGroupingSize: PropertySetter<boolean, ValueList>;

        getDecimalSeparator: OptionalPropertyGetter<string>;
        setDecimalSeparator: OptionalPropertySetter<string, ValueList>;

        getParseEmptyValueToZero: PropertyGetter<boolean>;
        setParseEmptyValueToZero: PropertySetter<boolean, ValueList>;

        getFilterBarExpanded: PropertyGetter<boolean>;
        setFilterBarExpanded: PropertySetter<boolean, ValueList>;

        getFilterBarWithParametersOnly: PropertyGetter<boolean>;
        setFilterBarWithParametersOnly: PropertySetter<boolean, ValueList>;

        getNonFilterableProperties: OptionalPropertyGetter<string>;
        setNonFilterableProperties: OptionalPropertySetter<string, ValueList>;

        getShowUserInputError: PropertyGetter<boolean>;
        setShowUserInputError: PropertySetter<boolean, ValueList>;

        getUserInputErrorMessage: PropertyGetter<string>;
        setUserInputErrorMessage: PropertySetter<string, ValueList>;

        getParameters: AggregationGetterMulti<ValueListParameter>;
        addParameter: AggregationSetterOrAdder<ValueListParameter, ValueList>;
        insertParameter: AggregationInserter<ValueListParameter, ValueList>;
        bindParameters: AggregationBinder<ValueList>;
        removeParameter: AggregationRemoverSingle<ValueListParameter>;
        removeAllParameters: AggregationRemoverAll<ValueListParameter>;
        destroyParameters: AggregationDestroyer<ValueList>;

        attachItemSelected(handler: (event: ValueList$ItemSelectedEvent) => void, listener?: object): ValueList;
        attachItemSelected(data: object, handler: (event: ValueList$ItemSelectedEvent) => void, listener?: object): ValueList;
        fireItemSelected: (parameters?: ValueList$ItemSelectedEventParameters) => ValueList;
    }
}