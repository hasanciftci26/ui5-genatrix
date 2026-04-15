import Dialog from "sap/m/Dialog";
import { ButtonType, TitleAlignment } from "sap/m/library";
import Event from "sap/ui/base/Event";
import { URI } from "sap/ui/core/library";
import ODataModelV2 from "sap/ui/model/odata/v2/ODataModel";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";
import DialogGenerator from "ui5/genatrix/generator/core/DialogGenerator";

export type DialogGeneratorSettings = {
    title: string;
    titleAlignment: TitleAlignment;
    contentWidth?: string;
    resizable: boolean;
    draggable: boolean;
    addSubmitButton: boolean;
    submitButtonText?: string;
    submitButtonIcon?: URI;
    submitButtonType: ButtonType;
    closeButtonText?: string;
    closeButtonIcon?: URI;
    closeButtonType: ButtonType;
    oDataModel: ODataModelV2 | ODataModelV4
};

export type DialogGenerator$SubmitEventParameters = {
    dialog: Dialog;
};

export type DialogGenerator$SubmitEvent = Event<DialogGenerator$SubmitEventParameters, DialogGenerator>;
export type DialogGenerator$SubmitEventHandler = (event: DialogGenerator$SubmitEvent) => void;

export type DialogGenerator$CloseEventParameters = {
    dialog: Dialog;
};

export type DialogGenerator$CloseEvent = Event<DialogGenerator$CloseEventParameters, DialogGenerator>;
export type DialogGenerator$CloseEventHandler = (event: DialogGenerator$CloseEvent) => void;