import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ContextV2 from "sap/ui/model/odata/v2/Context";
import ContextV4 from "sap/ui/model/odata/v4/Context";
import ValidationOperator from "ui5/genatrix/metadata/form/enum/ValidationOperator";
import { ValidationConditionSettings } from "ui5/genatrix/types/metadata/form/ValidationCondition.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValidationCondition extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
            operator: { type: "ui5.genatrix.metadata.form.enum.ValidationOperator", defaultValue: ValidationOperator.EQ },
            value1: { type: "any" },
            value2: { type: "any" }
        }
    };

    constructor(settings?: ValidationConditionSettings);
    constructor(id?: string, settings?: ValidationConditionSettings);

    constructor(idOrSettings?: string | ValidationConditionSettings, settings?: ValidationConditionSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public check(context: ContextV2 | ContextV4) {
        const propertyName = this.getPropertyName();

        if (!propertyName) {
            return false;
        }

        const value = context.getProperty(propertyName);
        const operator = this.getOperator() || ValidationOperator.EQ;

        switch (operator) {
            case "NE":
                break;
            case "In":
                break;
            case "NotIn":
                break;
            case "IsEmpty":
                break;
            case "LE":
                break;
            case "LT":
                break;
            case "GE":
                break;
            case "GT":
                break;
            case "BT":
                break;
            case "NB":
                break;
            case "Contains":
                break;
            case "NotContains":
                break;
            case "StartsWith":
                break;
            case "NotStartsWith":
                break;
            case "EndsWith":
                break;
            case "NotEndsWith":
                break;
            case "RegExp":
                break;
            default:
                break;
        }

        return true;
    }

    private checkEQ(value1: any, value2: any) {
        return value1 === value2;
    }

    private checkNE(value1: any, value2: any) {
        return value1 !== value2;
    }

    private checkIn(value1: any, values: any[]) {
        return values.includes(value1);
    }

    private checkNotIn(value1: any, values: any[]) {
        return values.includes(value1) === false;
    }

    private checkIsEmpty(value1: any) {
        return value1 == null;
    }

    private checkLE(value1: any, value2: any) {
        return value1 <= value2;
    }

    private checkLT(value1: any, value2: any) {
        return value1 < value2;
    }

    private checkGE(value1: any, value2: any) {
        return value1 >= value2;
    }

    private checkGT(value1: any, value2: any) {
        return value1 > value2;
    }

    private checkBT(value: any, min: any, max: any) {
        return value >= min && value <= max;
    }

    private checkNB(value: any, min: any, max: any) {
        return value < min || value > max;
    }

    private checkContains(value1: string, value2: string) {
        return value1.includes(value2);
    }

    private checkNotContains(value1: string, value2: string) {
        return value1.includes(value2) === false;
    }

    private checkStartsWith(value1: string, value2: string) {
        return value1.startsWith(value2);
    }

    private checkNotStartsWith(value1: string, value2: string) {
        return value1.startsWith(value2) === false;
    }

    private checkEndsWith(value1: string, value2: string) {
        return value1.endsWith(value2);
    }

    private checkNotEndsWith(value1: string, value2: string) {
        return value1.endsWith(value2) === false;
    }

    private checkRegExp(value: string, pattern: string) {
        const regExp = new RegExp(pattern);
        return regExp.test(value);
    }
}