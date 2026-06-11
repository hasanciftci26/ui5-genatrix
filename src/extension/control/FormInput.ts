import Input from "sap/m/Input";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.genatrix.extension.control
 */
export default class FormInput extends Input {
    public static readonly renderer = {};
    
    public async validateContent() {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }
}