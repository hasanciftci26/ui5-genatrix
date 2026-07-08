import DataType from "sap/ui/base/DataType";

export enum ParameterType {
    In = "In",
    InOut = "InOut",
    Out = "Out",
    DisplayOnly = "DisplayOnly",
    FilterOnly = "FilterOnly"
};

DataType.registerEnum("ui5.genatrix.form.enum.ParameterType", ParameterType);