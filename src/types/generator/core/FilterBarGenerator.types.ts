import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Filter from "sap/ui/model/Filter";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import FilterBarGenerator from "ui5/genatrix/generator/core/FilterBarGenerator";
import ValueListParameter from "ui5/genatrix/metadata/form/ValueListParameter";
import ValueListPropertyOption from "ui5/genatrix/metadata/form/ValueListPropertyOption";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

export type FilterBarGenerator$SearchEventParameters = {
    userInputError: boolean;
    filter?: Filter;
};

export type FilterBarGenerator$SearchEvent = Event<FilterBarGenerator$SearchEventParameters, FilterBarGenerator>;
export type FilterBarGenerator$SearchEventHandler = (event: FilterBarGenerator$SearchEvent) => void;

export type FilterBarControl = {
    propertyName: string;
    control: Control;
};

export type FilterBarGeneratorSettings = {
    properties: EntityProperty[];
    parameters: ValueListParameter[];
    propertyOptions: ValueListPropertyOption[];
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
    filterBarExpanded: boolean;
    oDataModel: ODataModel;
};