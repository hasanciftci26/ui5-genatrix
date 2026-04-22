import DataType from "sap/ui/base/DataType";

const LogicalOperator = {
    And: "And",
    Or: "Or"
} as const;

DataType.registerEnum("ui5.genatrix.metadata.enum.validationlogic.LogicalOperator", LogicalOperator);

export default LogicalOperator;