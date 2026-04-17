import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { ValueListSettings } from "ui5/genatrix/types/metadata/form/ValueList.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValueList extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
            entitySet: { type: "string" },
            searchSupported: { type: "boolean", defaultValue: true },
            caseSensitiveSearch: { type: "boolean", defaultValue: false },
            title: { type: "string" },
            valueListWithFixedValues: { type: "boolean", defaultValue: false }
        },
        defaultAggregation: "parameters",
        aggregations: {
            parameters: { type: "ui5.genatrix.metadata.form.ValueListParameter", multiple: true, singularName: "parameter" }
        }
    };

    constructor(settings?: ValueListSettings);
    constructor(id?: string, settings?: ValueListSettings);

    constructor(idOrSettings?: string | ValueListSettings, settings?: ValueListSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async open() {
        
    }
}