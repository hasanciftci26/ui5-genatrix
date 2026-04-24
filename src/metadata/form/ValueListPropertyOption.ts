import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import FilterRestriction from "ui5/genatrix/metadata/enum/valuelist/FilterRestriction";
import { ValueListPropertyOptionSettings } from "ui5/genatrix/types/metadata/form/ValueListPropertyOption.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValueListPropertyOption extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
            label: { type: "string" },
            filterRestriction: { type: "ui5.genatrix.metadata.enum.valuelist.FilterRestriction", defaultValue: FilterRestriction.MultiValue },
            filterable: { type: "boolean", defaultValue: true }
        }
    };

    constructor(settings?: ValueListPropertyOptionSettings);
    constructor(id?: string, settings?: ValueListPropertyOptionSettings);

    constructor(idOrSettings?: string | ValueListPropertyOptionSettings, settings?: ValueListPropertyOptionSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}