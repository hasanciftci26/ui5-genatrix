import DateTime from "sap/ui/model/odata/type/DateTime";
import ValidateException from "sap/ui/model/ValidateException";
import FormType from "ui5/genatrix/interface/FormType";
import { FormDateTimeSettingsWithConstraints } from "ui5/genatrix/types/extension/type/FormOData.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormDateTime extends DateTime implements FormType {
    private readonly settings: FormDateTimeSettingsWithConstraints;

    constructor(settings: FormDateTimeSettingsWithConstraints) {
        super(settings.formatOptions, settings.constraints);
        this.settings = settings;
    }

    public override async validateValue(value: Date | null) {
        if (value != null) {
            super.validateValue(value);
        }

        if (this.settings.property.required) {
            this.checkRequired(value);
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

    private checkRequired(value: Date | null) {
        if (!value) {
            const errorMessage = this.settings.requiredMessage || LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);
            throw new ValidateException(errorMessage);
        }
    }
}