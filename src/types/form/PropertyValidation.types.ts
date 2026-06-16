import { $ManagedObjectSettings, PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { ComparisonOperator } from "ui5/genatrix/form/enum/ComparisonOperator";
import { LogicalOperator } from "ui5/genatrix/form/enum/LogicalOperator";
import { OptionalPropertyGetter, OptionalPropertySetter, PropertyGetter, PropertySetter } from "ui5/genatrix/types/global/CustomClass.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

export type EvaluateSettings = {
    property: EntityTypeProperty;
    value: any;
};

export type PropertyValidationSettings = $ManagedObjectSettings & {
    name?: string | PropertyBindingInfo | `{${string}}`;
    comparisonOperator?: ComparisonOperator | keyof typeof ComparisonOperator | PropertyBindingInfo | `{${string}}`;
    value1?: any | PropertyBindingInfo | `{${string}}`;
    value2?: any | PropertyBindingInfo | `{${string}}`;
    errorMessage?: string | PropertyBindingInfo | `{${string}}`;
    logicalOperator?: LogicalOperator | keyof typeof LogicalOperator | PropertyBindingInfo | `{${string}}`;
    validator?: (value: any) => Promise<boolean> | boolean;
};

declare module "ui5/genatrix/form/PropertyValidation" {
    export default interface PropertyValidation {
        getName: OptionalPropertyGetter<string>;
        setName: OptionalPropertySetter<string, PropertyValidation>;

        getComparisonOperator: PropertyGetter<ComparisonOperator | keyof typeof ComparisonOperator>;
        setComparisonOperator: PropertySetter<ComparisonOperator | keyof typeof ComparisonOperator, PropertyValidation>;

        getValue1: OptionalPropertyGetter<any>;
        setValue1: OptionalPropertySetter<any, PropertyValidation>;

        getValue2: OptionalPropertyGetter<any>;
        setValue2: OptionalPropertySetter<any, PropertyValidation>;

        getErrorMessage: PropertyGetter<string>;
        setErrorMessage: PropertySetter<string, PropertyValidation>;

        getLogicalOperator: PropertyGetter<LogicalOperator | keyof typeof LogicalOperator>;
        setLogicalOperator: PropertySetter<LogicalOperator | keyof typeof LogicalOperator, PropertyValidation>;

        getValidator: OptionalPropertyGetter<(value: any) => Promise<boolean> | boolean>;
        setValidator: OptionalPropertySetter<(value: any) => Promise<boolean> | boolean, PropertyValidation>;
    }
}