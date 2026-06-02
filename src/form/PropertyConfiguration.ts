import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import PropertyConfigurationBase from "ui5/genatrix/interface/PropertyConfigurationBase";
import { PropertyConfigurationSettings } from "ui5/genatrix/types/form/PropertyConfiguration.types";

/**
 * @namespace ui5.genatrix.form
 */
export default class PropertyConfiguration extends ManagedObject implements PropertyConfigurationBase {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            name: { type: "string" },
            label: { type: "string" },
            required: { type: "boolean", defaultValue: false },
            readonly: { type: "boolean", defaultValue: false },
            excluded: { type: "boolean", defaultValue: false },
            datePattern: { type: "string" },
            timePattern: { type: "string" },
            dateTimeSeparator: { type: "string", defaultValue: " " },
            dateFirst: { type: "boolean", defaultValue: true },
            groupingEnabled: { type: "boolean", defaultValue: true },
            groupingSeparator: { type: "string" },
            groupingSize: { type: "int", defaultValue: 3 },
            decimalSeparator: { type: "string" },
            parseEmptyValueToZero: { type: "boolean", defaultValue: false },
            maximumValue: { type: "string" },
            minimumValue: { type: "string" }
        }
    };

    constructor(settings?: PropertyConfigurationSettings);
    constructor(id?: string, settings?: PropertyConfigurationSettings);

    constructor(idOrSettings?: string | PropertyConfigurationSettings, settings?: PropertyConfigurationSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}