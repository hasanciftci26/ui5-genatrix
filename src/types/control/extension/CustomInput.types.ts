import { $InputSettings } from "sap/m/Input";
import ValueList from "ui5/genatrix/metadata/form/ValueList";
import { OptionalPropertyGetter, OptionalPropertySetter, PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomInputSettings = $InputSettings & {
    propertyName: string;
    valueListInstance?: ValueList;
};

declare module "ui5/genatrix/control/extension/CustomInput" {
    export default interface CustomInput {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomInput>;
        getValueListInstance: OptionalPropertyGetter<ValueList>;
        setValueListInstance: OptionalPropertySetter<ValueList, CustomInput>;
    }
}