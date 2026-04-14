import TimePicker, { $TimePickerSettings } from "sap/m/TimePicker";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomTimePicker extends TimePicker {
    static readonly renderer = {};
    private readonly propertyName: string;

    constructor(propertyName: string, settings?: $TimePickerSettings);
    constructor(propertyName: string, id?: string, settings?: $TimePickerSettings);

    constructor(propertyName: string, idOrSettings?: string | $TimePickerSettings, settings?: $TimePickerSettings) {
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