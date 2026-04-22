import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ValueListParameter from "ui5/genatrix/metadata/form/ValueListParameter";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

export type FilterBarGeneratorSettings = {
    properties: EntityProperty[];
    parameters: ValueListParameter[];
    searchSupported: boolean;
    caseSensitiveSearch: boolean;
    dateRangeOptions?: string;
    datePattern?: string;
    timePattern?: string;
    dateTimeSeparator: string;
    dateFirst: boolean;
    groupingEnabled: boolean;
    groupingSeparator?: string;
    groupingSize: number;
    decimalSeparator?: string;
    parseEmptyValueToZero: boolean;
    oDataModel: ODataModel;
};