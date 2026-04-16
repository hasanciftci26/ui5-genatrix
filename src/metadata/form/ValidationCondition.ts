import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ValidationOperator from "ui5/genatrix/metadata/form/enum/ValidationOperator";
import { ValidationConditionSettings } from "ui5/genatrix/types/metadata/form/ValidationCondition.types";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValidationCondition extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
            operator: { type: "ui5.genatrix.metadata.form.enum.ValidationOperator", defaultValue: ValidationOperator.EQ },
            value1: { type: "any" },
            value2: { type: "any" }
        }
    };

    constructor(settings?: ValidationConditionSettings);
    constructor(id?: string, settings?: ValidationConditionSettings);

    constructor(idOrSettings?: string | ValidationConditionSettings, settings?: ValidationConditionSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public check() {
        return true;
    }
}