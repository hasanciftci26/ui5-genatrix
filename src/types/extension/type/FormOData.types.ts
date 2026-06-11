import PropertyValidation from "ui5/genatrix/form/PropertyValidation";
import {
    ODataDateTimeConstraints,
    ODataDateTimeFormatOptions,
    ODataNumberConstraints,
    ODataNumberFormatOptions,
    ODataStringConstraints,
    ODataStringFormatOptions
} from "ui5/genatrix/types/extension/type/GlobalOData.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

export type FormODataTypeBaseSettings = {
    property: EntityTypeProperty;
    requiredMessage?: string;
    validation?: PropertyValidation;
};

export type FormStringSettings = FormODataTypeBaseSettings & {
    formatOptions?: ODataStringFormatOptions;
    constraints?: ODataStringConstraints;
};

export type FormNumberSettings = FormODataTypeBaseSettings & {
    formatOptions?: ODataNumberFormatOptions;
    constraints?: ODataNumberConstraints;
};

export type FormDateTimeSettingsNoConstraints = FormODataTypeBaseSettings & {
    formatOptions?: ODataDateTimeFormatOptions;
};

export type FormDateTimeSettingsWithConstraints = FormODataTypeBaseSettings & {
    formatOptions?: ODataDateTimeFormatOptions;
    constraints?: ODataDateTimeConstraints;
};