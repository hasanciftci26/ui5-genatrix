import DateTimeOffset from "sap/ui/model/odata/type/DateTimeOffset";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomDateTimeSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.odata.type
 */
export default class CustomDateTimeOffset extends DateTimeOffset {
    private readonly settings: CustomDateTimeSettings;

    constructor(settings: CustomDateTimeSettings) {
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

        if (this.settings.validationLogic && value != null) {
            return this.settings.validationLogic.evaluate(this.settings.property, this.settings.busyModel, value);
        }
    }

    private checkRequired(value: Date | null) {
        if (value == null) {
            const errorMessage = this.settings.propertyOptions?.getRequiredErrorMessage() ||
                LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);

            throw new ValidateException(errorMessage);
        }
    }
}