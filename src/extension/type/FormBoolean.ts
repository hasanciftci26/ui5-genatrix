import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import { FormODataTypeBaseSettings } from "ui5/genatrix/types/extension/type/FormOData.types";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormBoolean extends ODataBoolean {
    private readonly settings: FormODataTypeBaseSettings;

    constructor(settings: FormODataTypeBaseSettings) {
        super();
        this.settings = settings;
    }

    public override async validateValue(value: boolean | null) {
        if (value != null) {
            super.validateValue(value);
        }

        if (this.settings.validation && value) {
            return this.settings.validation.evaluate({
                property: this.settings.property,
                value: value
            });
        }
    }
}