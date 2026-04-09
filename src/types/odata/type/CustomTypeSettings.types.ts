import Validator from "ui5/genatrix/interface/metadata/form/Validator";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

type CustomTypeBase = {
    property: EntityProperty;
    validationLogic?: Validator;
};

export type CustomStringSettings = CustomTypeBase;

type NumberConstraints = {
    precision?: number;
    scale?: number;
    nullable?: string | boolean;
};

type NumberFormatOptions = {
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

type DateTimeConstraints = {
    displayFormat: "Date";
};

type DateTimeFormatOptions = {
    pattern: string;
};

export type CustomDateTimeSettings = CustomTypeBase & {
    constraints?: DateTimeConstraints;
    formatOptions?: DateTimeFormatOptions;
};