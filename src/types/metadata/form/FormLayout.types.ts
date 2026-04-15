import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import LayoutData from "sap/ui/core/LayoutData";
import Layout from "ui5/genatrix/control/enum/form/Layout";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";

export type LayoutType = typeof Layout[keyof typeof Layout];

export type FormLayoutSettings = $ManagedObjectSettings & {
    layout?: LayoutType;
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
    layoutData?: LayoutData;
};

declare module "ui5/genatrix/metadata/form/FormLayout" {
    export default interface FormLayout {
        getLayout: OptionalPropertyGetter<LayoutType>;
        setLayout: OptionalPropertySetter<LayoutType, FormLayout>;
        getColumnsXL: OptionalPropertyGetter<number>;
        setColumnsXL: OptionalPropertySetter<number, FormLayout>;
        getColumnsL: OptionalPropertyGetter<number>;
        setColumnsL: OptionalPropertySetter<number, FormLayout>;
        getColumnsM: OptionalPropertyGetter<number>;
        setColumnsM: OptionalPropertySetter<number, FormLayout>;
        getLabelSpanXL: OptionalPropertyGetter<number>;
        setLabelSpanXL: OptionalPropertySetter<number, FormLayout>;
        getLabelSpanL: OptionalPropertyGetter<number>;
        setLabelSpanL: OptionalPropertySetter<number, FormLayout>;
        getLabelSpanM: OptionalPropertyGetter<number>;
        setLabelSpanM: OptionalPropertySetter<number, FormLayout>;
        getLabelSpanS: OptionalPropertyGetter<number>;
        setLabelSpanS: OptionalPropertySetter<number, FormLayout>;
        getEmptySpanXL: OptionalPropertyGetter<number>;
        setEmptySpanXL: OptionalPropertySetter<number, FormLayout>;
        getEmptySpanL: OptionalPropertyGetter<number>;
        setEmptySpanL: OptionalPropertySetter<number, FormLayout>;
        getEmptySpanM: OptionalPropertyGetter<number>;
        setEmptySpanM: OptionalPropertySetter<number, FormLayout>;
        getEmptySpanS: OptionalPropertyGetter<number>;
        setEmptySpanS: OptionalPropertySetter<number, FormLayout>;
        getLayoutData: OptionalPropertyGetter<LayoutData>;
        setLayoutData: OptionalPropertySetter<LayoutData, FormLayout>;
    }
}