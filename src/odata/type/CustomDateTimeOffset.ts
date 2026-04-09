import DateTimeOffset from "sap/ui/model/odata/type/DateTimeOffset";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomDateTimeSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

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
            return this.settings.validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: Date | null) {
        if (value == null) {
            throw new ValidateException("TODO");
        }
    }
}