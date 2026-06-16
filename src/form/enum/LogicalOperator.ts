import DataType from "sap/ui/base/DataType";

export enum LogicalOperator {
    And = "And",
    Or = "Or"
};

DataType.registerEnum("ui5.genatrix.form.enum.LogicalOperator", LogicalOperator);