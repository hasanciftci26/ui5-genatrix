import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import JSONModel from "sap/ui/model/json/JSONModel";
import ValidateException from "sap/ui/model/ValidateException";
import ValidationLogicalOperator from "ui5/genatrix/metadata/form/enum/ValidationLogicalOperator";
import ValidationOperator from "ui5/genatrix/metadata/form/enum/ValidationOperator";
import { ValidationLogicSettings } from "ui5/genatrix/types/metadata/form/ValidationLogic.types";
import { EntityProperty } from "ui5/genatrix/types/odata/v2/MetadataParser.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.metadata.form
 */
export default class ValidationLogic extends ManagedObject {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            propertyName: { type: "string" },
            operator: { type: "ui5.genatrix.metadata.form.enum.ValidationOperator", defaultValue: ValidationOperator.EQ },
            value1: { type: "any" },
            value2: { type: "any" },
            errorMessage: { type: "string" },
            logicalOperator: { type: "ui5.genatrix.metadata.form.enum.ValidationLogicalOperator", defaultValue: ValidationLogicalOperator.And },
            validator: { type: "function" }
        },
        aggregations: {
            conditions: { type: "ui5.genatrix.metadata.form.ValidationCondition", multiple: true, singularName: "condition" }
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

        const conditions = this.getConditions();
        const logicalOperator = this.getLogicalOperator() || ValidationLogicalOperator.And;
        const conditionsSatisfied = conditions.length === 0 ||
            (logicalOperator === ValidationLogicalOperator.And ? conditions.every(cond => cond.check()) : conditions.some(cond => cond.check()));

        if (!conditionsSatisfied) {
            this.hideBusy(property, busyModel);
            return;
        }

        if (!this.isValid(value)) {
            this.hideBusy(property, busyModel);
            this.throwValidationError();
        }

        this.hideBusy(property, busyModel);
    }

    private isValid(value: any) {
        return true;
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
}