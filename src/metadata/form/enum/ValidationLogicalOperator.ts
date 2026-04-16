import DataType from "sap/ui/base/DataType";

const ValidationLogicalOperator = {
    And: "And",
    Or: "Or"
} as const;

DataType.registerEnum("ui5.genatrix.metadata.form.enum.ValidationLogicalOperator", ValidationLogicalOperator);

export default ValidationLogicalOperator;