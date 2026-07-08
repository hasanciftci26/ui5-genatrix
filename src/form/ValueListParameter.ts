import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { ParameterType } from "ui5/genatrix/form/enum/ParameterType";
import { ValueListParameterSettings } from "ui5/genatrix/types/form/ValueListParameter.types";

/**
 * @namespace ui5.genatrix.form
 */
export default class ValueListParameter extends ManagedObject {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            type: { type: "ui5.genatrix.form.enum.ParameterType", defaultValue: ParameterType.InOut },
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