import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import ComparisonOperator from "ui5/genatrix/form/enum/ComparisonOperator";
import LogicalOperator from "ui5/genatrix/form/enum/LogicalOperator";
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
        }
    };

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

    }
}