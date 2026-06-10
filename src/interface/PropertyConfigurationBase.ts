export default interface PropertyConfigurationBase {
    getName: () => string | undefined;
    getLabel: () => string | undefined;
    getRequiredMessage: () => string | undefined;
    getDatePattern: () => string | undefined;
    getTimePattern: () => string | undefined;
    getDateTimeSeparator: () => string;
    getDateFirst: () => boolean;
    getGroupingEnabled: () => boolean;
    getGroupingSeparator: () => string | undefined;
    getGroupingSize: () => number;
    getDecimalSeparator: () => string | undefined;
    getParseEmptyValueToZero: () => boolean;
    getMaximumValue: () => string | undefined;
    getMinimumValue: () => string | undefined;
}