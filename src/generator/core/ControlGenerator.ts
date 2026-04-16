import CheckBox from "sap/m/CheckBox";
import Text from "sap/m/Text";
import BaseObject from "sap/ui/base/Object";
import Messaging from "sap/ui/core/Messaging";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import Type from "sap/ui/model/Type";
import CustomDatePicker from "ui5/genatrix/control/extension/CustomDatePicker";
import CustomDateTimePicker from "ui5/genatrix/control/extension/CustomDateTimePicker";
import CustomInput from "ui5/genatrix/control/extension/CustomInput";
import CustomTimePicker from "ui5/genatrix/control/extension/CustomTimePicker";
import CustomByte from "ui5/genatrix/odata/type/CustomByte";
import CustomDateTime from "ui5/genatrix/odata/type/CustomDateTime";
import CustomDateTimeOffset from "ui5/genatrix/odata/type/CustomDateTimeOffset";
import CustomDecimal from "ui5/genatrix/odata/type/CustomDecimal";
import CustomDouble from "ui5/genatrix/odata/type/CustomDouble";
import CustomGuid from "ui5/genatrix/odata/type/CustomGuid";
import CustomInt16 from "ui5/genatrix/odata/type/CustomInt16";
import CustomInt32 from "ui5/genatrix/odata/type/CustomInt32";
import CustomInt64 from "ui5/genatrix/odata/type/CustomInt64";
import CustomSByte from "ui5/genatrix/odata/type/CustomSByte";
import CustomSingle from "ui5/genatrix/odata/type/CustomSingle";
import CustomString from "ui5/genatrix/odata/type/CustomString";
import CustomTime from "ui5/genatrix/odata/type/CustomTime";
import { ControlGeneratorSettings } from "ui5/genatrix/types/generator/core/ControlGenerator.types";
import { DateTimeConstraints, NumberConstraints, NumberFormatOptions } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class ControlGenerator extends BaseObject {
    private readonly settings: ControlGeneratorSettings;

    constructor(settings: ControlGeneratorSettings) {
        super();
        this.settings = settings;
    }

    public generate(property: EntityProperty) {
        const type = this.getODataType(property);

        if (property.readonly) {
            const control = this.getReadonlyControl(property, type);
            const layoutData = this.settings.propertyOptions.find(opt => opt.getPropertyName() === property.name)?.getLayoutData();

            if (layoutData) {
                control.setLayoutData(layoutData);
            }

            return control;
        } else {
            const control = this.getEditableControl(property, type);
            const propertyOptions = this.settings.propertyOptions.find(opt => opt.getPropertyName() === property.name);
            const layoutData = propertyOptions?.getLayoutData();

            if (layoutData) {
                control.setLayoutData(layoutData);
            }

            if (control instanceof CustomDatePicker || control instanceof CustomDateTimePicker) {
                this.setDateTimeMinMax(control, propertyOptions?.getMaximumValue(), propertyOptions?.getMinimumValue());
            }

            Messaging.registerObject(control, true);
            return control;
        }
    }

    private getReadonlyControl(property: EntityProperty, type: Type) {
        return new Text({
            text: {
                path: property.name,
                type: type,
                formatter: (value: any) => {
                    if (value == null || value == "") {
                        return "—";
                    } else {
                        return value;
                    }
                }
            }
        });
    }

    private getEditableControl(property: EntityProperty, type: Type) {
        switch (property.type) {
            case "Edm.Boolean":
                return new CheckBox({
                    selected: {
                        path: property.name,
                        type: type
                    }
                });
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    return new CustomDatePicker(property.name, {
                        required: property.required,
                        value: {
                            path: property.name,
                            type: type
                        }
                    });
                } else {
                    return new CustomDateTimePicker(property.name, {
                        required: property.required,
                        value: {
                            path: property.name,
                            type: type
                        }
                    });
                }
            case "Edm.DateTimeOffset":
                return new CustomDateTimePicker(property.name, {
                    required: property.required,
                    value: {
                        path: property.name,
                        type: type
                    }
                });
            case "Edm.Time":
                return new CustomTimePicker(property.name, {
                    required: property.required,
                    value: {
                        path: property.name,
                        type: type
                    }
                });
            default:
                return new CustomInput(property.name, {
                    required: property.required,
                    maxLength: property.maxLength,
                    value: {
                        path: property.name,
                        type: type
                    }
                });
        }
    }

    private getODataType(property: EntityProperty) {
        const propertyOptions = this.settings.propertyOptions.find(opt => opt.getPropertyName() === property.name);

        switch (property.type) {
            case "Edm.Boolean":
                return new ODataBoolean();
            case "Edm.Byte":
                return new CustomByte({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.SByte":
                return new CustomSByte({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Int16":
                return new CustomInt16({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Int32":
                return new CustomInt32({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Int64":
                return new CustomInt64({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Single":
                return new CustomSingle({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Double":
                return new CustomDouble({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Decimal":
                return new CustomDecimal({
                    property: property,
                    constraints: this.getNumberConstraints(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.DateTime":
                return new CustomDateTime({
                    property: property,
                    constraints: this.getDateTimeConstraints(property),
                    formatOptions: this.getDateTimeFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.DateTimeOffset":
                return new CustomDateTimeOffset({
                    property: property,
                    formatOptions: this.getDateTimeFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Time":
                return new CustomTime({
                    property: property,
                    formatOptions: this.getDateTimeFormatOptions(property),
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            case "Edm.Guid":
                return new CustomGuid({
                    property: property,
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
            default:
                return new CustomString({
                    property: property,
                    propertyOptions: propertyOptions,
                    validationLogic: this.settings.validationLogics.find(logic => logic.getPropertyName() === property.name)
                });
        }
    }

    private getNumberFormatOptions(property: EntityProperty) {
        const propertyOptions = this.settings.propertyOptions.find(opt => opt.getPropertyName() === property.name);
        const groupingSeparator = propertyOptions?.getGroupingSeparator() || this.settings.groupingSeparator;
        const decimalSeparator = propertyOptions?.getDecimalSeparator() || this.settings.decimalSeparator;
        const formatOptions: NumberFormatOptions = {
            groupingEnabled: propertyOptions?.getGroupingEnabled() ?? this.settings.groupingEnabled,
            groupingSize: propertyOptions?.getGroupingSize() ?? this.settings.groupingSize,
            parseEmptyValueToZero: propertyOptions?.getParseEmptyValueToZero() ?? this.settings.parseEmptyValueToZero
        };

        if (groupingSeparator && decimalSeparator) {
            if (groupingSeparator === decimalSeparator) {
                throw new Error("Grouping Separator and Decimal Separator cannot be identical - " + this.settings.controlId);
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

    private getNumberConstraints(property: EntityProperty) {
        const propertyOptions = this.settings.propertyOptions.find(opt => opt.getPropertyName() === property.name);
        const constraints: NumberConstraints = {
            precision: property.precision,
            scale: property.scale,
            maximum: propertyOptions?.getMaximumValue(),
            minimum: propertyOptions?.getMinimumValue()
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

    private getDateTimeConstraints(property: EntityProperty) {
        if (property.displayFormat === "Date") {
            const constraints: DateTimeConstraints = {
                displayFormat: "Date"
            };

            return constraints;
        }
    }

    private getDateTimeFormatOptions(property: EntityProperty) {
        const propertyOptions = this.settings.propertyOptions.find(opt => opt.getPropertyName() === property.name);
        const datePattern = propertyOptions?.getDatePattern() || this.settings.datePattern;
        const timePattern = propertyOptions?.getTimePattern() || this.settings.timePattern;
        const dateTimeSeparator = propertyOptions?.getDateTimeSeparator() ?? this.settings.dateTimeSeparator;
        const dateFirst = propertyOptions?.getDateFirst() ?? this.settings.dateFirst;

        switch (property.type) {
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

    private setDateTimeMinMax(control: CustomDatePicker | CustomDateTimePicker, maximumValue?: string, minimumValue?: string) {
        if (maximumValue != null) {
            const date = new Date(maximumValue);

            if (!isNaN(date.getTime())) {
                control.setMaxDate(date);
            }
        }

        if (minimumValue != null) {
            const date = new Date(minimumValue);

            if (!isNaN(date.getTime())) {
                control.setMinDate(date);
            }
        }
    }
}