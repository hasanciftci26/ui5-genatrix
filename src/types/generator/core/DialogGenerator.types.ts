import { ButtonType, TitleAlignment } from "sap/m/library";
import { URI } from "sap/ui/core/library";

export type DialogGeneratorSettings = {
    title: string;
    titleAlignment: TitleAlignment;
    addSubmitButton: boolean;
    submitButtonText?: string;
    submitButtonIcon?: URI;
    submitButtonType: ButtonType;
    closeButtonText?: string;
    closeButtonIcon?: URI;
    closeButtonType: ButtonType;
};