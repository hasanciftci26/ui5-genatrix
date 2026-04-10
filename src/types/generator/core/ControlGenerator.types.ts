import Validator from "ui5/genatrix/interface/metadata/form/Validator";
import PropertyOption from "ui5/genatrix/metadata/form/PropertyOption";

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
    validationLogics: Validator[];
};