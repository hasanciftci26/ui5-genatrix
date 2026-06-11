import Time from "sap/ui/model/odata/type/Time";
import ValidateException from "sap/ui/model/ValidateException";
import { FormDateTimeSettingsNoConstraints } from "ui5/genatrix/types/extension/type/FormOData.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormTime extends Time {
    private readonly settings: FormDateTimeSettingsNoConstraints;

    constructor(settings: FormDateTimeSettingsNoConstraints) {
        super(settings.formatOptions);
        this.settings = settings;
    }

    public override async validateValue(value: object | null) {
        if (value != null) {
            super.validateValue(value);
        }

        if (this.settings.property.required) {
            this.checkRequired(value);
        }

        if (this.settings.validation && value != null) {
            const timeValue = this.hasMilliseconds(value) ? value.ms : value;

            return this.settings.validation.evaluate({
                property: this.settings.property,
                value: timeValue
            });
        }
    }

    private checkRequired(value: object | null) {
        if (value == null) {
            const errorMessage = this.settings.requiredMessage || LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);
            throw new ValidateException(errorMessage);
        }
    }

    private hasMilliseconds(value: object): value is { ms: number; } {
        return "ms" in value && typeof value.ms === "number";
    }
}