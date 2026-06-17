import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import { LogicalOperator } from "ui5/genatrix/form/enum/LogicalOperator";
import { PropertyConstraintType } from "ui5/genatrix/form/enum/PropertyConstraintType";
import { PropertyConstraintSettings } from "ui5/genatrix/types/form/PropertyConstraint.types";

/**
 * @namespace ui5.genatrix.form
 */
export default class PropertyConstraint extends ManagedObject {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        final: true,
        properties: {
            name: { type: "string" },
            type: { type: "ui5.genatrix.form.enum.PropertyConstraintType", defaultValue: PropertyConstraintType.Required },
            logicalOperator: { type: "ui5.genatrix.form.enum.LogicalOperator", defaultValue: LogicalOperator.And }
        },
        defaultAggregation: "rules",
        aggregations: {
            rules: { type: "ui5.genatrix.form.PropertyConstraintRule", multiple: true, singularName: "rule" }
        }
    };

    constructor(settings?: PropertyConstraintSettings);
    constructor(id?: string, settings?: PropertyConstraintSettings);

    constructor(idOrSettings?: string | PropertyConstraintSettings, settings?: PropertyConstraintSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }
}