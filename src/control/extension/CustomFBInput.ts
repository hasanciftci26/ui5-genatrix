import Input, { $InputSettings } from "sap/m/Input";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import CustomFilterBarField from "ui5/genatrix/odata/type/CustomFilterBarField";
import { CustomFilterBarFieldSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomFBInput extends Input {
    static readonly renderer = {};

    constructor(settings?: $InputSettings);
    constructor(id?: string, settings?: $InputSettings);

    constructor(idOrSettings?: string | $InputSettings, settings?: $InputSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public static createInstance(modelName: string, settings: CustomFilterBarFieldSettings) {
        const instance = new CustomFBInput({
            value: {
                path: `${modelName}>/${settings.property.name}`,
                type: new CustomFilterBarField(settings)
            }
        });

        return instance;
    }

    public getUserInput() {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as CustomFilterBarField;
        const parsedValue = type.parseValue(value, "string");

        void type.validateValue(parsedValue);

        return {
            formattedValue: type.formatValue(parsedValue, "string") as string,
            parsedValue: parsedValue,
            operator: type.getOperator()
        };
    }
}