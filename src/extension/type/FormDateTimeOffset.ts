import DateTimeOffset from "sap/ui/model/odata/type/DateTimeOffset";
import ValidateException from "sap/ui/model/ValidateException";
import { FormDateTimeSettingsNoConstraints } from "ui5/genatrix/types/extension/type/FormOData.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormDateTimeOffset extends DateTimeOffset {
    private readonly settings: FormDateTimeSettingsNoConstraints;

    constructor(settings: FormDateTimeSettingsNoConstraints) {
        super(settings.formatOptions);
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

    private checkRequired(value: Date | null) {
        if (!value) {
            const errorMessage = this.settings.requiredMessage || LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);
            throw new ValidateException(errorMessage);
        }
    }
}