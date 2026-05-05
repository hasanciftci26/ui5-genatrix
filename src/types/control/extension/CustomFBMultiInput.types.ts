import { $MultiInputSettings } from "sap/m/MultiInput";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomFBMultiInputSettings = $MultiInputSettings & {
    propertyName: string;
};

declare module "ui5/genatrix/control/extension/CustomFBMultiInput" {
    export default interface CustomMultiInput {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomFBMultiInput>;
    }
}