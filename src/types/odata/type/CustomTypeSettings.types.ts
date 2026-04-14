import Validator from "ui5/genatrix/interface/metadata/form/Validator";
import PropertyOption from "ui5/genatrix/metadata/form/PropertyOption";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

type CustomTypeBase = {
    property: EntityProperty;
    propertyOptions?: PropertyOption;
    validationLogic?: Validator;
};

export type CustomStringSettings = CustomTypeBase;

export type NumberConstraints = {
    precision?: number;
    scale?: number;
    nullable?: string | boolean;
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