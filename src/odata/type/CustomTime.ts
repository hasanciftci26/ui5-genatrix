import Time from "sap/ui/model/odata/type/Time";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomDateTimeSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.odata.type
 */
export default class CustomTime extends Time {
    private readonly settings: CustomDateTimeSettings;

    constructor(settings: CustomDateTimeSettings) {
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

        if (this.settings.validationLogic && value != null) {
            const timeValue = this.hasMilliseconds(value) ? value.ms : value;
            return this.settings.validationLogic.evaluate(timeValue);
        }
    }

    private checkRequired(value: object | null) {
        if (value == null) {
            const errorMessage = this.settings.propertyOptions?.getRequiredErrorMessage() ||
                LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);

            throw new ValidateException(errorMessage);
        }
    }

    private hasMilliseconds(value: object): value is { ms: number; } {
        return "ms" in value && typeof value.ms === "number";
    }
}