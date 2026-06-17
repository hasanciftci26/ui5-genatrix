import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { ComparisonOperator } from "ui5/genatrix/form/enum/ComparisonOperator";
import { OptionalPropertyGetter, OptionalPropertySetter, PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/CustomClass.types";

export type PropertyConstraintRuleSettings = $ManagedObjectSettings & {
    dependsOn?: string | PropertyBindingInfo | `{${string}}`;
    comparisonOperator?: ComparisonOperator | keyof typeof ComparisonOperator | PropertyBindingInfo | `{${string}}`;
    value1?: any | PropertyBindingInfo | `{${string}}`;
    value2?: any | PropertyBindingInfo | `{${string}}`;
};

declare module "ui5/genatrix/form/PropertyConstraintRule" {
    export default interface PropertyConstraintRule {
        getDependsOn: OptionalPropertyGetter<string>;
        setDependsOn: OptionalPropertySetter<string, PropertyConstraintRule>;

        getComparisonOperator: PropertyGetter<ComparisonOperator | keyof typeof ComparisonOperator>;
        setComparisonOperator: PropertySetter<ComparisonOperator | keyof typeof ComparisonOperator, PropertyConstraintRule>;

        getValue1: OptionalPropertyGetter<any>;
        setValue1: OptionalPropertySetter<any, PropertyConstraintRule>;

        getValue2: OptionalPropertyGetter<any>;
        setValue2: OptionalPropertySetter<any, PropertyConstraintRule>;
    }
}