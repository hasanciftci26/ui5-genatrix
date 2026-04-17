import ComboBox, { $ComboBoxSettings } from "sap/m/ComboBox";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomComboBox extends ComboBox {
    static readonly renderer = {};
    private readonly propertyName: string;

    constructor(propertyName: string, settings?: $ComboBoxSettings);
    constructor(propertyName: string, id?: string, settings?: $ComboBoxSettings);

    constructor(propertyName: string, idOrSettings?: string | $ComboBoxSettings, settings?: $ComboBoxSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.propertyName = propertyName;
    }

    public async checkValuesValidity() {
        const binding = this.getBinding("selectedKey") as PropertyBinding;
        const value = this.getProperty("selectedKey");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }

    public getPropertyName() {
        return this.propertyName;
    }
}