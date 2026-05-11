import Input from "sap/m/Input";
import { MetadataOptions } from "sap/ui/core/Element";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import CustomValueList from "ui5/genatrix/odata/type/CustomValueList";
import { CustomInputSettings } from "ui5/genatrix/types/control/extension/CustomInput.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.control.extension
 */
export default class CustomInput extends Input {
    public static readonly metadata: MetadataOptions = {
        properties: {
            propertyName: { type: "string" },
            valueListInstance: { type: "object" }
        }
    };
    public static readonly renderer = {};

    constructor(settings?: CustomInputSettings);
    constructor(id?: string, settings?: CustomInputSettings);

    constructor(idOrSettings?: string | CustomInputSettings, settings?: CustomInputSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async checkValuesValidity() {
        const valueList = this.getValueListInstance();

        if (valueList) {
            const binding = this.getBinding("selectedKey") as PropertyBinding;
            const selectedKey = this.getProperty("selectedKey");
            const value = this.getProperty("value");
            const type = binding.getType() as CustomValueList;

            if (!selectedKey && value) {
                const success = await valueList.validateValueList(this, value);

                if (!success) {
                    throw new Error(LibraryBundle.getText("genatrix.error.invalidValue"));
                }
            }

            await type.validateValue(type.parseValue(selectedKey, "string"));
        } else {
            const binding = this.getBinding("value") as PropertyBinding;
            const value = this.getProperty("value");
            const type = binding.getType() as SimpleType;

            await type.validateValue(type.parseValue(value, "string"));
        }
    }
}