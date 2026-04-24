import Input, { $InputSettings } from "sap/m/Input";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import CustomFilterBarField from "ui5/genatrix/odata/type/CustomFilterBarField";
import { CustomFilterBarFieldSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomFBInput extends Input {
    static readonly renderer = {};
    private readonly propertyName: string;

    constructor(propertyName: string, settings?: $InputSettings);
    constructor(propertyName: string, id?: string, settings?: $InputSettings);

    constructor(propertyName: string, idOrSettings?: string | $InputSettings, settings?: $InputSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.propertyName = propertyName;
    }

    public static createInstance(propertyName: string, modelName: string, settings: CustomFilterBarFieldSettings) {
        const instance = new CustomFBInput(propertyName, {
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
                    path: this.propertyName,
                    operator: operator,
                    value1: Number(low),
                    value2: Number(high)
                });
            } else {
                return new Filter({
                    path: this.propertyName,
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