import FormString from "ui5/genatrix/extension/type/FormString";
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
    public generate(property: EntityTypeProperty) {
        return new FormString({
            property: property
        });
    }
}