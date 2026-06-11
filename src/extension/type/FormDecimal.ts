import Decimal from "sap/ui/model/odata/type/Decimal";
import ValidateException from "sap/ui/model/ValidateException";
import { FormNumberSettings } from "ui5/genatrix/types/extension/type/FormOData.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormDecimal extends Decimal {
    private readonly settings: FormNumberSettings;

    constructor(settings: FormNumberSettings) {
        super(settings.formatOptions, settings.constraints);
        this.settings = settings;
    }

    public override async validateValue(value: string | null) {
        if (value != null) {
            super.validateValue(value);
        }

        if (this.settings.property.required) {
            this.checkRequired(value);
        }

        if (this.settings.validation && value != null && value !== "") {
            const parsedValue = parseFloat(value);

            return this.settings.validation.evaluate({
                property: this.settings.property,
                value: parsedValue
            });
        }
    }

    private checkRequired(value: string | null) {
        if (value == null || value === "") {
            const errorMessage = this.settings.requiredMessage || LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);
            throw new ValidateException(errorMessage);
        }
    }
}