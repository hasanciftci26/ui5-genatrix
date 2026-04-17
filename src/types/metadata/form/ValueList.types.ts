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

        getParameters: AggregationGetterMulti<ValueListParameter>;
        addParameter: AggregationSetterOrAdder<ValueListParameter, ValueList>;
        insertParameter: AggregationInserter<ValueListParameter, ValueList>;
        bindParameters: AggregationBinder<ValueList>;
        removeParameter: AggregationRemoverSingle<ValueListParameter>;
        removeAllParameters: AggregationRemoverAll<ValueListParameter>;
        destroyParameters: AggregationDestroyer<ValueList>;
    }
}