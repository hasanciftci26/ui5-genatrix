import DataType from "sap/ui/base/DataType";

const FilterExpressionRestriction = {
    SingleValue: "SingleValue",
    MultiValue: "MultiValue"
} as const;

DataType.registerEnum("ui5.genatrix.metadata.enum.valuelist.FilterExpressionRestriction", FilterExpressionRestriction);

export default FilterExpressionRestriction;