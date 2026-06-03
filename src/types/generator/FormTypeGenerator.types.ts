import PropertyConfiguration from "ui5/genatrix/form/PropertyConfiguration";
import PropertyValidation from "ui5/genatrix/form/PropertyValidation";

export type FormTypeGeneratorSettings = {
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator: string;
    dateFirst: boolean;
    groupingEnabled: boolean;
    groupingSeparator?: string;
    groupingSize: number;
    decimalSeparator?: string;
    parseEmptyValueToZero: boolean;
    propertyConfigurations: PropertyConfiguration[];
    propertyValidations: PropertyValidation[];    
};