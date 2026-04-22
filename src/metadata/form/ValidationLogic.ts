import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import JSONModel from "sap/ui/model/json/JSONModel";
import ValidateException from "sap/ui/model/ValidateException";
import DialogForm from "ui5/genatrix/control/v2/form/DialogForm";
import LogicalOperator from "ui5/genatrix/metadata/enum/validationlogic/LogicalOperator";
import Operator from "ui5/genatrix/metadata/enum/validationlogic/Operator";
import { ValidationLogicSettings } from "ui5/genatrix/types/metadata/form/ValidationLogic.types";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";
import ContextV2 from "sap/ui/model/odata/v2/Context";
import ContextV4 from "sap/ui/model/odata/v4/Context";
import ValidationEngine from "ui5/genatrix/metadata/form/ValidationEngine";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValidationLogic extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
            operator: { type: "ui5.genatrix.metadata.enum.validationlogic.Operator", defaultValue: Operator.EQ },
            value1: { type: "any" },
            value2: { type: "any" },
            errorMessage: { type: "string" },
            logicalOperator: { type: "ui5.genatrix.metadata.enum.validationlogic.LogicalOperator", defaultValue: LogicalOperator.And },
            validator: { type: "function" }
        },
        defaultAggregation: "conditions",
        aggregations: {
            conditions: { type: "ui5.genatrix.metadata.form.ValidationCondition", multiple: true, singularName: "condition" }
        }
    };
    private readonly engine = new ValidationEngine();

    constructor(settings?: ValidationLogicSettings);
    constructor(id?: string, settings?: ValidationLogicSettings);

    constructor(idOrSettings?: string | ValidationLogicSettings, settings?: ValidationLogicSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public async evaluate(property: EntityProperty, busyModel: JSONModel, value: any) {
        const validator = this.getValidator();
        this.showBusy(property, busyModel);

        if (validator) {
            const valid = await Promise.resolve(validator(value));
            this.hideBusy(property, busyModel);

            if (!valid) {
                this.throwValidationError();
            }

            return;
        }

        const context = this.getContextFromParent();
        const conditions = this.getConditions();
        const logicalOperator = this.getLogicalOperator() || LogicalOperator.And;
        const conditionsSatisfied = conditions.length === 0 ||
            (logicalOperator === LogicalOperator.And ? conditions.every(cond => cond.check(context)) : conditions.some(cond => cond.check(context)));

        if (!conditionsSatisfied) {
            this.hideBusy(property, busyModel);
            return;
        }

        if (!this.isValid(context, value)) {
            this.hideBusy(property, busyModel);
            this.throwValidationError();
        }

        this.hideBusy(property, busyModel);
    }

    private isValid(context: ContextV2 | ContextV4, value: any) {
        return this.engine.run({
            rawPropertyValue: value,
            operator: this.getOperator() || Operator.EQ,
            rawValue1: this.getValue1(),
            rawValue2: this.getValue2(),
            context: context
        });
    }

    private showBusy(property: EntityProperty, busyModel: JSONModel) {
        busyModel.setProperty(`/${property.name}`, true);
    }

    private hideBusy(property: EntityProperty, busyModel: JSONModel) {
        busyModel.setProperty(`/${property.name}`, false);
    }

    private throwValidationError(): never {
        throw new ValidateException(this.getErrorMessage() || LibraryBundle.getText("genatrix.error.validation"));
    }

    private getContextFromParent() {
        const parent = this.getParent() as DialogForm;
        return parent.getContext();
    }
}