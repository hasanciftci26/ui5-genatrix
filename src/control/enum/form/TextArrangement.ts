import DataType from "sap/ui/base/DataType";

const TextArrangement = {
    TextFirst: "TextFirst",
    TextLast: "TextLast",
    TextOnly: "TextOnly",
    TextSeparate: "TextSeparate"
} as const;

DataType.registerEnum("ui5.genatrix.control.enum.form.TextArrangement", TextArrangement);

export default TextArrangement;