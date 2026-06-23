import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import Context from "sap/ui/model/Context";
import { ComparisonOperator } from "ui5/genatrix/form/enum/ComparisonOperator";
import PropertyRuleEvaluator from "ui5/genatrix/form/PropertyRuleEvaluator";
import { PropertyValidationRuleSettings } from "ui5/genatrix/types/form/PropertyValidationRule.types";

/**
 * @namespace ui5.genatrix.form
 */
export default class PropertyValidationRule extends ManagedObject {
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
    private readonly evaluator = new PropertyRuleEvaluator();

    constructor(settings?: PropertyValidationRuleSettings);
    constructor(id?: string, settings?: PropertyValidationRuleSettings);

    constructor(idOrSettings?: string | PropertyValidationRuleSettings, settings?: PropertyValidationRuleSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public check(context: Context) {
        const dependsOn = this.getDependsOn();

        if (!dependsOn) {
            return false;
        }

        return this.evaluator.run({
            rawPropertyValue: context.getProperty(dependsOn),
            comparisonOperator: this.getComparisonOperator(),
            rawValue1: this.getValue1(),
            rawValue2: this.getValue2(),
            context: context
        });
    }
}