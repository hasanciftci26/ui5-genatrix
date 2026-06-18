import TimePicker from "sap/m/TimePicker";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import FormType from "ui5/genatrix/interface/FormType";

/**
 * @namespace ui5.genatrix.extension.control
 */
export default class FormTimePicker extends TimePicker {
    public static readonly renderer = {};
    
    public async validateContent() {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }

    public setBindingTypeRequired(required: boolean) {
        ((this.getBinding("value") as PropertyBinding).getType() as FormType).setRequired(required);
    }    
}