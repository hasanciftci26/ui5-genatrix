import ComboBox from "sap/m/ComboBox";
import { MetadataOptions } from "sap/ui/core/Element";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import { CustomComboBoxSettings } from "ui5/genatrix/types/control/extension/CustomComboBox.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomComboBox extends ComboBox {
    public static readonly metadata: MetadataOptions = {
        properties: {
            propertyName: { type: "string" }
        }
    };
    public static readonly renderer = {};

    constructor(settings?: CustomComboBoxSettings);
    constructor(id?: string, settings?: CustomComboBoxSettings);

    constructor(idOrSettings?: string | CustomComboBoxSettings, settings?: CustomComboBoxSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async checkValuesValidity() {
        const binding = this.getBinding("selectedKey") as PropertyBinding;
        const value = this.getProperty("selectedKey");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }
}