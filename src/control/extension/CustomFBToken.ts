import Token from "sap/m/Token";
import { MetadataOptions } from "sap/ui/core/Element";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import { CustomFBTokenSettings } from "ui5/genatrix/types/control/extension/CustomFBToken.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomFBToken extends Token {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        properties: {
            propertyName: { type: "string" },
            filterValue: { type: "any" },
            filterOperator: { type: "string" }
        }
    };
    static readonly renderer = {};

    constructor(settings?: CustomFBTokenSettings);
    constructor(id?: string, settings?: CustomFBTokenSettings);

    constructor(idOrSettings?: string | CustomFBTokenSettings, settings?: CustomFBTokenSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public getFilter(caseSensitive: boolean) {
        const operator = this.getUI5Operator();
        const filterValue = this.getFilterValue();

        if (operator === FilterOperator.BT || operator === FilterOperator.NB) {
            const [low, high] = (filterValue as string).split("...");

            return new Filter({
                path: this.getPropertyName(),
                operator: operator,
                value1: Number(low),
                value2: Number(high)
            });
        } else {
            return new Filter({
                path: this.getPropertyName(),
                operator: operator,
                value1: filterValue,
                caseSensitive: caseSensitive
            });
        }
    }

    private getUI5Operator() {
        switch (this.getFilterOperator()) {
            case "NOT_GE":
                return FilterOperator.LT;
            case "NOT_LE":
                return FilterOperator.GT;
            case "NOT_GT":
                return FilterOperator.LE;
            case "NOT_LT":
                return FilterOperator.GE;
            case "NE":
                return FilterOperator.NE;
            case "GE":
                return FilterOperator.GE;
            case "LE":
                return FilterOperator.LE;
            case "GT":
                return FilterOperator.GT;
            case "LT":
                return FilterOperator.LT;
            case "NOT_CONTAINS":
                return FilterOperator.NotContains;
            case "CONTAINS":
                return FilterOperator.Contains;
            case "NOT_STARTS_WITH":
                return FilterOperator.NotStartsWith;
            case "STARTS_WITH":
                return FilterOperator.StartsWith;
            case "NOT_ENDS_WITH":
                return FilterOperator.NotEndsWith;
            case "ENDS_WITH":
                return FilterOperator.EndsWith;
            case "NOT_BT":
                return FilterOperator.NB;
            case "BT":
                return FilterOperator.BT;
            default:
                return FilterOperator.EQ;
        }
    }
}