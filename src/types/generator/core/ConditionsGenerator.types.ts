import { valuehelpdialog } from "sap/ui/comp/library";
import CustomFBInput from "ui5/genatrix/control/extension/CustomFBInput";
import CustomFBMultiInput from "ui5/genatrix/control/extension/CustomFBMultiInput";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

export type ConditionsGeneratorSettings = {
    type: "Single" | "Multi";
    property: EntityProperty;
    source: CustomFBInput | CustomFBMultiInput;
    groupingEnabled: boolean;
    groupingSeparator?: string;
    groupingSize: number;
    decimalSeparator?: string;
    parseEmptyValueToZero: boolean;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator: string;
    dateFirst: boolean;
};

export type RangeCustomData = {
    keyField: string;
    operation: valuehelpdialog.ValueHelpRangeOperation;
    value1: any;
    value2: any;
    exclude: boolean;
};