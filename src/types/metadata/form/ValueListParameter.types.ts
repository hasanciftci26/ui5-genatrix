import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import FilterExpressionRestriction from "ui5/genatrix/metadata/enum/valuelist/FilterExpressionRestriction";
import ParameterType from "ui5/genatrix/metadata/enum/valuelist/ParameterType";
import {
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";

type ParameterT = typeof ParameterType[keyof typeof ParameterType];
type FilterExpressionRestrictionType = typeof FilterExpressionRestriction[keyof typeof FilterExpressionRestriction];

export type ValueListParameterSettings = $ManagedObjectSettings & {
    type?: ParameterT;
    localDataProperty?: string;
    valueListProperty?: string;
    valueListPropertyLabel?: string;
    filterExpressionRestriction?: FilterExpressionRestrictionType;
};

declare module "ui5/genatrix/metadata/form/ValueListParameter" {
    export default interface ValueListParameter {
        getType: OptionalPropertyGetter<ParameterT>;
        setType: OptionalPropertySetter<ParameterT, ValueListParameter>;
        getLocalDataProperty: OptionalPropertyGetter<string>;
        setLocalDataProperty: OptionalPropertySetter<string, ValueListParameter>;
        getValueListProperty: OptionalPropertyGetter<string>;
        setValueListProperty: OptionalPropertySetter<string, ValueListParameter>;
        getValueListPropertyLabel: OptionalPropertyGetter<string>;
        setValueListPropertyLabel: OptionalPropertySetter<string, ValueListParameter>;
        getFilterExpressionRestriction: OptionalPropertyGetter<FilterExpressionRestrictionType>;
        setFilterExpressionRestriction: OptionalPropertySetter<FilterExpressionRestrictionType, ValueListParameter>;
    }
}