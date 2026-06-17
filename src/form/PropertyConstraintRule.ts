import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { ComparisonOperator } from "ui5/genatrix/form/enum/ComparisonOperator";
import { PropertyConstraintRuleSettings } from "ui5/genatrix/types/form/PropertyConstraintRule.types";

/**
 * @namespace ui5.genatrix.form
 */
export default class PropertyConstraintRule extends ManagedObject {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            dependsOn: { type: "string" },
            comparisonOperator: { type: "ui5.genatrix.form.enum.ComparisonOperator", defaultValue: ComparisonOperator.EQ },
            value1: { type: "any" },
            value2: { type: "any" }
        }
    };

    constructor(settings?: PropertyConstraintRuleSettings);
    constructor(id?: string, settings?: PropertyConstraintRuleSettings);

    constructor(idOrSettings?: string | PropertyConstraintRuleSettings, settings?: PropertyConstraintRuleSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}