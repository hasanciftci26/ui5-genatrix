import DatePicker from "sap/m/DatePicker";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.genatrix.extension.control
 */
export default class FormDatePicker extends DatePicker {
    public async validateContent() {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }
}