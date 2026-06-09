import BaseObject from "sap/ui/base/Object";
import SimpleType from "sap/ui/model/SimpleType";
import { ODataDateTimeConstraints, ODataNumberConstraints, ODataNumberFormatOptions } from "ui5/genatrix/types/extension/type/GlobalOData.types";
import { TypeGeneratorBaseSettings } from "ui5/genatrix/types/generator/TypeGeneratorBase.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default abstract class TypeGeneratorBase extends BaseObject {
    private readonly settings: TypeGeneratorBaseSettings;

    constructor(settings: TypeGeneratorBaseSettings) {
        super();
        this.settings = settings;
    }

    public abstract generate(property: EntityTypeProperty): SimpleType;

    protected getDateTimeConstraints(property: EntityTypeProperty) {
        if (property.displayFormat === "Date") {
            const constraints: ODataDateTimeConstraints = {
                displayFormat: "Date"
            };

            return constraints;
        }
    }

    protected getDateTimeFormatOptions(property: EntityTypeProperty) {
        const propertyConfiguration = this.settings.propertyConfigurations.find(opt => opt.getName() === property.name);
        const datePattern = propertyConfiguration?.getDatePattern() || this.settings.datePattern;
        const timePattern = propertyConfiguration?.getTimePattern() || this.settings.timePattern;
        const dateTimeSeparator = propertyConfiguration?.getDateTimeSeparator() ?? this.settings.dateTimeSeparator;
        const dateFirst = propertyConfiguration?.getDateFirst() ?? this.settings.dateFirst;

        switch (property.type) {
            case "Edm.Date":
                if (datePattern) {
                    return {
                        pattern: datePattern
                    };
                }

                break;
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    if (datePattern) {
                        return {
                            pattern: datePattern
                        };
                    }
                } else {
                    if (datePattern && timePattern) {
                        return {
                            pattern: dateFirst ? `${datePattern}${dateTimeSeparator}${timePattern}` : `${timePattern}${dateTimeSeparator}${datePattern}`
                        };
                    }
                }

                break;
            case "Edm.DateTimeOffset":
                if (datePattern && timePattern) {
                    return {
                        pattern: dateFirst ? `${datePattern}${dateTimeSeparator}${timePattern}` : `${timePattern}${dateTimeSeparator}${datePattern}`
                    };
                }

                break;
            case "Edm.Time":
                if (timePattern) {
                    return {
                        pattern: timePattern
                    };
                }

                break;
        }
    }

    protected getMaximumDateTimeValue(property: EntityTypeProperty) {
        const propertyConfiguration = this.settings.propertyConfigurations.find(opt => opt.getName() === property.name);
        const maximumValue = propertyConfiguration?.getMaximumValue();

        if (maximumValue) {
            const date = new Date(maximumValue);

            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }

    protected getMinimumDateTimeValue(property: EntityTypeProperty) {
        const propertyConfiguration = this.settings.propertyConfigurations.find(opt => opt.getName() === property.name);
        const minimumValue = propertyConfiguration?.getMinimumValue();

        if (minimumValue) {
            const date = new Date(minimumValue);

            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }

    protected getNumberFormatOptions(property: EntityTypeProperty) {
        const propertyConfiguration = this.settings.propertyConfigurations.find(opt => opt.getName() === property.name);
        const groupingSeparator = propertyConfiguration?.getGroupingSeparator() || this.settings.groupingSeparator;
        const decimalSeparator = propertyConfiguration?.getDecimalSeparator() || this.settings.decimalSeparator;

        const formatOptions: ODataNumberFormatOptions = {
            groupingEnabled: propertyConfiguration?.getGroupingEnabled() ?? this.settings.groupingEnabled,
            groupingSize: propertyConfiguration?.getGroupingSize() ?? this.settings.groupingSize,
            parseEmptyValueToZero: propertyConfiguration?.getParseEmptyValueToZero() ?? this.settings.parseEmptyValueToZero
        };

        if (groupingSeparator && decimalSeparator) {
            if (groupingSeparator === decimalSeparator) {
                throw new Error("Grouping Separator and Decimal Separator cannot be identical");
            }

            formatOptions.groupingSeparator = groupingSeparator;
            formatOptions.decimalSeparator = decimalSeparator;
        } else if (groupingSeparator) {
            formatOptions.groupingSeparator = groupingSeparator;
            formatOptions.decimalSeparator = this.getCounterNumberSeparator(groupingSeparator);
        } else if (decimalSeparator) {
            formatOptions.decimalSeparator = decimalSeparator;
            formatOptions.groupingSeparator = this.getCounterNumberSeparator(decimalSeparator);
        }

        return formatOptions;
    }

    protected getNumberConstraints(property: EntityTypeProperty) {
        const propertyConfiguration = this.settings.propertyConfigurations.find(opt => opt.getName() === property.name);

        const constraints: ODataNumberConstraints = {
            precision: property.precision,
            scale: property.scale,
            maximum: propertyConfiguration?.getMaximumValue(),
            minimum: propertyConfiguration?.getMinimumValue()
        };

        const isEmpty = Object.values(constraints).every(value => value == null);

        if (isEmpty) {
            return;
        }

        return constraints;
    }

    private getCounterNumberSeparator(separator: string) {
        switch (separator) {
            case ".":
                return ",";
            case ",":
                return ".";
            default:
                return ",";
        }
    }
}