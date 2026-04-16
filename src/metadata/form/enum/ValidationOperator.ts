import DataType from "sap/ui/base/DataType";

const ValidationOperator = {
    EQ: "EQ",
    NE: "NE",
    In: "In",
    NotIn: "NotIn",
    IsEmpty: "IsEmpty",
    LE: "LE",
    LT: "LT",
    GE: "GE",
    GT: "GT",
    BT: "BT",
    NB: "NB",
    Contains: "Contains",
    NotContains: "NotContains",
    StartsWith: "StartsWith",
    NotStartsWith: "NotStartsWith",
    EndsWith: "EndsWith",
    NotEndsWith: "NotEndsWith",
    RegExp: "RegExp"
} as const;

DataType.registerEnum("ui5.genatrix.metadata.form.enum.ValidationOperator", ValidationOperator);

export default ValidationOperator;