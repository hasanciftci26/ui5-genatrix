import Decimal from "sap/ui/model/odata/type/Decimal";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomNumberSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.odata.type
 */
export default class CustomDecimal extends Decimal {
    private readonly settings: CustomNumberSettings;

    constructor(settings: CustomNumberSettings) {
        super(settings.formatOptions, settings.constraints);
        this.settings = settings;
    }

    public override async validateValue(value: string | null) {
        if (value) {
            super.validateValue(value);
        }

        if (this.settings.property.required) {
            this.checkRequired(value);
        }

        if (this.settings.validationLogic && value) {
            const parsedValue = parseFloat(value);
            return this.settings.validationLogic.evaluate(parsedValue);
        }
    }

    private checkRequired(value: string | null) {
        if (!value) {
            throw new ValidateException("TODO");
        }
    }
}