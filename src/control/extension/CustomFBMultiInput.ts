import MultiInput, { $MultiInputSettings } from "sap/m/MultiInput";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import CustomToken from "ui5/genatrix/control/extension/CustomToken";
import CustomFilterBarField from "ui5/genatrix/odata/type/CustomFilterBarField";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";

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

    public static createInstance(entityProperty: EntityProperty, modelName: string) {
        const instance = new CustomFBMultiInput({
            value: {
                path: `${modelName}>/${entityProperty.name}`,
                type: new CustomFilterBarField({
                    property: entityProperty
                })
            }
        });

        instance.addValidator(() => {
            try {
                const userInput = instance.getUserInput();

                return new CustomToken({
                    value: userInput.parsedValue,
                    operator: userInput.operator
                }, {
                    key: userInput.formattedValue, 
                    text: userInput.formattedValue
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