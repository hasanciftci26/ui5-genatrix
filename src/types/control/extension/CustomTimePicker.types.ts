import { $TimePickerSettings } from "sap/m/TimePicker";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomTimePickerSettings = $TimePickerSettings & {
    propertyName: string;
};

declare module "ui5/genatrix/control/extension/CustomTimePicker" {
    export default interface CustomTimePicker {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomTimePicker>;
    }
}