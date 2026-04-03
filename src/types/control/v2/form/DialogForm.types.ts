import { ButtonType } from "sap/m/library";
import { $ControlSettings } from "sap/ui/core/Control";
import { URI } from "sap/ui/core/library";
import FormMode from "ui5/genatrix/control/enum/form/FormMode";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

type FormModeType = typeof FormMode[keyof typeof FormMode];

export type DialogFormSettings = $ControlSettings & {
    entitySet?: string;
    formMode?: FormModeType;
    buttonText?: string;
    buttonIcon?: URI;
    buttonType?: ButtonType;
};

declare module "ui5/genatrix/control/v2/form/DialogForm" {
    export default interface DialogForm {
        getEntitySet: OptionalPropertyGetter<string>;
        setEntitySet: OptionalPropertySetter<string, DialogForm>;
        getFormMode: OptionalPropertyGetter<FormModeType>;
        setFormMode: OptionalPropertySetter<FormModeType, DialogForm>;
        getButtonText: OptionalPropertyGetter<string>;
        getButtonIcon: OptionalPropertyGetter<URI>;
        getButtonType: OptionalPropertyGetter<ButtonType>;
    }
}