import { ButtonType, TitleAlignment } from "sap/m/library";
import Event from "sap/ui/base/Event";
import { $ControlSettings } from "sap/ui/core/Control";
import { URI } from "sap/ui/core/library";
import Context from "sap/ui/model/odata/v2/Context";
import FormMode from "ui5/genatrix/control/enum/form/FormMode";
import DialogForm from "ui5/genatrix/control/v2/form/DialogForm";
import FormGroup from "ui5/genatrix/metadata/form/FormGroup";
import FormLayout from "ui5/genatrix/metadata/form/FormLayout";
import PropertyOption from "ui5/genatrix/metadata/form/PropertyOption";
import ValidationLogic from "ui5/genatrix/metadata/form/ValidationLogic";
import Response from "ui5/genatrix/odata/v2/Response";
import {
    AggregationBinder,
    AggregationDestroyer,
    AggregationGetterMulti,
    AggregationGetterSingle,
    AggregationInserter,
    AggregationRemoverAll,
    AggregationRemoverSingle,
    AggregationSetterOrAdder,
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";

type ContextRef<ContextDataT extends Record<string, any>> = string | ContextDataT | Context;
export type ContextProvider = () => Promise<Context> | Context;
export type BeforeSubmit = (context: Context) => Promise<boolean | void> | boolean | void;
export type FormModeType = typeof FormMode[keyof typeof FormMode];

export type DialogFormSettings<ContextDataT extends Record<string, any>> = $ControlSettings & {
    entitySet?: string;
    formMode?: FormModeType;
    initialData?: ContextDataT;
    buttonText?: string;
    buttonIcon?: URI;
    buttonType?: ButtonType;
    dialogTitle?: string;
    dialogTitleAlignment?: TitleAlignment;
    dialogWidth?: string;
    dialogResizable?: boolean;
    dialogDraggable?: boolean;
    submitButtonText?: string;
    submitButtonIcon?: URI;
    submitButtonType?: ButtonType;
    closeButtonText?: string;
    closeButtonIcon?: URI;
    closeButtonType?: ButtonType;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator?: string;
    dateFirst?: boolean;
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
    parseEmptyValueToZero?: boolean;
    closeDialogOnSuccess?: boolean;
    showSubmitError?: boolean;
    submitErrorFallbackMessage?: string;
    showBusyOnSubmit?: boolean;
    requiredProperties?: string;
    readonlyProperties?: string;
    excludedProperties?: string;
    keysAlwaysIncluded?: boolean;
    formValidationErrorMessage?: string;
    selectRowErrorMessage?: string;
    contextRef?: ContextRef<ContextDataT>;
    oDataModelName?: string;
    contextProvider?: ContextProvider;
    beforeSubmit?: BeforeSubmit;
    propertyOptions?: PropertyOption[];
    formGroups?: FormGroup[];
    validationLogics?: ValidationLogic[];
    formLayout?: FormLayout;
};

export type DialogForm$FormValidationErrorEventParameters = {
    invalidProperties: string[];
};

export type DialogForm$FormValidationErrorEvent = Event<DialogForm$FormValidationErrorEventParameters, DialogForm>;

export type DialogForm$SubmitSuccessEventParameters = {
    response: Response;
};

export type DialogForm$SubmitSuccessEvent = Event<DialogForm$SubmitSuccessEventParameters, DialogForm>;

export type DialogForm$SubmitErrorEventParameters = {
    response: Response;
};

export type DialogForm$SubmitErrorEvent = Event<DialogForm$SubmitErrorEventParameters, DialogForm>;

declare module "ui5/genatrix/control/v2/form/DialogForm" {
    export default interface DialogForm<ContextDataT extends Record<string, any> = Record<string, any>> {
        getEntitySet: OptionalPropertyGetter<string>;
        setEntitySet: OptionalPropertySetter<string, DialogForm>;

        getFormMode: OptionalPropertyGetter<FormModeType>;
        setFormMode: OptionalPropertySetter<FormModeType, DialogForm>;

        getInitialData: OptionalPropertyGetter<ContextDataT>;
        setInitialData: OptionalPropertySetter<ContextDataT, DialogForm>;

        getButtonText: OptionalPropertyGetter<string>;

        getButtonIcon: OptionalPropertyGetter<URI>;

        getButtonType: OptionalPropertyGetter<ButtonType>;

        getDialogTitle: OptionalPropertyGetter<string>;
        setDialogTitle: OptionalPropertySetter<string, DialogForm>;

        getDialogTitleAlignment: OptionalPropertyGetter<TitleAlignment>;
        setDialogTitleAlignment: OptionalPropertySetter<TitleAlignment, DialogForm>;

        getDialogWidth: OptionalPropertyGetter<string>;
        setDialogWidth: OptionalPropertySetter<string, DialogForm>;

        getDialogResizable: OptionalPropertyGetter<boolean>;
        setDialogResizable: OptionalPropertySetter<boolean, DialogForm>;

        getDialogDraggable: OptionalPropertyGetter<boolean>;
        setDialogDraggable: OptionalPropertySetter<boolean, DialogForm>;

        getSubmitButtonText: OptionalPropertyGetter<string>;
        setSubmitButtonText: OptionalPropertySetter<string, DialogForm>;

        getSubmitButtonIcon: OptionalPropertyGetter<URI>;
        setSubmitButtonIcon: OptionalPropertySetter<URI, DialogForm>;

        getSubmitButtonType: OptionalPropertyGetter<ButtonType>;
        setSubmitButtonType: OptionalPropertySetter<ButtonType, DialogForm>;

        getCloseButtonText: OptionalPropertyGetter<string>;
        setCloseButtonText: OptionalPropertySetter<string, DialogForm>;

        getCloseButtonIcon: OptionalPropertyGetter<URI>;
        setCloseButtonIcon: OptionalPropertySetter<URI, DialogForm>;

        getCloseButtonType: OptionalPropertyGetter<ButtonType>;
        setCloseButtonType: OptionalPropertySetter<ButtonType, DialogForm>;

        getDatePattern: OptionalPropertyGetter<string>;
        setDatePattern: OptionalPropertySetter<string, DialogForm>;

        getTimePattern: OptionalPropertyGetter<string>;
        setTimePattern: OptionalPropertySetter<string, DialogForm>;

        getDateTimeSeparator: OptionalPropertyGetter<string>;
        setDateTimeSeparator: OptionalPropertySetter<string, DialogForm>;

        getDateFirst: OptionalPropertyGetter<boolean>;
        setDateFirst: OptionalPropertySetter<boolean, DialogForm>;

        getGroupingEnabled: OptionalPropertyGetter<boolean>;
        setGroupingEnabled: OptionalPropertySetter<boolean, DialogForm>;

        getGroupingSeparator: OptionalPropertyGetter<string>;
        setGroupingSeparator: OptionalPropertySetter<string, DialogForm>;

        getGroupingSize: OptionalPropertyGetter<number>;
        setGroupingSize: OptionalPropertySetter<number, DialogForm>;

        getDecimalSeparator: OptionalPropertyGetter<string>;
        setDecimalSeparator: OptionalPropertySetter<string, DialogForm>;

        getParseEmptyValueToZero: OptionalPropertyGetter<boolean>;
        setParseEmptyValueToZero: OptionalPropertySetter<boolean, DialogForm>;

        getCloseDialogOnSuccess: OptionalPropertyGetter<boolean>;
        setCloseDialogOnSuccess: OptionalPropertySetter<boolean, DialogForm>;

        getShowSubmitError: OptionalPropertyGetter<boolean>;
        setShowSubmitError: OptionalPropertySetter<boolean, DialogForm>;

        getSubmitErrorFallbackMessage: OptionalPropertyGetter<string>;
        setSubmitErrorFallbackMessage: OptionalPropertySetter<string, DialogForm>;

        getShowBusyOnSubmit: OptionalPropertyGetter<boolean>;
        setShowBusyOnSubmit: OptionalPropertySetter<boolean, DialogForm>;

        getRequiredProperties: OptionalPropertyGetter<string>;
        setRequiredProperties: OptionalPropertySetter<string, DialogForm>;

        getReadonlyProperties: OptionalPropertyGetter<string>;
        setReadonlyProperties: OptionalPropertySetter<string, DialogForm>;

        getExcludedProperties: OptionalPropertyGetter<string>;
        setExcludedProperties: OptionalPropertySetter<string, DialogForm>;

        getKeysAlwaysIncluded: OptionalPropertyGetter<boolean>;
        setKeysAlwaysIncluded: OptionalPropertySetter<boolean, DialogForm>;

        getFormValidationErrorMessage: OptionalPropertyGetter<string>;
        setFormValidationErrorMessage: OptionalPropertySetter<string, DialogForm>;

        getSelectRowErrorMessage: OptionalPropertyGetter<string>;
        setSelectRowErrorMessage: OptionalPropertySetter<string, DialogForm>;

        getContextRef: OptionalPropertyGetter<ContextRef<ContextDataT>>;
        setContextRef: OptionalPropertySetter<ContextRef<ContextDataT>, DialogForm>;

        getODataModelName: OptionalPropertyGetter<string>;
        setODataModelName: OptionalPropertySetter<string, DialogForm>;

        getContextProvider: OptionalPropertyGetter<ContextProvider>;
        setContextProvider: OptionalPropertySetter<ContextProvider, DialogForm>;

        getBeforeSubmit: OptionalPropertyGetter<BeforeSubmit>;
        setBeforeSubmit: OptionalPropertySetter<BeforeSubmit, DialogForm>;

        getPropertyOptions: AggregationGetterMulti<PropertyOption>;
        addPropertyOption: AggregationSetterOrAdder<PropertyOption, DialogForm>;
        insertPropertyOption: AggregationInserter<PropertyOption, DialogForm>;
        bindPropertyOptions: AggregationBinder<DialogForm>;
        removePropertyOption: AggregationRemoverSingle<PropertyOption>;
        removeAllPropertyOptions: AggregationRemoverAll<PropertyOption>;
        destroyPropertyOptions: AggregationDestroyer<DialogForm>;

        getFormGroups: AggregationGetterMulti<FormGroup>;
        addFormGroup: AggregationSetterOrAdder<FormGroup, DialogForm>;
        insertFormGroup: AggregationInserter<FormGroup, DialogForm>;
        bindFormGroups: AggregationBinder<DialogForm>;
        removeFormGroup: AggregationRemoverSingle<FormGroup>;
        removeAllFormGroups: AggregationRemoverAll<FormGroup>;
        destroyFormGroups: AggregationDestroyer<DialogForm>;

        getValidationLogics: AggregationGetterMulti<ValidationLogic>;
        addValidationLogic: AggregationSetterOrAdder<ValidationLogic, DialogForm>;
        insertValidationLogic: AggregationInserter<ValidationLogic, DialogForm>;
        bindValidationLogics: AggregationBinder<DialogForm>;
        removeValidationLogic: AggregationRemoverSingle<ValidationLogic>;
        removeAllValidationLogics: AggregationRemoverAll<ValidationLogic>;
        destroyValidationLogics: AggregationDestroyer<DialogForm>;

        getFormLayout: AggregationGetterSingle<FormLayout>;
        setFormLayout: AggregationSetterOrAdder<FormLayout, DialogForm>;

        attachFormValidationError(handler: (event: DialogForm$FormValidationErrorEvent) => void, listener?: object): DialogForm;
        attachFormValidationError(data: object, handler: (event: DialogForm$FormValidationErrorEvent) => void, listener?: object): DialogForm;
        fireFormValidationError: (parameters?: DialogForm$FormValidationErrorEventParameters) => DialogForm;

        attachSubmitSuccess(handler: (event: DialogForm$SubmitSuccessEvent) => void, listener?: object): DialogForm;
        attachSubmitSuccess(data: object, handler: (event: DialogForm$SubmitSuccessEvent) => void, listener?: object): DialogForm;
        fireSubmitSuccess: (parameters?: DialogForm$SubmitSuccessEventParameters) => DialogForm;

        attachSubmitError(handler: (event: DialogForm$SubmitErrorEvent) => void, listener?: object): DialogForm;
        attachSubmitError(data: object, handler: (event: DialogForm$SubmitErrorEvent) => void, listener?: object): DialogForm;
        fireSubmitError: (parameters?: DialogForm$SubmitErrorEventParameters) => DialogForm;
    }
}