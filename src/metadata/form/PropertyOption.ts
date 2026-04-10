import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { PropertyOptionSettings } from "ui5/genatrix/types/metadata/form/PropertyOption.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class PropertyOption extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
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
            parseEmptyValueToZero: { type: "boolean", defaultValue: false }
        }
    };

    constructor(settings?: PropertyOptionSettings);
    constructor(id?: string, settings?: PropertyOptionSettings);

    constructor(idOrSettings?: string | PropertyOptionSettings, settings?: PropertyOptionSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}