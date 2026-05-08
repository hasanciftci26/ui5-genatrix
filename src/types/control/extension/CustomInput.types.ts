import { $InputSettings } from "sap/m/Input";
import { InputBase$ChangeEventParameters } from "sap/m/InputBase";
import Event from "sap/ui/base/Event";
import CustomInput from "ui5/genatrix/control/extension/CustomInput";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomInputSettings = $InputSettings & {
    propertyName: string;
};

export type CustomInput$ChangeEvent = Event<InputBase$ChangeEventParameters, CustomInput>;

declare module "ui5/genatrix/control/extension/CustomInput" {
    export default interface CustomInput {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomInput>;
    }
}