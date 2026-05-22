import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";
import { form } from "sap/ui/layout/library";
import Context from "sap/ui/model/odata/v2/Context";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import { OptionalPropertyGetter, OptionalPropertySetter, PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/CustomClass.types";

export type EmbeddedFormSettings<T extends Record<string, any>> = $ControlSettings & {
    entitySet?: string | PropertyBindingInfo | `{${string}}`;
    oDataModelName?: string | PropertyBindingInfo | `{${string}}`;
    formMode?: FormMode | keyof typeof FormMode | PropertyBindingInfo | `{${string}}`;
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
    initialData?: T;
    contextProvider?: () => Promise<Context> | Context;
    contextRef?: string | T | Context;
    rowSelectionErrorMessage?: string;
};

declare module "ui5/genatrix/form/v2/EmbeddedForm" {
    export default interface EmbeddedForm<T extends Record<string, any> = Record<string, any>> {
        getEntitySet: OptionalPropertyGetter<string>;

        getODataModelName: OptionalPropertyGetter<string>;
        setODataModelName: OptionalPropertySetter<string, EmbeddedForm>;

        getFormMode: PropertyGetter<FormMode | keyof typeof FormMode>;
        setFormMode: PropertySetter<FormMode | keyof typeof FormMode, EmbeddedForm>;

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

        getInitialData: OptionalPropertyGetter<T>;
        setInitialData: OptionalPropertySetter<T, EmbeddedForm>;

        getContextProvider: OptionalPropertyGetter<() => Promise<Context> | Context>;
        setContextProvider: OptionalPropertySetter<() => Promise<Context> | Context, EmbeddedForm>;

        getContextRef: OptionalPropertyGetter<string | T | Context>;
        setContextRef: OptionalPropertySetter<string | T | Context, EmbeddedForm>;

        getRowSelectionErrorMessage: PropertyGetter<string>;
        setRowSelectionErrorMessage: PropertySetter<string, EmbeddedForm>;
    }
}