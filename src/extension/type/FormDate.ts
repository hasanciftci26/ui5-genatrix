import ODataDate from "sap/ui/model/odata/type/Date";
import ValidateException from "sap/ui/model/ValidateException";
import FormType from "ui5/genatrix/interface/FormType";
import { FormDateTimeSettingsNoConstraints } from "ui5/genatrix/types/extension/type/FormOData.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormDate extends ODataDate implements FormType {
    private readonly settings: FormDateTimeSettingsNoConstraints;

    constructor(settings: FormDateTimeSettingsNoConstraints) {
        super(settings.formatOptions);
        this.settings = settings;
    }

    public override async validateValue(value: string | null) {
        if (value != null) {
            super.validateValue(value);
        }

        if (this.settings.property.required) {
            this.checkRequired(value);
        }

        if (this.settings.validation && value) {
            const parsedValue = new Date(value);

            return this.settings.validation.evaluate({
                property: this.settings.property,
                value: parsedValue
            });
        }
    }

    public setRequired(required: boolean) {
        this.settings.property.required = required;
    }    

    private checkRequired(value: string | null) {
        if (!value) {
            const errorMessage = this.settings.requiredMessage || LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);
            throw new ValidateException(errorMessage);
        }
    }
}