import { $ComboBoxSettings } from "sap/m/ComboBox";
import { PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type CustomComboBoxSettings = $ComboBoxSettings & {
    propertyName: string;
};

declare module "ui5/genatrix/control/extension/CustomComboBox" {
    export default interface CustomComboBox {
        getPropertyName: PropertyGetter<string>;
        setPropertyName: PropertySetter<string, CustomComboBox>;
    }
}