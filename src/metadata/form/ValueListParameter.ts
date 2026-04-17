import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ValueListParameterType from "ui5/genatrix/metadata/form/enum/ValueListParameterType";
import { ValueListParameterSettings } from "ui5/genatrix/types/metadata/form/ValueListParameter.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValueListParameter extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            type: { type: "ui5.genatrix.metadata.form.enum.ValueListParameterType", defaultValue: ValueListParameterType.InOut },
            localDataProperty: { type: "string" },
            valueListProperty: { type: "string" }
        }
    };

    constructor(settings?: ValueListParameterSettings);
    constructor(id?: string, settings?: ValueListParameterSettings);

    constructor(idOrSettings?: string | ValueListParameterSettings, settings?: ValueListParameterSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}