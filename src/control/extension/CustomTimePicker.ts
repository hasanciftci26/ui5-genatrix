import TimePicker from "sap/m/TimePicker";
import { MetadataOptions } from "sap/ui/core/Element";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import { CustomTimePickerSettings } from "ui5/genatrix/types/control/extension/CustomTimePicker.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomTimePicker extends TimePicker {
    public static readonly metadata: MetadataOptions = {
        properties: {
            propertyName: { type: "string" }
        }
    };
    public static readonly renderer = {};

    constructor(settings?: CustomTimePickerSettings);
    constructor(id?: string, settings?: CustomTimePickerSettings);

    constructor(idOrSettings?: string | CustomTimePickerSettings, settings?: CustomTimePickerSettings) {
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