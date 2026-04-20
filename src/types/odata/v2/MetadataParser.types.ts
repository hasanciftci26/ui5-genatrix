import { Property } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import PropertyOption from "ui5/genatrix/metadata/form/PropertyOption";
import ValueListParameter from "ui5/genatrix/metadata/form/ValueListParameter";
import { FormModeType } from "ui5/genatrix/types/control/v2/form/DialogForm.types";

type MetadataParserForm = {
    type: "Form";
    classId: string;
    model: ODataModel;
    formMode: FormModeType;
    requiredProperties?: string;
    readonlyProperties?: string;
    excludedProperties?: string;
    keysAlwaysIncluded: boolean;
    propertyOptions: PropertyOption[];
};

type MetadataParserValueList = {
    type: "ValueList";
    classId: string;
    model: ODataModel;
    valueListParameters: ValueListParameter[];
};

export type MetadataParserSettings = MetadataParserForm | MetadataParserValueList;

export type EntityProperty = {
    name: string;
    type: EdmType;
    key: boolean;
    label: string;
    readonly: boolean;
    required: boolean;
    displayFormat?: PropertyDisplayFormat;
    precision?: number;
    scale?: number;
    maxLength?: number;
};

export type MetaModelProperty = Property & {
    "com.sap.vocabularies.Common.v1.Label"?: {
        String: string;
    };
};

export type PropertyDisplayFormat = "Date" | "NonNegative" | "UpperCase";

export type EdmType =
    "Edm.Binary" |
    "Edm.Boolean" |
    "Edm.Byte" |
    "Edm.DateTime" |
    "Edm.DateTimeOffset" |
    "Edm.Decimal" |
    "Edm.Double" |
    "Edm.Guid" |
    "Edm.Int16" |
    "Edm.Int32" |
    "Edm.Int64" |
    "Edm.SByte" |
    "Edm.Single" |
    "Edm.Stream" |
    "Edm.String" |
    "Edm.Time";