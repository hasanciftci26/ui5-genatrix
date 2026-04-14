import DatePicker, { $DatePickerSettings } from "sap/m/DatePicker";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomDatePicker extends DatePicker {
    static readonly renderer = {};
    private readonly propertyName: string;

    constructor(propertyName: string, settings?: $DatePickerSettings);
    constructor(propertyName: string, id?: string, settings?: $DatePickerSettings);

    constructor(propertyName: string, idOrSettings?: string | $DatePickerSettings, settings?: $DatePickerSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.propertyName = propertyName;
    }

    public async checkValuesValidity() {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }

    public getPropertyName() {
        return this.propertyName;
    }
}