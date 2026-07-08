import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { ParameterType } from "ui5/genatrix/form/enum/ParameterType";
import { OptionalPropertyGetter, OptionalPropertySetter, PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/CustomClass.types";

export type ValueListParameterSettings = $ManagedObjectSettings & {
    type?: ParameterType | keyof typeof ParameterType | PropertyBindingInfo | `{${string}}`;
    localDataProperty?: string | PropertyBindingInfo | `{${string}}`;
    valueListProperty?: string | PropertyBindingInfo | `{${string}}`;
};

declare module "ui5/genatrix/form/ValueListParameter" {
    export default interface ValueListParameter {
        getType: PropertyGetter<ParameterType | keyof typeof ParameterType>;
        setType: PropertySetter<ParameterType | keyof typeof ParameterType, ValueListParameter>;

        getLocalDataProperty: OptionalPropertyGetter<string>;
        setLocalDataProperty: OptionalPropertySetter<string, ValueListParameter>;

        getValueListProperty: OptionalPropertyGetter<string>;
        setValueListProperty: OptionalPropertySetter<string, ValueListParameter>;
    }
}