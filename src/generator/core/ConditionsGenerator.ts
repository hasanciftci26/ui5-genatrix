import BaseObject from "sap/ui/base/Object";
import { valuehelpdialog } from "sap/ui/comp/library";
import ValueHelpDialog from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
import { ValueHelpDialog$OkEvent } from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import Byte from "sap/ui/model/odata/type/Byte";
import ODataDate from "sap/ui/model/odata/type/Date";
import DateTime from "sap/ui/model/odata/type/DateTime";
import Decimal from "sap/ui/model/odata/type/Decimal";
import Double from "sap/ui/model/odata/type/Double";
import Guid from "sap/ui/model/odata/type/Guid";
import Int16 from "sap/ui/model/odata/type/Int16";
import Int32 from "sap/ui/model/odata/type/Int32";
import Int64 from "sap/ui/model/odata/type/Int64";
import SByte from "sap/ui/model/odata/type/SByte";
import Single from "sap/ui/model/odata/type/Single";
import ODataString from "sap/ui/model/odata/type/String";
import Time from "sap/ui/model/odata/type/Time";
import CustomFBInput from "ui5/genatrix/control/extension/CustomFBInput";
import { ConditionsGeneratorSettings, RangeCustomData } from "ui5/genatrix/types/generator/core/ConditionsGenerator.types";
import { DateTimeConstraints, NumberConstraints, NumberFormatOptions } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.generator.core
 */
export default class ConditionsGenerator extends BaseObject {
    private readonly settings: ConditionsGeneratorSettings;
    private vhd: ValueHelpDialog;

    constructor(settings: ConditionsGeneratorSettings) {
        super();
        this.settings = settings;
    }

    public open() {
        const rangeOperations = this.getRangeOperations();
        const type = this.getType();

        this.vhd = new ValueHelpDialog({
            title: this.settings.property.label,
            supportRanges: true,
            supportRangesOnly: true,
            maxConditions: this.settings.type === "Single" ? "1" : "-1"
        });

        this.vhd.setRangeKeyFields([{
            key: this.settings.property.name,
            label: this.settings.property.label,
            type: type,
            typeInstance: this.getTypeInstance()
        }]);

        this.vhd.attachOk(this.onConfirm, this);
        this.vhd.attachCancel(this.onCancel, this);
        this.vhd.attachAfterClose(this.onAfterClose, this);

        this.vhd.setIncludeRangeOperations(rangeOperations, type);
        this.vhd.setExcludeRangeOperations(rangeOperations, type);

        this.vhd.open();
    }

    private onConfirm(event: ValueHelpDialog$OkEvent) {
        const tokens = event.getParameter("tokens");

        if (!tokens) {
            this.vhd.close();
            return;
        }

        for (const token of tokens) {
            const range = token.data("range") as RangeCustomData;
            const value = this.getRangeValue(range);

            if (this.settings.source instanceof CustomFBInput) {
                this.settings.source.setInitialValue(value);
            } else {
                this.settings.source.addInitialToken(value, true);
            }
        }

        this.vhd.close();
    }

    private onCancel() {
        this.vhd.close();
    }

    private onAfterClose() {
        this.vhd.destroy();
    }

    private getType() {
        switch (this.settings.property.type) {
            case "Edm.Boolean":
                return "boolean";
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return "numeric";
            case "Edm.DateTime":
                return this.settings.property.displayFormat === "Date" ? "date" : "datetime";
            case "Edm.DateTimeOffset":
                return "datetime";
            case "Edm.Time":
                return "time";
            case "Edm.Guid":
                return "guid";
            default:
                return "string";
        }
    }

    private getTypeInstance() {
        switch (this.settings.property.type) {
            case "Edm.Boolean":
                return new ODataBoolean();
            case "Edm.Byte":
                return new Byte(this.getNumberFormatOptions(), this.getNumberConstraints());
            case "Edm.SByte":
                return new SByte(this.getNumberFormatOptions(), this.getNumberConstraints());
            case "Edm.Int16":
                return new Int16(this.getNumberFormatOptions(), this.getNumberConstraints());
            case "Edm.Int32":
                return new Int32(this.getNumberFormatOptions(), this.getNumberConstraints());
            case "Edm.Int64":
                return new Int64(this.getNumberFormatOptions() || { parseEmptyValueToZero: false }, this.getNumberConstraints() || { nullable: true });
            case "Edm.Single":
                return new Single(this.getNumberFormatOptions(), this.getNumberConstraints());
            case "Edm.Double":
                return new Double(this.getNumberFormatOptions(), this.getNumberConstraints());
            case "Edm.Decimal":
                return new Decimal(this.getNumberFormatOptions(), this.getNumberConstraints());
            case "Edm.DateTime":
                if (this.settings.property.displayFormat === "Date") {
                    return new ODataDate(this.getDateTimeFormatOptions(), this.getDateConstraints());
                } else {
                    return new DateTime(this.getDateTimeFormatOptions());
                }
            case "Edm.DateTimeOffset":
                return new DateTime(this.getDateTimeFormatOptions());
            case "Edm.Time":
                return new Time(this.getDateTimeFormatOptions());
            case "Edm.Guid":
                return new Guid();
            default:
                return new ODataString(undefined, { maxLength: this.settings.property.maxLength });
        }
    }

    private getNumberFormatOptions() {
        const groupingSeparator = this.settings.groupingSeparator;
        const decimalSeparator = this.settings.decimalSeparator;
        const formatOptions: NumberFormatOptions = {
            groupingEnabled: this.settings.groupingEnabled,
            groupingSize: this.settings.groupingSize,
            parseEmptyValueToZero: this.settings.parseEmptyValueToZero
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

    private getNumberConstraints() {
        const constraints: NumberConstraints = {
            precision: this.settings.property.precision,
            scale: this.settings.property.scale
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

    private getDateConstraints() {
        const constraints: DateTimeConstraints = {
            displayFormat: "Date"
        };

        return constraints;
    }

    private getDateTimeFormatOptions() {
        const datePattern = this.settings.datePattern;
        const timePattern = this.settings.timePattern;
        const dateTimeSeparator = this.settings.dateTimeSeparator;
        const dateFirst = this.settings.dateFirst;

        switch (this.settings.property.type) {
            case "Edm.DateTime":
                if (this.settings.property.displayFormat === "Date") {
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

    private getRangeOperations() {
        const operations: valuehelpdialog.ValueHelpRangeOperation[] = [
            valuehelpdialog.ValueHelpRangeOperation.EQ
        ];

        switch (this.settings.property.type) {
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                operations.push(valuehelpdialog.ValueHelpRangeOperation.GE);
                operations.push(valuehelpdialog.ValueHelpRangeOperation.GT);
                operations.push(valuehelpdialog.ValueHelpRangeOperation.LE);
                operations.push(valuehelpdialog.ValueHelpRangeOperation.LT);
                operations.push(valuehelpdialog.ValueHelpRangeOperation.BT);
                break;
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
            case "Edm.Time":
                operations.push(valuehelpdialog.ValueHelpRangeOperation.BT);
                break;
            case "Edm.String":
                operations.push(valuehelpdialog.ValueHelpRangeOperation.Contains);
                operations.push(valuehelpdialog.ValueHelpRangeOperation.StartsWith);
                operations.push(valuehelpdialog.ValueHelpRangeOperation.EndsWith);
                break;
        }

        return operations;
    }

    private getRangeValue(range: RangeCustomData) {
        const value1 = String(range.value1);
        const value2 = String(range.value2);
        let value = "";

        switch (range.operation) {
            case valuehelpdialog.ValueHelpRangeOperation.EQ:
                value = "=" + value1;
                break;
            case valuehelpdialog.ValueHelpRangeOperation.GE:
                value = ">=" + value1;
                break;
            case valuehelpdialog.ValueHelpRangeOperation.GT:
                value = ">" + value1;
                break;
            case valuehelpdialog.ValueHelpRangeOperation.LE:
                value = "<=" + value1;
                break;
            case valuehelpdialog.ValueHelpRangeOperation.LT:
                value = "<" + value1;
                break;
            case valuehelpdialog.ValueHelpRangeOperation.BT:
                value = value1 + "..." + value2;
                break;
            case valuehelpdialog.ValueHelpRangeOperation.Contains:
                value = "*" + value1 + "*";
                break;
            case valuehelpdialog.ValueHelpRangeOperation.StartsWith:
                value = value1 + "*";
                break;
            case valuehelpdialog.ValueHelpRangeOperation.EndsWith:
                value = "*" + value1;
                break;
        }

        if (range.exclude) {
            value = "!" + value;
        }

        return value;
    }
}