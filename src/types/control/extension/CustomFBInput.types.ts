import { $InputSettings } from "sap/m/Input";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomFBInputSettings = $InputSettings & {
    propertyName: string;
};

declare module "ui5/genatrix/control/extension/CustomFBInput" {
    export default interface CustomInput {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomFBInput>;
    }
}