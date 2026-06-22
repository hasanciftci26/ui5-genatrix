import DataType from "sap/ui/base/DataType";

export enum TextArrangement {
    TextFirst = "TextFirst",
    TextLast = "TextLast",
    TextOnly = "TextOnly",
    TextSeparate = "TextSeparate"
};

DataType.registerEnum("ui5.genatrix.core.enum.TextArrangement", TextArrangement);