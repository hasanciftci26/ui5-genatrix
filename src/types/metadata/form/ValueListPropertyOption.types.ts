import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import FilterRestriction from "ui5/genatrix/metadata/enum/valuelist/FilterRestriction";
import {
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type FilterRestrictionType = typeof FilterRestriction[keyof typeof FilterRestriction];

export type ValueListPropertyOptionSettings = $ManagedObjectSettings & {
    propertyName?: string;
    label?: string;
    filterRestriction?: FilterRestrictionType;
};

declare module "ui5/genatrix/metadata/form/ValueListPropertyOption" {
    export default interface ValueListPropertyOption {
        getPropertyName: OptionalPropertyGetter<string>;
        setPropertyName: OptionalPropertySetter<string, ValueListPropertyOption>;
        getLabel: OptionalPropertyGetter<string>;
        setLabel: OptionalPropertySetter<string, ValueListPropertyOption>;
        getFilterRestriction: OptionalPropertyGetter<FilterRestrictionType>;
        setFilterRestriction: OptionalPropertySetter<FilterRestrictionType, ValueListPropertyOption>;
    }
}