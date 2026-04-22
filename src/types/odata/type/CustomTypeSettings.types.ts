import JSONModel from "sap/ui/model/json/JSONModel";
import PropertyOption from "ui5/genatrix/metadata/form/PropertyOption";
import ValidationLogic from "ui5/genatrix/metadata/form/ValidationLogic";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

type CustomTypeBase = {
    property: EntityProperty;
    busyModel: JSONModel;
    propertyOptions?: PropertyOption;
    validationLogic?: ValidationLogic;
};

export type CustomStringSettings = CustomTypeBase;

export type NumberConstraints = {
    precision?: number;
    scale?: number;
    nullable?: string | boolean;
    minimum?: string;
    maximum?: string;
};

export type NumberFormatOptions = {
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
    parseEmptyValueToZero?: boolean
};

export type CustomNumberSettings = CustomTypeBase & {
    constraints?: NumberConstraints;
    formatOptions?: NumberFormatOptions;
};

export type DateTimeConstraints = {
    displayFormat: "Date";
};

export type DateTimeFormatOptions = {
    pattern: string;
};

export type CustomDateTimeSettings = CustomTypeBase & {
    constraints?: DateTimeConstraints;
    formatOptions?: DateTimeFormatOptions;
};

export type CustomFilterBarFieldSettings = {
    property: EntityProperty;
    groupingEnabled: boolean;
    groupingSeparator?: string;
    groupingSize: number;
    decimalSeparator?: string;
    parseEmptyValueToZero: boolean;    
};

export type CustomFilterBarFieldOperator =
    "EQ" |
    "NE" |
    "GE" |
    "NOT_GE" |
    "GT" |
    "NOT_GT" |
    "LE" |
    "NOT_LE" |
    "LT" |
    "NOT_LT" |
    "BT" |
    "NOT_BT" |
    "CONTAINS" |
    "NOT_CONTAINS" |
    "STARTS_WITH" |
    "NOT_STARTS_WITH" |
    "ENDS_WITH" |
    "NOT_ENDS_WITH";