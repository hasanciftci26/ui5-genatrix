import TimePicker from "sap/m/TimePicker";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

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
}