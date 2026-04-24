import MultiInput, { $MultiInputSettings } from "sap/m/MultiInput";
import Filter from "sap/ui/model/Filter";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import CustomFBToken from "ui5/genatrix/control/extension/CustomFBToken";
import CustomFilterBarField from "ui5/genatrix/odata/type/CustomFilterBarField";
import { CustomFilterBarFieldSettings } from "ui5/genatrix/types/odata/type/CustomTypeSettings.types";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomFBMultiInput extends MultiInput {
    static readonly renderer = {};
    private readonly propertyName: string;

    constructor(propertyName: string, settings?: $MultiInputSettings);
    constructor(propertyName: string, id?: string, settings?: $MultiInputSettings);

    constructor(propertyName: string, idOrSettings?: string | $MultiInputSettings, settings?: $MultiInputSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.propertyName = propertyName;
    }

    public static createInstance(propertyName: string, modelName: string, settings: CustomFilterBarFieldSettings) {
        const instance = new CustomFBMultiInput(propertyName, {
            value: {
                path: `${modelName}>/${settings.property.name}`,
                type: new CustomFilterBarField(settings)
            }
        });

        instance.addValidator(() => {
            try {
                const userInput = instance.getUserInput();

                return new CustomFBToken(propertyName, {
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

    public getFilter(caseSensitive: boolean) {
        const filters = (this.getTokens() as CustomFBToken[]).map(token => token.getFilter(caseSensitive));

        if (filters.length) {
            return new Filter({ filters: filters, and: false });
        }
    }

    public addInitialToken(value: any) {
        try {
            const binding = this.getBinding("value") as PropertyBinding;
            const type = binding.getType() as CustomFilterBarField;
            const parsedValue = type.parseValue(value, "string");

            void type.validateValue(parsedValue);

            this.addToken(new CustomFBToken(this.propertyName, {
                key: type.formatValue(parsedValue, "string"),
                text: type.formatValue(parsedValue, "string"),
                filterValue: parsedValue,
                filterOperator: "EQ"
            }));

            return true;
        } catch {
            return false;
        }
    }
}