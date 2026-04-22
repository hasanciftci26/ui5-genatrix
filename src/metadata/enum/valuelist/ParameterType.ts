import DataType from "sap/ui/base/DataType";

const ParameterType = {
    In: "In",
    InOut: "InOut",
    Out: "Out",
    DisplayOnly: "DisplayOnly",
    FilterOnly: "FilterOnly"
} as const;

DataType.registerEnum("ui5.genatrix.metadata.enum.valuelist.ParameterType", ParameterType);

export default ParameterType;