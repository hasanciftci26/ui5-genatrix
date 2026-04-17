import DataType from "sap/ui/base/DataType";

const ValueListParameterType = {
    In: "In",
    InOut: "InOut",
    Out: "Out",
    DisplayOnly: "DisplayOnly",
    FilterOnly: "FilterOnly"
} as const;

DataType.registerEnum("ui5.genatrix.metadata.form.enum.ValueListParameterType", ValueListParameterType);

export default ValueListParameterType;