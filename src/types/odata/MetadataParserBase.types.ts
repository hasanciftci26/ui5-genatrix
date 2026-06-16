import Model from "sap/ui/model/Model";
import { Property } from "sap/ui/model/odata/ODataMetaModel";
import { FormMode } from "ui5/genatrix/form/enum/FormMode";
import PropertyConfigurationBase from "ui5/genatrix/interface/PropertyConfigurationBase";

export type MetadataParserBaseSettings<T extends Model = Model> = {
    entitySet: string;
    model: T;
    formMode: FormMode | keyof typeof FormMode;
    requiredProperties: string[];
    readonlyProperties: string[];
    excludedProperties: string[];
    displayOrder: string[];
    propertyConfigurations: PropertyConfigurationBase[];
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
    "Edm.Date" |
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