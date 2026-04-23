import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import ParameterType from "ui5/genatrix/metadata/enum/valuelist/ParameterType";
import {
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";

type ParameterT = typeof ParameterType[keyof typeof ParameterType];

export type ValueListParameterSettings = $ManagedObjectSettings & {
    type?: ParameterT;
    localDataProperty?: string;
    valueListProperty?: string;
};

declare module "ui5/genatrix/metadata/form/ValueListParameter" {
    export default interface ValueListParameter {
        getType: OptionalPropertyGetter<ParameterT>;
        setType: OptionalPropertySetter<ParameterT, ValueListParameter>;
        getLocalDataProperty: OptionalPropertyGetter<string>;
        setLocalDataProperty: OptionalPropertySetter<string, ValueListParameter>;
        getValueListProperty: OptionalPropertyGetter<string>;
        setValueListProperty: OptionalPropertySetter<string, ValueListParameter>;
    }
}