import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { OptionalPropertyGetter, OptionalPropertySetter } from "ui5/genatrix/types/global/ManagedObjectClass.types";
import { ValidationOperatorType } from "ui5/genatrix/types/metadata/form/ValidationLogic.types";

export type ValidationConditionSettings = $ManagedObjectSettings & {
    propertyName?: string;
    operator?: ValidationOperatorType;
    value1?: any;
    value2?: any;
};

declare module "ui5/genatrix/metadata/form/ValidationCondition" {
    export default interface ValidationCondition {
        getPropertyName: OptionalPropertyGetter<string>;
        setPropertyName: OptionalPropertySetter<string, ValidationCondition>;
        getOperator: OptionalPropertyGetter<ValidationOperatorType>;
        setOperator: OptionalPropertySetter<ValidationOperatorType, ValidationCondition>;
        getValue1: OptionalPropertyGetter<any>;
        setValue1: OptionalPropertySetter<any, ValidationCondition>;
        getValue2: OptionalPropertyGetter<any>;
        setValue2: OptionalPropertySetter<any, ValidationCondition>;
    }
}