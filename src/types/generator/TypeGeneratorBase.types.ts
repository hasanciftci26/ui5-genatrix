import PropertyConfigurationBase from "ui5/genatrix/interface/PropertyConfigurationBase";

export type TypeGeneratorBaseSettings = {
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator: string;
    dateFirst: boolean;
    groupingEnabled: boolean;
    groupingSeparator?: string;
    groupingSize: number;
    decimalSeparator?: string;
    parseEmptyValueToZero: boolean;
    propertyConfigurations: PropertyConfigurationBase[];
};