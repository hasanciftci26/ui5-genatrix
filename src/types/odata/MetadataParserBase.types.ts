import Model from "sap/ui/model/Model";
import { Property } from "sap/ui/model/odata/ODataMetaModel";

export type MetadataParserBaseSettings<T extends Model = Model> = {
    entitySet: string;
    model: T;
    requiredProperties: string[];
    readonlyProperties: string[];
    excludedProperties: string[];
};

export type EntityTypeProperty = {
    name: string;
    type: EdmType;
    key: boolean;
    label: string;
    required: boolean;
    readonly: boolean;
    excluded: boolean;
    filterable: boolean;
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