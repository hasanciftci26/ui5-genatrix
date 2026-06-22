import Model from "sap/ui/model/Model";
import { Property } from "sap/ui/model/odata/ODataMetaModel";
import { TextArrangement } from "ui5/genatrix/core/enum/TextArrangement";
import { FormMode } from "ui5/genatrix/form/enum/FormMode";
import PropertyConstraint from "ui5/genatrix/form/PropertyConstraint";
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
    propertyConstraints: PropertyConstraint[];
};

export type EntityTypeProperty = {
    name: string;
    type: EdmType;
    key: boolean;
    label: string;
    required: boolean;
    strictRequired: boolean;
    readonly: boolean;
    filterable: boolean;
    visible: boolean;
    displayFormat?: PropertyDisplayFormat;
    precision?: number;
    scale?: number;
    maxLength?: number;
    text?: string;
    textArrangement: TextArrangement | keyof typeof TextArrangement;
};

export type MetaModelProperty = Property & {
    "com.sap.vocabularies.Common.v1.Label"?: {
        String: string;
    };
    "com.sap.vocabularies.Common.v1.Text"?: {
        Path: string;
        "com.sap.vocabularies.UI.v1.TextArrangement"?: {
            EnumMember: TextArrangementEnumMember;
        };
    };
};

export type TextArrangementEnumMember =
    "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst" |
    "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast" |
    "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" |
    "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate";

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