import FormBoolean from "ui5/genatrix/extension/type/FormBoolean";
import FormByte from "ui5/genatrix/extension/type/FormByte";
import FormDate from "ui5/genatrix/extension/type/FormDate";
import FormDateTime from "ui5/genatrix/extension/type/FormDateTime";
import FormDateTimeOffset from "ui5/genatrix/extension/type/FormDateTimeOffset";
import FormDecimal from "ui5/genatrix/extension/type/FormDecimal";
import FormDouble from "ui5/genatrix/extension/type/FormDouble";
import FormGuid from "ui5/genatrix/extension/type/FormGuid";
import FormInt16 from "ui5/genatrix/extension/type/FormInt16";
import FormInt32 from "ui5/genatrix/extension/type/FormInt32";
import FormInt64 from "ui5/genatrix/extension/type/FormInt64";
import FormSByte from "ui5/genatrix/extension/type/FormSByte";
import FormSingle from "ui5/genatrix/extension/type/FormSingle";
import FormString from "ui5/genatrix/extension/type/FormString";
import FormTime from "ui5/genatrix/extension/type/FormTime";
import PropertyValidation from "ui5/genatrix/form/PropertyValidation";
import TypeGeneratorBase from "ui5/genatrix/generator/TypeGeneratorBase";
import { TypeGeneratorBaseSettings } from "ui5/genatrix/types/generator/TypeGeneratorBase.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default class FormTypeGenerator extends TypeGeneratorBase {
    constructor(settings: TypeGeneratorBaseSettings) {
        super(settings);
    }

    public generate(property: EntityTypeProperty, propertyValidation?: PropertyValidation) {
        switch (property.type) {
            case "Edm.Boolean":
                return new FormBoolean({
                    property: property,
                    validation: propertyValidation
                });
            case "Edm.Date":
                return new FormDate({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getDateTimeFormatOptions(property)
                });
            case "Edm.DateTime":
                return new FormDateTime({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getDateTimeFormatOptions(property),
                    constraints: this.getDateTimeConstraints(property)
                });
            case "Edm.DateTimeOffset":
                return new FormDateTimeOffset({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getDateTimeFormatOptions(property)
                });
            case "Edm.Time":
                return new FormTime({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getDateTimeFormatOptions(property)
                });
            case "Edm.Byte":
                return new FormByte({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.SByte":
                return new FormSByte({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.Int16":
                return new FormInt16({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.Int32":
                return new FormInt32({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.Int64":
                return new FormInt64({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.Single":
                return new FormSingle({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.Double":
                return new FormDouble({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.Decimal":
                return new FormDecimal({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property),
                    formatOptions: this.getNumberFormatOptions(property),
                    constraints: this.getNumberConstraints(property)
                });
            case "Edm.Guid":
                return new FormGuid({
                    property: property,
                    validation: propertyValidation,
                    requiredMessage: this.getRequiredMessage(property)
                });
            default:
                return new FormString({
                    property: property,
                    requiredMessage: this.getRequiredMessage(property),
                    validation: propertyValidation,
                    constraints: this.getStringConstraints(property)
                });
        }
    }
}