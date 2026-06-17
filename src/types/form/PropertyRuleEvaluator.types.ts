import Context from "sap/ui/model/Context";
import { ComparisonOperator } from "ui5/genatrix/form/enum/ComparisonOperator";

export type RunSettings = {
    rawPropertyValue: any;
    rawValue1: any;
    rawValue2: any;
    comparisonOperator: ComparisonOperator | keyof typeof ComparisonOperator;
    context: Context;
};