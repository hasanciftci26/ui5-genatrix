import DateTimePicker, { $DateTimePickerSettings } from "sap/m/DateTimePicker";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomDateTimePicker extends DateTimePicker {
    static readonly renderer = {};
    private readonly propertyName: string;

    constructor(propertyName: string, settings?: $DateTimePickerSettings);
    constructor(propertyName: string, id?: string, settings?: $DateTimePickerSettings);

    constructor(propertyName: string, idOrSettings?: string | $DateTimePickerSettings, settings?: $DateTimePickerSettings) {
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