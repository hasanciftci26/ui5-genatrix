import DataType from "sap/ui/base/DataType";

// TODO
enum LogicalOperator {
    And = "And",
    Or = "Or"
};

DataType.registerEnum("ui5.genatrix.form.enum.LogicalOperator", LogicalOperator);

export default LogicalOperator;