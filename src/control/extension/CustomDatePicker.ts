import DatePicker from "sap/m/DatePicker";
import { MetadataOptions } from "sap/ui/core/Element";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import { CustomDatePickerSettings } from "ui5/genatrix/types/control/extension/CustomDatePicker.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomDatePicker extends DatePicker {
    public static readonly metadata: MetadataOptions = {
        properties: {
            propertyName: { type: "string" }
        }
    };
    public static readonly renderer = {};

    constructor(settings?: CustomDatePickerSettings);
    constructor(id?: string, settings?: CustomDatePickerSettings);

    constructor(idOrSettings?: string | CustomDatePickerSettings, settings?: CustomDatePickerSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async checkValuesValidity() {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }
}