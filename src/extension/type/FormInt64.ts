import Int64 from "sap/ui/model/odata/type/Int64";
import ValidateException from "sap/ui/model/ValidateException";
import FormType from "ui5/genatrix/interface/FormType";
import { FormNumberSettings } from "ui5/genatrix/types/extension/type/FormOData.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.extension.type
 */
export default class FormInt64 extends Int64 implements FormType {
    private readonly settings: FormNumberSettings;

    constructor(settings: FormNumberSettings) {
        super(settings.formatOptions || { parseEmptyValueToZero: false }, settings.constraints || { nullable: true });
        this.settings = settings;
    }

    public override async validateValue(value: string | null) {
        if (value != null) {
            super.validateValue(value);
        }

        if (this.settings.property.required) {
            this.checkRequired(value);
        }

        if (this.settings.validation && value != null && value !== "") {
            const parsedValue = BigInt(value);

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
        if (value == null || value === "") {
            const errorMessage = this.settings.requiredMessage || LibraryBundle.getText("genatrix.error.requiredField", [this.settings.property.label]);
            throw new ValidateException(errorMessage);
        }
    }
}