import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { FormGroupSettings } from "ui5/genatrix/types/metadata/form/FormGroup.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class FormGroup extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            title: { type: "string" },
            propertyList: { type: "string" },
            index: { type: "int" }
        }
    };

    constructor(settings?: FormGroupSettings);
    constructor(id?: string, settings?: FormGroupSettings);

    constructor(idOrSettings?: string | FormGroupSettings, settings?: FormGroupSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}