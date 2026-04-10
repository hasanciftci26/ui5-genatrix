import Label from "sap/m/Label";
import Control from "sap/ui/core/Control";

export type FormElement = {
    propertyName: string;
    label: Label;
    control: Control;
    grouped: boolean;
};