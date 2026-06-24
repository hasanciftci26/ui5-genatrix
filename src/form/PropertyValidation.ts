import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import Context from "sap/ui/model/Context";
import ValidateException from "sap/ui/model/ValidateException";
import EmbeddedForm from "ui5/genatrix/form/EmbeddedForm";
import { ComparisonOperator } from "ui5/genatrix/form/enum/ComparisonOperator";
import { LogicalOperator } from "ui5/genatrix/form/enum/LogicalOperator";
import PropertyRuleEvaluator from "ui5/genatrix/form/PropertyRuleEvaluator";
import { EvaluateSettings, PropertyValidationSettings } from "ui5/genatrix/types/form/PropertyValidation.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.form
 */
export default class PropertyValidation extends ManagedObject {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            name: { type: "string" },
            comparisonOperator: { type: "ui5.genatrix.form.enum.ComparisonOperator", defaultValue: ComparisonOperator.EQ },
            value1: { type: "any" },
            value2: { type: "any" },
            errorMessage: { type: "string", defaultValue: LibraryBundle.getText("genatrix.error.validation") },
            logicalOperator: { type: "ui5.genatrix.form.enum.LogicalOperator", defaultValue: LogicalOperator.And },
            validator: { type: "function", bindable: false }
        },
        defaultAggregation: "rules",
        aggregations: {
            rules: { type: "ui5.genatrix.form.PropertyValidationRule", multiple: true, singularName: "rule" }
        }
    };
    private readonly evaluator = new PropertyRuleEvaluator();

    constructor(settings?: PropertyValidationSettings);
    constructor(id?: string, settings?: PropertyValidationSettings);

    constructor(idOrSettings?: string | PropertyValidationSettings, settings?: PropertyValidationSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async evaluate(settings: EvaluateSettings) {
        const validator = this.getValidator();
        this.getOwnerParent().showPropertyBusy(settings.property.name);

        if (validator) {
            const valid = await Promise.resolve(validator(settings.value));
            this.getOwnerParent().hidePropertyBusy(settings.property.name);

            if (!valid) {
                this.throwValidationError();
            }

            return;
        }

        const rules = this.getRules();
        const context = this.getContextFromParent();
        const logicalOperator = this.getLogicalOperator();

        const rulesSatisfied = rules.length === 0 ||
            (logicalOperator === LogicalOperator.And ? rules.every(cond => cond.check(context)) : rules.some(cond => cond.check(context)));

        if (!rulesSatisfied) {
            this.getOwnerParent().hidePropertyBusy(settings.property.name);
            return;
        }

        if (!this.isValid(context, settings.value)) {
            this.getOwnerParent().hidePropertyBusy(settings.property.name);
            this.throwValidationError();
        }

        this.getOwnerParent().hidePropertyBusy(settings.property.name);
    }

    private isValid(context: Context, value: any) {
        return this.evaluator.run({
            rawPropertyValue: value,
            comparisonOperator: this.getComparisonOperator(),
            rawValue1: this.getValue1(),
            rawValue2: this.getValue2(),
            context: context
        });
    }

    private throwValidationError(): never {
        throw new ValidateException(this.getErrorMessage());
    }

    private getOwnerParent() {
        return this.getParent() as EmbeddedForm;
    }

    private getContextFromParent() {
        return this.getOwnerParent().getContext();
    }
}