import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";
import { form } from "sap/ui/layout/library";
import Context from "sap/ui/model/Context";
import EmbeddedForm from "ui5/genatrix/form/EmbeddedForm";
import { FormMode } from "ui5/genatrix/form/enum/FormMode";
import FormGroup from "ui5/genatrix/form/FormGroup";
import PropertyConfiguration from "ui5/genatrix/form/PropertyConfiguration";
import PropertyConstraint from "ui5/genatrix/form/PropertyConstraint";
import PropertyValidation from "ui5/genatrix/form/PropertyValidation";
import {
    AggregationBinder,
    AggregationDestroyer,
    AggregationGetterMulti,
    AggregationInserter,
    AggregationRemoverAll,
    AggregationRemoverSingle,
    AggregationSetterOrAdder,
    OptionalPropertyGetter,
    OptionalPropertySetter,
    PropertyGetter,
    PropertySetter
} from "ui5/genatrix/types/global/CustomClass.types";

export type EmbeddedForm$InitializedEventParameters = {};
export type EmbeddedForm$InitializedEvent = Event<EmbeddedForm$InitializedEventParameters, EmbeddedForm>;

export type EmbeddedForm$ContextCreatedEventParameters = {
    context: Context;
};

export type EmbeddedForm$ContextCreatedEvent = Event<EmbeddedForm$ContextCreatedEventParameters, EmbeddedForm>;

export type EmbeddedForm$ModeChangedEventParameters = {
    editable: boolean;
};

export type EmbeddedForm$ModeChangedEvent = Event<EmbeddedForm$ModeChangedEventParameters, EmbeddedForm>;

export type EmbeddedFormSettings<T extends Record<string, any>> = $ControlSettings & {
    entitySet?: string | PropertyBindingInfo | `{${string}}`;
    oDataModelName?: string | PropertyBindingInfo | `{${string}}`;
    updateGroupId?: string | PropertyBindingInfo | `{${string}}`;
    formMode?: FormMode | keyof typeof FormMode | PropertyBindingInfo | `{${string}}`;
    title?: string | PropertyBindingInfo | `{${string}}`;
    editable?: boolean | PropertyBindingInfo | `{${string}}`;
    editTogglable?: boolean | PropertyBindingInfo | `{${string}}`;
    layout?: form.SimpleFormLayout | keyof typeof form.SimpleFormLayout | PropertyBindingInfo | `{${string}}`;
    columnsXL?: number | PropertyBindingInfo | `{${string}}`;
    columnsL?: number | PropertyBindingInfo | `{${string}}`;
    columnsM?: number | PropertyBindingInfo | `{${string}}`;
    labelSpanXL?: number | PropertyBindingInfo | `{${string}}`;
    labelSpanL?: number | PropertyBindingInfo | `{${string}}`;
    labelSpanM?: number | PropertyBindingInfo | `{${string}}`;
    labelSpanS?: number | PropertyBindingInfo | `{${string}}`;
    emptySpanXL?: number | PropertyBindingInfo | `{${string}}`;
    emptySpanL?: number | PropertyBindingInfo | `{${string}}`;
    emptySpanM?: number | PropertyBindingInfo | `{${string}}`;
    emptySpanS?: number | PropertyBindingInfo | `{${string}}`;
    datePattern?: string | PropertyBindingInfo | `{${string}}`;
    timePattern?: string | PropertyBindingInfo | `{${string}}`;
    dateTimeSeparator?: string | PropertyBindingInfo | `{${string}}`;
    dateFirst?: boolean | PropertyBindingInfo | `{${string}}`;
    groupingEnabled?: boolean | PropertyBindingInfo | `{${string}}`;
    groupingSeparator?: string | PropertyBindingInfo | `{${string}}`;
    groupingSize?: number | PropertyBindingInfo | `{${string}}`;
    decimalSeparator?: string | PropertyBindingInfo | `{${string}}`;
    parseEmptyValueToZero?: boolean | PropertyBindingInfo | `{${string}}`;
    requiredProperties?: string | PropertyBindingInfo | `{${string}}`;
    readonlyProperties?: string | PropertyBindingInfo | `{${string}}`;
    excludedProperties?: string | PropertyBindingInfo | `{${string}}`;
    displayOrder?: string | PropertyBindingInfo | `{${string}}`;
    initialData?: T;
    contextProvider?: () => Promise<Context> | Context;
    contextRef?: T | Context;
    bindContextToForm?: boolean | PropertyBindingInfo | `{${string}}`;
    propertyConfigurations?: PropertyConfiguration[];
    propertyValidations?: PropertyValidation[];
    propertyConstraints?: PropertyConstraint[];
    formGroups?: FormGroup[];
    initialized?: (event: EmbeddedForm$InitializedEvent) => void;
    contextCreated?: (event: EmbeddedForm$ContextCreatedEvent) => void;
    modeChanged?: (event: EmbeddedForm$ModeChangedEvent) => void;
};

declare module "ui5/genatrix/form/EmbeddedForm" {
    export default interface EmbeddedForm<T extends Record<string, any> = Record<string, any>> {
        getEntitySet: OptionalPropertyGetter<string>;

        getODataModelName: OptionalPropertyGetter<string>;
        setODataModelName: OptionalPropertySetter<string, EmbeddedForm>;

        getUpdateGroupId: PropertyGetter<string>;

        getFormMode: PropertyGetter<FormMode | keyof typeof FormMode>;

        getTitle: OptionalPropertyGetter<string>;

        getEditable: PropertyGetter<boolean>;

        getEditTogglable: PropertyGetter<boolean>;

        getLayout: PropertyGetter<form.SimpleFormLayout | keyof typeof form.SimpleFormLayout>;
        setLayout: PropertySetter<form.SimpleFormLayout | keyof typeof form.SimpleFormLayout, EmbeddedForm>;

        getColumnsXL: PropertyGetter<number>;
        setColumnsXL: PropertySetter<number, EmbeddedForm>;

        getColumnsL: PropertyGetter<number>;
        setColumnsL: PropertySetter<number, EmbeddedForm>;

        getColumnsM: PropertyGetter<number>;
        setColumnsM: PropertySetter<number, EmbeddedForm>;

        getLabelSpanXL: PropertyGetter<number>;
        setLabelSpanXL: PropertySetter<number, EmbeddedForm>;

        getLabelSpanL: PropertyGetter<number>;
        setLabelSpanL: PropertySetter<number, EmbeddedForm>;

        getLabelSpanM: PropertyGetter<number>;
        setLabelSpanM: PropertySetter<number, EmbeddedForm>;

        getLabelSpanS: PropertyGetter<number>;
        setLabelSpanS: PropertySetter<number, EmbeddedForm>;

        getEmptySpanXL: PropertyGetter<number>;
        setEmptySpanXL: PropertySetter<number, EmbeddedForm>;

        getEmptySpanL: PropertyGetter<number>;
        setEmptySpanL: PropertySetter<number, EmbeddedForm>;

        getEmptySpanM: PropertyGetter<number>;
        setEmptySpanM: PropertySetter<number, EmbeddedForm>;

        getEmptySpanS: PropertyGetter<number>;
        setEmptySpanS: PropertySetter<number, EmbeddedForm>;

        getDatePattern: OptionalPropertyGetter<string>;
        setDatePattern: OptionalPropertySetter<string, EmbeddedForm>;

        getTimePattern: OptionalPropertyGetter<string>;
        setTimePattern: OptionalPropertySetter<string, EmbeddedForm>;

        getDateTimeSeparator: PropertyGetter<string>;
        setDateTimeSeparator: PropertySetter<string, EmbeddedForm>;

        getDateFirst: PropertyGetter<boolean>;
        setDateFirst: PropertySetter<boolean, EmbeddedForm>;

        getGroupingEnabled: PropertyGetter<boolean>;
        setGroupingEnabled: PropertySetter<boolean, EmbeddedForm>;

        getGroupingSeparator: OptionalPropertyGetter<string>;
        setGroupingSeparator: OptionalPropertySetter<string, EmbeddedForm>;

        getGroupingSize: PropertyGetter<number>;
        setGroupingSize: PropertySetter<number, EmbeddedForm>;

        getDecimalSeparator: OptionalPropertyGetter<string>;
        setDecimalSeparator: OptionalPropertySetter<string, EmbeddedForm>;

        getParseEmptyValueToZero: PropertyGetter<boolean>;
        setParseEmptyValueToZero: PropertySetter<boolean, EmbeddedForm>;

        getRequiredProperties: OptionalPropertyGetter<string>;
        setRequiredProperties: OptionalPropertySetter<string, EmbeddedForm>;

        getReadonlyProperties: OptionalPropertyGetter<string>;
        setReadonlyProperties: OptionalPropertySetter<string, EmbeddedForm>;

        getExcludedProperties: OptionalPropertyGetter<string>;
        setExcludedProperties: OptionalPropertySetter<string, EmbeddedForm>;

        getDisplayOrder: OptionalPropertyGetter<string>;
        setDisplayOrder: OptionalPropertySetter<string, EmbeddedForm>;

        getInitialData: OptionalPropertyGetter<T>;
        setInitialData: OptionalPropertySetter<T, EmbeddedForm>;

        getContextProvider: OptionalPropertyGetter<() => Promise<Context> | Context>;
        setContextProvider: OptionalPropertySetter<() => Promise<Context> | Context, EmbeddedForm>;

        getContextRef: OptionalPropertyGetter<T | Context>;
        setContextRef: OptionalPropertySetter<T | Context, EmbeddedForm>;

        getBindContextToForm: PropertyGetter<boolean>;
        setBindContextToForm: PropertySetter<boolean, EmbeddedForm>;

        getPropertyConfigurations: AggregationGetterMulti<PropertyConfiguration>;
        addPropertyConfiguration: AggregationSetterOrAdder<PropertyConfiguration, EmbeddedForm>;
        insertPropertyConfiguration: AggregationInserter<PropertyConfiguration, EmbeddedForm>;
        bindPropertyConfigurations: AggregationBinder<EmbeddedForm>;
        removePropertyConfiguration: AggregationRemoverSingle<PropertyConfiguration>;
        removeAllPropertyConfigurations: AggregationRemoverAll<PropertyConfiguration>;
        destroyPropertyConfigurations: AggregationDestroyer<EmbeddedForm>;

        getPropertyValidations: AggregationGetterMulti<PropertyValidation>;
        addPropertyValidation: AggregationSetterOrAdder<PropertyValidation, EmbeddedForm>;
        insertPropertyValidation: AggregationInserter<PropertyValidation, EmbeddedForm>;
        bindPropertyValidations: AggregationBinder<EmbeddedForm>;
        removePropertyValidation: AggregationRemoverSingle<PropertyValidation>;
        removeAllPropertyValidations: AggregationRemoverAll<PropertyValidation>;
        destroyPropertyValidations: AggregationDestroyer<EmbeddedForm>;

        getPropertyConstraints: AggregationGetterMulti<PropertyConstraint>;
        addPropertyConstraint: AggregationSetterOrAdder<PropertyConstraint, EmbeddedForm>;
        insertPropertyConstraint: AggregationInserter<PropertyConstraint, EmbeddedForm>;
        bindPropertyConstraints: AggregationBinder<EmbeddedForm>;
        removePropertyConstraint: AggregationRemoverSingle<PropertyConstraint>;
        removeAllPropertyConstraints: AggregationRemoverAll<PropertyConstraint>;
        destroyPropertyConstraints: AggregationDestroyer<EmbeddedForm>;

        getFormGroups: AggregationGetterMulti<FormGroup>;
        addFormGroup: AggregationSetterOrAdder<FormGroup, EmbeddedForm>;
        insertFormGroup: AggregationInserter<FormGroup, EmbeddedForm>;
        bindFormGroups: AggregationBinder<EmbeddedForm>;
        removeFormGroup: AggregationRemoverSingle<FormGroup>;
        removeAllFormGroups: AggregationRemoverAll<FormGroup>;
        destroyFormGroups: AggregationDestroyer<EmbeddedForm>;

        attachInitialized(handler: (event: EmbeddedForm$InitializedEvent) => void, listener?: object): EmbeddedForm;
        attachInitialized(data: object, handler: (event: EmbeddedForm$InitializedEvent) => void, listener?: object): EmbeddedForm;
        fireInitialized: (parameters?: EmbeddedForm$InitializedEventParameters) => EmbeddedForm;

        attachContextCreated(handler: (event: EmbeddedForm$ContextCreatedEvent) => void, listener?: object): EmbeddedForm;
        attachContextCreated(data: object, handler: (event: EmbeddedForm$ContextCreatedEvent) => void, listener?: object): EmbeddedForm;
        fireContextCreated: (parameters?: EmbeddedForm$ContextCreatedEventParameters) => EmbeddedForm;

        attachModeChanged(handler: (event: EmbeddedForm$ModeChangedEvent) => void, listener?: object): EmbeddedForm;
        attachModeChanged(data: object, handler: (event: EmbeddedForm$ModeChangedEvent) => void, listener?: object): EmbeddedForm;
        fireModeChanged: (parameters?: EmbeddedForm$ModeChangedEventParameters) => EmbeddedForm;
    }
}