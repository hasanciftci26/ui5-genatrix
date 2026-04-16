import PropertyOption from "ui5/genatrix/metadata/form/PropertyOption";
import ValidationLogic from "ui5/genatrix/metadata/form/ValidationLogic";

export type ControlGeneratorSettings = {
    controlId: string;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator: string;
    dateFirst: boolean;
    groupingEnabled: boolean;
    groupingSeparator?: string;
    groupingSize: number;
    decimalSeparator?: string;
    parseEmptyValueToZero: boolean;
    propertyOptions: PropertyOption[];
    validationLogics: ValidationLogic[];
};