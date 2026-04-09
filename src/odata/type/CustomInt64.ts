import Int64 from "sap/ui/model/odata/type/Int64";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomNumberSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.odata.type
 */
export default class CustomInt64 extends Int64 {
    private readonly settings: CustomNumberSettings;

    constructor(settings: CustomNumberSettings) {
        super(settings.formatOptions || { parseEmptyValueToZero: false }, settings.constraints || { nullable: true });
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
            const parsedValue = BigInt(value);
            return this.settings.validationLogic.evaluate(parsedValue);
        }
    }

    private checkRequired(value: string | null) {
        if (!value) {
            throw new ValidateException("TODO");
        }
    }
}