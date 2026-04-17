import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import ValueListParameterType from "ui5/genatrix/metadata/form/enum/ValueListParameterType";
import {
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";

type ParameterType = typeof ValueListParameterType[keyof typeof ValueListParameterType];

export type ValueListParameterSettings = $ManagedObjectSettings & {
    type?: ParameterType;
    localDataProperty?: string;
    valueListProperty?: string;
};

declare module "ui5/genatrix/metadata/form/ValueListParameter" {
    export default interface ValueListParameter {
        getType: OptionalPropertyGetter<ParameterType>;
        setType: OptionalPropertySetter<ParameterType, ValueListParameter>;
        getLocalDataProperty: OptionalPropertyGetter<string>;
        setLocalDataProperty: OptionalPropertySetter<string, ValueListParameter>;
        getValueListProperty: OptionalPropertyGetter<string>;
        setValueListProperty: OptionalPropertySetter<string, ValueListParameter>;
    }
}