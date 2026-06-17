import DataType from "sap/ui/base/DataType";

export enum PropertyConstraintType {
    Required = "Required",
    Visible = "Visible"
};

DataType.registerEnum("ui5.genatrix.form.enum.PropertyConstraintType", PropertyConstraintType);