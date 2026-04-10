import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import Validator from "ui5/genatrix/interface/metadata/form/Validator";
import { ValidationLogicSettings } from "ui5/genatrix/types/metadata/form/v2/ValidationLogic.types";

/**
 * @namespace ui5.genatrix.metadata.form.v2
 */
export default class ValidationLogic extends ManagedObject implements Validator {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" }
        }
    };

    constructor(settings?: ValidationLogicSettings);
    constructor(id?: string, settings?: ValidationLogicSettings);

    constructor(idOrSettings?: string | ValidationLogicSettings, settings?: ValidationLogicSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async evaluate(value: any) {

    }
}