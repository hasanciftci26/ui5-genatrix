import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import FilterRestriction from "ui5/genatrix/metadata/enum/valuelist/FilterRestriction";
import ParameterType from "ui5/genatrix/metadata/enum/valuelist/ParameterType";
import {
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";

type ParameterT = typeof ParameterType[keyof typeof ParameterType];
type FilterRestrictionType = typeof FilterRestriction[keyof typeof FilterRestriction];

export type ValueListParameterSettings = $ManagedObjectSettings & {
    type?: ParameterT;
    localDataProperty?: string;
    valueListProperty?: string;
    valueListPropertyLabel?: string;
    filterRestriction?: FilterRestrictionType;
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
        getFilterRestriction: OptionalPropertyGetter<FilterRestrictionType>;
        setFilterRestriction: OptionalPropertySetter<FilterRestrictionType, ValueListParameter>;
    }
}