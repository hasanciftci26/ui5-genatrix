import { $DatePickerSettings } from "sap/m/DatePicker";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomDatePickerSettings = $DatePickerSettings & {
    propertyName: string;
};

declare module "ui5/genatrix/control/extension/CustomDatePicker" {
    export default interface CustomDatePicker {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomDatePicker>;
    }
}