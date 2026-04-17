import { ValidationOperatorType } from "ui5/genatrix/types/metadata/form/ValidationLogic.types";
import ContextV2 from "sap/ui/model/odata/v2/Context";
import ContextV4 from "sap/ui/model/odata/v4/Context";

export type RunSettings = {
    rawPropertyValue: any;
    rawValue1: any;
    rawValue2: any;
    operator: ValidationOperatorType;
    context: ContextV2 | ContextV4;
};