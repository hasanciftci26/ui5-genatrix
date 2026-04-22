import DataType from "sap/ui/base/DataType";

const FilterRestriction = {
    SingleValue: "SingleValue",
    MultiValue: "MultiValue"
} as const;

DataType.registerEnum("ui5.genatrix.metadata.enum.valuelist.FilterRestriction", FilterRestriction);

export default FilterRestriction;