import Guid from "sap/ui/model/odata/type/Guid";
import ValidateException from "sap/ui/model/ValidateException";
import { CustomStringSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.odata.type
 */
export default class CustomGuid extends Guid {
    private readonly settings: CustomStringSettings;

    constructor(settings: CustomStringSettings) {
        super();
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
            return this.settings.validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: string | null) {
        if (!value) {
            throw new ValidateException("TODO");
        }
    }
}