import Int32 from "sap/ui/model/odata/type/Int32";
import ValidateException from "sap/ui/model/ValidateException";
import FormType from "ui5/genatrix/interface/FormType";
import { FormNumberSettings } from "ui5/genatrix/types/extension/type/FormOData.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormInt32 extends Int32 implements FormType {
    private readonly settings: FormNumberSettings;

    constructor(settings: FormNumberSettings) {
        super(settings.formatOptions, settings.constraints);
        this.settings = settings;
    }

    public override async validateValue(value: number | null) {
        if (value != null) {
            super.validateValue(value);
        }

        if (this.settings.property.required) {
            this.checkRequired(value);
        }

        if (this.settings.validation && value != null) {
            return this.settings.validation.evaluate({
                property: this.settings.property,
                value: value
            });
        }
    }

    public setRequired(required: boolean) {
        this.settings.property.required = required;
    }    

    private checkRequired(value: number | null) {
        if (value == null) {
            const errorMessage = this.settings.requiredMessage || LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);
            throw new ValidateException(errorMessage);
        }
    }
}