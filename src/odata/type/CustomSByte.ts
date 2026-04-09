import SByte from "sap/ui/model/odata/type/SByte";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomNumberSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.odata.type
 */
export default class CustomSByte extends SByte {
    private readonly settings: CustomNumberSettings;

    constructor(settings: CustomNumberSettings) {
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

        if (this.settings.validationLogic && value != null) {
            return this.settings.validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: number | null) {
        if (value == null) {
            throw new ValidateException("TODO");
        }
    }
}