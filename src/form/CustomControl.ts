import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { CustomControlSettings } from "ui5/genatrix/types/form/CustomControl.types";

/**
 * @namespace ui5.genatrix.form
 */
export default class CustomControl extends ManagedObject {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            name: { type: "string" },
            validator: { type: "function", bindable: false }
        },
        defaultAggregation: "control",
        aggregations: {
            control: { type: "sap.ui.core.Control", multiple: false }
        }
    };

    constructor(settings?: CustomControlSettings);
    constructor(id?: string, settings?: CustomControlSettings);

    constructor(idOrSettings?: string | CustomControlSettings, settings?: CustomControlSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}