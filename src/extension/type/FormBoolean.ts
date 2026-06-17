import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import FormType from "ui5/genatrix/interface/FormType";
import { FormODataTypeBaseSettings } from "ui5/genatrix/types/extension/type/FormOData.types";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormBoolean extends ODataBoolean implements FormType {
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

    public setRequired(required: boolean) {
        this.settings.property.required = required;
    }
}