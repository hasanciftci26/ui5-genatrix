import { $ControlSettings } from "sap/ui/core/Control";
import { form } from "sap/ui/layout/library";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/CustomClass.types";

type SimpleFormLayoutType = form.SimpleFormLayout | keyof typeof form.SimpleFormLayout;

export type EmbeddedFormSettings = $ControlSettings & {
    entitySet?: string;
    oDataModelName?: string;
    layout?: SimpleFormLayoutType;
    columnsXL?: number;
    columnsL?: number;
    columnsM?: number;
    labelSpanXL?: number;
    labelSpanL?: number;
    labelSpanM?: number;
    labelSpanS?: number;
    emptySpanXL?: number;
    emptySpanL?: number;
    emptySpanM?: number;
    emptySpanS?: number;
};

declare module "ui5/genatrix/form/v2/EmbeddedForm" {
    export default interface EmbeddedForm {
        getEntitySet: OptionalPropertyGetter<string>;

        getODataModelName: OptionalPropertyGetter<string>;
        setODataModelName: OptionalPropertySetter<string, EmbeddedForm>;

        getLayout: OptionalPropertyGetter<SimpleFormLayoutType>;
        setLayout: OptionalPropertySetter<SimpleFormLayoutType, EmbeddedForm>;

        getColumnsXL: OptionalPropertyGetter<number>;
        setColumnsXL: OptionalPropertySetter<number, EmbeddedForm>;

        getColumnsL: OptionalPropertyGetter<number>;
        setColumnsL: OptionalPropertySetter<number, EmbeddedForm>;

        getColumnsM: OptionalPropertyGetter<number>;
        setColumnsM: OptionalPropertySetter<number, EmbeddedForm>;

        getLabelSpanXL: OptionalPropertyGetter<number>;
        setLabelSpanXL: OptionalPropertySetter<number, EmbeddedForm>;

        getLabelSpanL: OptionalPropertyGetter<number>;
        setLabelSpanL: OptionalPropertySetter<number, EmbeddedForm>;

        getLabelSpanM: OptionalPropertyGetter<number>;
        setLabelSpanM: OptionalPropertySetter<number, EmbeddedForm>;

        getLabelSpanS: OptionalPropertyGetter<number>;
        setLabelSpanS: OptionalPropertySetter<number, EmbeddedForm>;

        getEmptySpanXL: OptionalPropertyGetter<number>;
        setEmptySpanXL: OptionalPropertySetter<number, EmbeddedForm>;

        getEmptySpanL: OptionalPropertyGetter<number>;
        setEmptySpanL: OptionalPropertySetter<number, EmbeddedForm>;

        getEmptySpanM: OptionalPropertyGetter<number>;
        setEmptySpanM: OptionalPropertySetter<number, EmbeddedForm>;
        
        getEmptySpanS: OptionalPropertyGetter<number>;
        setEmptySpanS: OptionalPropertySetter<number, EmbeddedForm>;
    }
}