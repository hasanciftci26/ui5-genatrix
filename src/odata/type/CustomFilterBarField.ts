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
import SimpleType from "sap/ui/model/SimpleType";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomFilterBarFieldOperator, CustomFilterBarFieldSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";
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
        const formattedValue = this.internalType.formatValue(value, targetType) as string;
        return this.formatValueWithOperator(formattedValue);
    }

    public override parseValue(value: string, sourceType: "string") {
        this.operator = this.extractOperator(value);
        return this.internalType.parseValue(this.clearValueFromOperator(value), sourceType);
    }

    public override validateValue(value: any) {
        this.validateOperator();
        void this.internalType.validateValue(value);
    }

    public getOperator() {
        return this.operator;
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
            default:
                return value;
        }
    }

    private clearValueFromOperator(value: string) {
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

        return "EQ";
    }

    private getInternalType() {
        switch (this.settings.property.type) {
            case "Edm.Boolean":
                return new ODataBoolean();
            case "Edm.Byte":
                return new Byte();
            case "Edm.SByte":
                return new SByte();
            case "Edm.Int16":
                return new Int16();
            case "Edm.Int32":
                return new Int32();
            case "Edm.Int64":
                return new Int64({});
            case "Edm.Single":
                return new Single();
            case "Edm.Double":
                return new Double();
            case "Edm.Decimal":
                return new Decimal();
            case "Edm.DateTime":
                if (this.settings.property.displayFormat === "Date") {
                    return new ODataDate();
                } else {
                    return new DateTime();
                }
            case "Edm.DateTimeOffset":
                return new DateTime();
            case "Edm.Time":
                return new Time();
            case "Edm.Guid":
                return new Guid();
            default:
                return new ODataString();
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
                if (numericTypes.includes(this.settings.property.type) === false) {
                    throw new ValidateException(LibraryBundle.getText("genatrix.error.invalidNumericOperator"));
                }

                break;
        }
    }
}