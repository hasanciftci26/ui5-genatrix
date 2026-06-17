import BaseObject from "sap/ui/base/Object";
import Context from "sap/ui/model/Context";
import { ComparisonOperator } from "ui5/genatrix/form/enum/ComparisonOperator";
import { RunSettings } from "ui5/genatrix/types/form/PropertyRuleEvaluator.types";

/**
 * @namespace ui5.genatrix.form
 */
export default class PropertyRuleEvaluator extends BaseObject {
    public run(settings: RunSettings) {
        const propertyValue = this.getCorrectedValue(settings.rawPropertyValue, settings.context);
        const value1 = this.getCorrectedValue(settings.rawValue1, settings.context);
        const value2 = this.getCorrectedValue(settings.rawValue2, settings.context);

        switch (settings.comparisonOperator) {
            case ComparisonOperator.NE:
                if (propertyValue != null && value1 != null) {
                    return this.checkNE(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.In:
                if (propertyValue != null && Array.isArray(value1)) {
                    return this.checkIn(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.NotIn:
                if (propertyValue != null && Array.isArray(value1)) {
                    return this.checkNotIn(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.IsEmpty:
                return this.checkIsEmpty(propertyValue);
            case ComparisonOperator.LE:
                if (this.isNumber(propertyValue) && this.isNumber(value1)) {
                    return this.checkLE(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.LT:
                if (this.isNumber(propertyValue) && this.isNumber(value1)) {
                    return this.checkLT(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.GE:
                if (this.isNumber(propertyValue) && this.isNumber(value1)) {
                    return this.checkGE(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.GT:
                if (this.isNumber(propertyValue) && this.isNumber(value1)) {
                    return this.checkGT(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.BT:
                if (this.isNumber(propertyValue) && this.isNumber(value1) && this.isNumber(value2)) {
                    return this.checkBT(propertyValue, value1, value2);
                } else {
                    return false;
                }
            case ComparisonOperator.NB:
                if (this.isNumber(propertyValue) && this.isNumber(value1) && this.isNumber(value2)) {
                    return this.checkNB(propertyValue, value1, value2);
                } else {
                    return false;
                }
            case ComparisonOperator.Contains:
                if (typeof propertyValue === "string" && typeof value1 === "string") {
                    return this.checkContains(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.NotContains:
                if (typeof propertyValue === "string" && typeof value1 === "string") {
                    return this.checkNotContains(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.StartsWith:
                if (typeof propertyValue === "string" && typeof value1 === "string") {
                    return this.checkStartsWith(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.NotStartsWith:
                if (typeof propertyValue === "string" && typeof value1 === "string") {
                    return this.checkNotStartsWith(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.EndsWith:
                if (typeof propertyValue === "string" && typeof value1 === "string") {
                    return this.checkEndsWith(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.NotEndsWith:
                if (typeof propertyValue === "string" && typeof value1 === "string") {
                    return this.checkNotEndsWith(propertyValue, value1);
                } else {
                    return false;
                }
            case ComparisonOperator.RegExp:
                if (typeof propertyValue === "string" && typeof value1 === "string") {
                    return this.checkRegExp(propertyValue, value1);
                } else {
                    return false;
                }
            default:
                if (propertyValue != null && value1 != null) {
                    return this.checkEQ(propertyValue, value1);
                } else {
                    return false;
                }
        }
    }

    private checkEQ(propertyValue: any, value1: any) {
        return propertyValue === value1;
    }

    private checkNE(propertyValue: any, value1: any) {
        return propertyValue !== value1;
    }

    private checkIn(propertyValue: any, values: any[]) {
        return values.includes(propertyValue);
    }

    private checkNotIn(propertyValue: any, values: any[]) {
        return values.includes(propertyValue) === false;
    }

    private checkIsEmpty(propertyValue: any) {
        return propertyValue == null;
    }

    private checkLE(propertyValue: any, value1: any) {
        return propertyValue <= value1;
    }

    private checkLT(propertyValue: any, value1: any) {
        return propertyValue < value1;
    }

    private checkGE(propertyValue: any, value1: any) {
        return propertyValue >= value1;
    }

    private checkGT(propertyValue: any, value1: any) {
        return propertyValue > value1;
    }

    private checkBT(propertyValue: any, value1: any, value2: any) {
        return propertyValue >= value1 && propertyValue <= value2;
    }

    private checkNB(propertyValue: any, value1: any, value2: any) {
        return propertyValue < value1 || propertyValue > value2;
    }

    private checkContains(propertyValue: string, value1: string) {
        return propertyValue.includes(value1);
    }

    private checkNotContains(propertyValue: string, value1: string) {
        return propertyValue.includes(value1) === false;
    }

    private checkStartsWith(propertyValue: string, value1: string) {
        return propertyValue.startsWith(value1);
    }

    private checkNotStartsWith(propertyValue: string, value1: string) {
        return propertyValue.startsWith(value1) === false;
    }

    private checkEndsWith(propertyValue: string, value1: string) {
        return propertyValue.endsWith(value1);
    }

    private checkNotEndsWith(propertyValue: string, value1: string) {
        return propertyValue.endsWith(value1) === false;
    }

    private checkRegExp(propertyValue: string, value1: string) {
        try {
            const regExp = new RegExp(value1);
            return regExp.test(propertyValue);
        } catch {
            return false; // or handle differently
        }
    }

    private getCorrectedValue(value: any, context: Context) {
        if (value == null || Array.isArray(value) || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
            return value;
        }

        if (value instanceof Date) {
            return value.getTime();
        }

        if (typeof value === "string") {
            return this.getStringValue(value);
        }

        if (typeof value === "object") {
            if (this.isTimeObject(value)) {
                return value.ms;
            }

            if (this.isPropertyReference(value)) {
                const propertyValue = context.getProperty(value.propertyName);
                return this.getCorrectedValue(propertyValue, context);
            }
        }
    }

    private isTime(value: string) {
        const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
        return timeRegex.test(value);
    }

    private isTimeObject(value: object): value is { ms: number; } {
        return "ms" in value && typeof value.ms === "number";
    }

    private isDate(value: string) {
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])([T\s]([01]\d|2[0-3]):[0-5]\d:[0-5]\d)?$/;
        return dateRegex.test(value);
    }

    private isPropertyReference(value: object): value is { propertyName: string; } {
        return "propertyName" in value && typeof value.propertyName === "string";
    }

    private isNumber(value: any) {
        return typeof value === "number" || typeof value === "bigint";
    }

    private convertTimeToMilliseconds(value: string) {
        const [hours, minutes, seconds] = value.split(":").map(Number) as [number, number, number];
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }

    private getStringValue(value: string) {
        const trimmed = value.trim();

        if (trimmed === "true") {
            return true;
        }

        if (trimmed === "false") {
            return false;
        }

        if (this.isTime(trimmed)) {
            return this.convertTimeToMilliseconds(trimmed);
        }

        if (this.isDate(trimmed)) {
            const date = new Date(trimmed);
            const timestamp = date.getTime();

            if (!Number.isNaN(timestamp)) {
                return timestamp;
            }
        }

        if (/^[+-]?\d+\.\d+$/.test(trimmed)) {
            return Number(trimmed);
        }

        if (/^[+-]?\d+$/.test(trimmed)) {
            const num = Number(trimmed);

            if (Number.isSafeInteger(num)) {
                return num;
            }

            try {
                return BigInt(trimmed);
            } catch {
                return value;
            }
        }

        return value;
    }
}