import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { LogicalOperator } from "ui5/genatrix/form/enum/LogicalOperator";
import { PropertyConstraintType } from "ui5/genatrix/form/enum/PropertyConstraintType";
import PropertyConstraintRule from "ui5/genatrix/form/PropertyConstraintRule";
import {
    AggregationBinder,
    AggregationDestroyer,
    AggregationGetterMulti,
    AggregationInserter,
    AggregationRemoverAll,
    AggregationRemoverSingle,
    AggregationSetterOrAdder,
    OptionalPropertyGetter,
    OptionalPropertySetter,
    PropertyGetter,
    PropertySetter
} from "ui5/genatrix/types/global/CustomClass.types";

export type PropertyConstraintSettings = $ManagedObjectSettings & {
    name?: string | PropertyBindingInfo | `{${string}}`;
    type?: PropertyConstraintType | keyof typeof PropertyConstraintType | PropertyBindingInfo | `{${string}}`;
    logicalOperator?: LogicalOperator | keyof typeof LogicalOperator | PropertyBindingInfo | `{${string}}`;
    rules?: PropertyConstraintRule[];
};

declare module "ui5/genatrix/form/PropertyConstraint" {
    export default interface PropertyConstraint {
        getName: OptionalPropertyGetter<string>;
        setName: OptionalPropertySetter<string, PropertyConstraint>;

        getType: PropertyGetter<PropertyConstraintType | keyof typeof PropertyConstraintType>;
        setType: PropertySetter<PropertyConstraintType | keyof typeof PropertyConstraintType, PropertyConstraint>;

        getLogicalOperator: PropertyGetter<LogicalOperator | keyof typeof LogicalOperator>;
        setLogicalOperator: PropertySetter<LogicalOperator | keyof typeof LogicalOperator, PropertyConstraint>;

        getRules: AggregationGetterMulti<PropertyConstraintRule>;
        addRule: AggregationSetterOrAdder<PropertyConstraintRule, PropertyConstraint>;
        insertRule: AggregationInserter<PropertyConstraintRule, PropertyConstraint>;
        bindRules: AggregationBinder<PropertyConstraint>;
        removeRule: AggregationRemoverSingle<PropertyConstraintRule>;
        removeAllRules: AggregationRemoverAll<PropertyConstraintRule>;
        destroyRules: AggregationDestroyer<PropertyConstraint>;
    }
}