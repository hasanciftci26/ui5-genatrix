import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ContextV2 from "sap/ui/model/odata/v2/Context";
import ContextV4 from "sap/ui/model/odata/v4/Context";
import ValidationOperator from "ui5/genatrix/metadata/form/enum/ValidationOperator";
import ValidationEngine from "ui5/genatrix/metadata/form/ValidationEngine";
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
    private readonly engine = new ValidationEngine();

    constructor(settings?: ValidationConditionSettings);
    constructor(id?: string, settings?: ValidationConditionSettings);

    constructor(idOrSettings?: string | ValidationConditionSettings, settings?: ValidationConditionSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public check(context: ContextV2 | ContextV4) {
        const propertyName = this.getPropertyName();

        if (!propertyName) {
            return false;
        }

        return this.engine.run({
            rawPropertyValue: context.getProperty(propertyName),
            operator: this.getOperator() || ValidationOperator.EQ,
            rawValue1: this.getValue1(),
            rawValue2: this.getValue2(),
            context: context
        });
    }
}