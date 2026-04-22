import Byte from "sap/ui/model/odata/type/Byte";
import Decimal from "sap/ui/model/odata/type/Decimal";
import Double from "sap/ui/model/odata/type/Double";
import Guid from "sap/ui/model/odata/type/Guid";
import Int16 from "sap/ui/model/odata/type/Int16";
import Int32 from "sap/ui/model/odata/type/Int32";
import Int64 from "sap/ui/model/odata/type/Int64";
import SByte from "sap/ui/model/odata/type/SByte";
import Single from "sap/ui/model/odata/type/Single";
import ODataString from "sap/ui/model/odata/type/String";
import SimpleType from "sap/ui/model/SimpleType";
import ValidateException from "sap/ui/model/ValidateException";
import {
    CustomFilterBarFieldOperator,
    CustomFilterBarFieldSettings,
    NumberConstraints,
    NumberFormatOptions
} from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.odata.type
 */
export default class CustomFilterBarField extends SimpleType {
    private readonly settings: CustomFilterBarFieldSettings;
    private readonly internalType: SimpleType;
    private operator: CustomFilterBarFieldOperator;

    constructor(settings: CustomFilterBarFieldSettings) {
        super();
        this.settings = settings;
        this.internalType = this.getInternalType();
    }

    public override formatValue(value: any, targetType: "string") {
        if (this.operator === "BT" || this.operator === "NOT_BT") {
            const [low, high] = value.split("...");
            const lowFormatted = this.internalType.formatValue(this.getValueAsNumber(low), targetType) as string;
            const highFormatted = this.internalType.formatValue(this.getValueAsNumber(high), targetType) as string;
            return this.formatValueWithOperator(`${lowFormatted}...${highFormatted}`);
        } else {
            const formattedValue = this.internalType.formatValue(value, targetType) as string;
            return this.formatValueWithOperator(formattedValue);
        }
    }

    public override parseValue(value: string, sourceType: "string") {
        const correctedValue = this.getValueNoBrackets(value);
        this.operator = this.extractOperator(correctedValue);

        if (this.operator === "BT" || this.operator === "NOT_BT") {
            const parts = this.removeOperatorFromValue(correctedValue).split("...");
            const low = this.internalType.parseValue(parts[0], sourceType);
            const high = this.internalType.parseValue(parts[1], sourceType);

            return `${low}...${high}`;
        } else {
            return this.internalType.parseValue(this.removeOperatorFromValue(correctedValue), sourceType);
        }
    }

    public override validateValue(value: any) {
        this.validateOperator();

        if (this.operator === "BT" || this.operator === "NOT_BT") {
            const [low, high] = value.split("...");
            void this.internalType.validateValue(this.getValueAsNumber(low));
            void this.internalType.validateValue(this.getValueAsNumber(high));

            if (this.getValueAsNumber(low, true) >= this.getValueAsNumber(high, true)) {
                throw new ValidateException(LibraryBundle.getText("genatrix.error.invalidRange"));
            }
        } else {
            void this.internalType.validateValue(value);
        }
    }

    public getOperator() {
        return this.operator;
    }

    private getValueNoBrackets(value: string) {
        return value.startsWith("!(") && value.endsWith(")") ? value.replace("(", "").replace(")", "") : value;
    }

    private getValueAsNumber(value: any, comparison = false) {
        if (comparison) {
            if (this.settings.property.type === "Edm.Int64") {
                return BigInt(value);
            } else {
                return Number(value);
            }
        } else {
            if (this.settings.property.type === "Edm.Decimal" || this.settings.property.type === "Edm.Int64") {
                return value;
            } else {
                return Number(value);
            }
        }
    }

    private formatValueWithOperator(value: string) {
        switch (this.operator) {
            case "NOT_GE":
                return `!(>=${value})`;
            case "NOT_LE":
                return `!(<=${value})`;
            case "NOT_GT":
                return `!(>${value})`;
            case "NOT_LT":
                return `!(<${value})`;
            case "NE":
                return `!(=${value})`;
            case "GE":
                return `>=${value}`;
            case "LE":
                return `<=${value}`;
            case "GT":
                return `>${value}`;
            case "LT":
                return `<${value}`;
            case "NOT_CONTAINS":
                return `!(*${value}*)`;
            case "CONTAINS":
                return `*${value}*`;
            case "NOT_STARTS_WITH":
                return `!(${value}*)`;
            case "STARTS_WITH":
                return `${value}*`;
            case "NOT_ENDS_WITH":
                return `!(*${value})`;
            case "ENDS_WITH":
                return `*${value}`;
            case "NOT_BT":
                return `!(${value})`;
            default:
                return value;
        }
    }

    private removeOperatorFromValue(value: string) {
        switch (this.operator) {
            case "NOT_GE":
            case "NOT_LE":
                return value.slice(3);
            case "NOT_GT":
            case "NOT_LT":
            case "NE":
            case "GE":
            case "LE":
                return value.slice(2);
            case "GT":
            case "LT":
                return value.slice(1);
            case "EQ":
                return value.startsWith("=") ? value.slice(1) : value;
            case "NOT_CONTAINS":
                return value.slice(2, -1);
            case "CONTAINS":
                return value.slice(1, -1);
            case "NOT_STARTS_WITH":
                return value.slice(1, -1);
            case "STARTS_WITH":
                return value.slice(0, -1);
            case "NOT_ENDS_WITH":
                return value.slice(2);
            case "ENDS_WITH":
                return value.slice(1);
            case "NOT_BT":
                return value.slice(1);
            default:
                return value;
        }
    }

    private extractOperator(value: string) {
        if (value.startsWith("!>=")) {
            return "NOT_GE";
        }

        if (value.startsWith("!<=")) {
            return "NOT_LE";
        }

        if (value.startsWith("!>")) {
            return "NOT_GT";
        }

        if (value.startsWith("!<")) {
            return "NOT_LT";
        }

        if (value.startsWith("!=")) {
            return "NE";
        }

        if (value.startsWith(">=")) {
            return "GE";
        }

        if (value.startsWith("<=")) {
            return "LE";
        }

        if (value.startsWith(">")) {
            return "GT";
        }

        if (value.startsWith("<")) {
            return "LT";
        }

        if (value.startsWith("!*") && value.endsWith("*")) {
            return "NOT_CONTAINS";
        }

        if (value.startsWith("!")) {
            const rest = value.slice(1);

            if (rest.endsWith("*")) {
                return "NOT_STARTS_WITH";
            }

            if (rest.startsWith("*")) {
                return "NOT_ENDS_WITH";
            }
        }

        if (value.startsWith("*") && value.endsWith("*")) {
            return "CONTAINS";
        }

        if (value.endsWith("*")) {
            return "STARTS_WITH";
        }

        if (value.startsWith("*")) {
            return "ENDS_WITH";
        }

        const isNegated = value.startsWith("!");
        const raw = isNegated ? value.slice(1) : value;
        const parts = raw.split("...");

        if (parts.length === 2 && parts[0] !== "" && parts[1] !== "") {
            return isNegated ? "NOT_BT" : "BT";
        }

        return "EQ";
    }

    private getInternalType() {
        switch (this.settings.property.type) {
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
            case "Edm.Guid":
                return new Guid();
            default:
                return new ODataString(undefined, { maxLength: this.settings.property.maxLength });
        }
    }

    private validateOperator() {
        const numericTypes = ["Edm.Byte", "Edm.SByte", "Edm.Int16", "Edm.Int32", "Edm.Int64", "Edm.Single", "Edm.Double", "Edm.Decimal"];

        switch (this.operator) {
            case "CONTAINS":
            case "NOT_CONTAINS":
            case "STARTS_WITH":
            case "NOT_STARTS_WITH":
            case "ENDS_WITH":
            case "NOT_ENDS_WITH":
                if (this.settings.property.type !== "Edm.String") {
                    throw new ValidateException(LibraryBundle.getText("genatrix.error.invalidTextOperator"));
                }

                break;
            case "GE":
            case "NOT_GE":
            case "GT":
            case "NOT_GT":
            case "LE":
            case "NOT_LE":
            case "LT":
            case "NOT_LT":
            case "BT":
            case "NOT_BT":
                if (numericTypes.includes(this.settings.property.type) === false) {
                    throw new ValidateException(LibraryBundle.getText("genatrix.error.invalidNumericOperator"));
                }

                break;
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
}