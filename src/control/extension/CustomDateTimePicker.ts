import DateTimePicker from "sap/m/DateTimePicker";
import { MetadataOptions } from "sap/ui/core/Element";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import { CustomDateTimePickerSettings } from "ui5/genatrix/types/control/extension/CustomDateTimePicker.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomDateTimePicker extends DateTimePicker {
    public static readonly metadata: MetadataOptions = {
        properties: {
            propertyName: { type: "string" }
        }
    };
    public static readonly renderer = {};

    constructor(settings?: CustomDateTimePickerSettings);
    constructor(id?: string, settings?: CustomDateTimePickerSettings);

    constructor(idOrSettings?: string | CustomDateTimePickerSettings, settings?: CustomDateTimePickerSettings) {
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