import Input from "sap/m/Input";
import { MetadataOptions } from "sap/ui/core/Element";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import CustomFilterBarField from "ui5/genatrix/odata/type/CustomFilterBarField";
import { CustomFBInputSettings } from "ui5/genatrix/types/control/extension/CustomFBInput.types";
import { CustomFilterBarFieldSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomFBInput extends Input {
    public static readonly metadata: MetadataOptions = {
        properties: {
            propertyName: { type: "string" }
        }
    };
    public static readonly renderer = {};

    constructor(settings?: CustomFBInputSettings);
    constructor(id?: string, settings?: CustomFBInputSettings);

    constructor(idOrSettings?: string | CustomFBInputSettings, settings?: CustomFBInputSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public static createInstance(modelName: string, settings: CustomFilterBarFieldSettings) {
        const instance = new CustomFBInput({
            propertyName: settings.property.name,
            showValueHelp: true,
            value: {
                path: `${modelName}>/${settings.property.name}`,
                type: new CustomFilterBarField(settings)
            }
        });

        return instance;
    }

    public getFilter(caseSensitive: boolean) {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as CustomFilterBarField;
        const parsedValue = type.parseValue(value, "string");
        const operator = type.getFilterOperator();

        void type.validateValue(parsedValue);

        if (parsedValue != null) {
            if (operator === FilterOperator.BT || operator === FilterOperator.NB) {
                const [low, high] = (parsedValue as string).split("...");

                return new Filter({
                    path: this.getPropertyName(),
                    operator: operator,
                    value1: Number(low),
                    value2: Number(high)
                });
            } else {
                return new Filter({
                    path: this.getPropertyName(),
                    operator: operator,
                    value1: parsedValue,
                    caseSensitive: caseSensitive
                });
            }
        }
    }

    public setInitialValue(value: any) {
        try {
            const binding = this.getBinding("value") as PropertyBinding;
            const type = binding.getType() as CustomFilterBarField;
            const parsedValue = type.parseValue(value, "string");

            void type.validateValue(parsedValue);
            this.setValue(parsedValue);

            return true;
        } catch {
            return false;
        }
    }
}