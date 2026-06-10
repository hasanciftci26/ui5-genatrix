import FormBoolean from "ui5/genatrix/extension/type/FormBoolean";
import FormString from "ui5/genatrix/extension/type/FormString";
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

    // TODO
    public generate(property: EntityTypeProperty, propertyValidation?: PropertyValidation) {
        switch (property.type) {
            case "Edm.Boolean":
                return new FormBoolean({
                    property: property,
                    validation: propertyValidation
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