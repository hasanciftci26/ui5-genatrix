import { $DateTimePickerSettings } from "sap/m/DateTimePicker";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomDateTimePickerSettings = $DateTimePickerSettings & {
    propertyName: string;
};

declare module "ui5/genatrix/control/extension/CustomDateTimePicker" {
    export default interface CustomDateTimePicker {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomDateTimePicker>;
    }
}