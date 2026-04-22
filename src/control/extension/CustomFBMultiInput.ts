import MultiInput, { $MultiInputSettings } from "sap/m/MultiInput";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import CustomFBToken from "ui5/genatrix/control/extension/CustomFBToken";
import CustomFilterBarField from "ui5/genatrix/odata/type/CustomFilterBarField";
import { CustomFilterBarFieldSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomFBMultiInput extends MultiInput {
    static readonly renderer = {};

    constructor(settings?: $MultiInputSettings);
    constructor(id?: string, settings?: $MultiInputSettings);

    constructor(idOrSettings?: string | $MultiInputSettings, settings?: $MultiInputSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public static createInstance(modelName: string, settings: CustomFilterBarFieldSettings) {
        const instance = new CustomFBMultiInput({
            value: {
                path: `${modelName}>/${settings.property.name}`,
                type: new CustomFilterBarField(settings)
            }
        });

        instance.addValidator(() => {
            try {
                const userInput = instance.getUserInput();

                return new CustomFBToken({
                    key: userInput.formattedValue,
                    text: userInput.formattedValue,
                    filterValue: userInput.parsedValue,
                    filterOperator: userInput.operator
                });
            } catch {
                return;
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