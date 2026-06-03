import BaseObject from "sap/ui/base/Object";
import FormString from "ui5/genatrix/extension/type/FormString";
import { FormTypeGeneratorSettings } from "ui5/genatrix/types/generator/FormTypeGenerator.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default class FormTypeGenerator extends BaseObject {
    private readonly settings: FormTypeGeneratorSettings;

    constructor(settings: FormTypeGeneratorSettings) {
        super();
        this.settings = settings;
    }

    // TODO
    public generate(property: EntityTypeProperty) {
        return new FormString({
            property: property
        });
    }
}