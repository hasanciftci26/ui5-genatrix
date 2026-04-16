import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import {
    AggregationBinder,
    AggregationDestroyer,
    AggregationGetterMulti,
    AggregationInserter,
    AggregationRemoverAll,
    AggregationRemoverSingle,
    AggregationSetterOrAdder,
    OptionalPropertyGetter,
    OptionalPropertySetter
} from "ui5/genatrix/types/global/ManagedObjectClass.types";
import ValidationLogicalOperator from "ui5/genatrix/metadata/form/enum/ValidationLogicalOperator";
import ValidationOperator from "ui5/genatrix/metadata/form/enum/ValidationOperator";
import ValidationCondition from "ui5/genatrix/metadata/form/ValidationCondition";

export type ValidatorFunction = (value: any) => Promise<boolean> | boolean;
export type ValidationOperatorType = typeof ValidationOperator[keyof typeof ValidationOperator];
export type ValidationLogicalOperatorType = typeof ValidationLogicalOperator[keyof typeof ValidationLogicalOperator];

export type ValidationLogicSettings = $ManagedObjectSettings & {
    propertyName?: string;
    operator?: ValidationOperatorType;
    value1?: any;
    value2?: any;
    errorMessage?: string;
    logicalOperator?: ValidationLogicalOperatorType;
    validator?: ValidatorFunction;
    conditions?: ValidationCondition[];
};

declare module "ui5/genatrix/metadata/form/ValidationLogic" {
    export default interface ValidationLogic {
        getPropertyName: OptionalPropertyGetter<string>;
        setPropertyName: OptionalPropertySetter<string, ValidationLogic>;
        getOperator: OptionalPropertyGetter<ValidationOperatorType>;
        setOperator: OptionalPropertySetter<ValidationOperatorType, ValidationLogic>;
        getValue1: OptionalPropertyGetter<any>;
        setValue1: OptionalPropertySetter<any, ValidationLogic>;
        getValue2: OptionalPropertyGetter<any>;
        setValue2: OptionalPropertySetter<any, ValidationLogic>;
        getErrorMessage: OptionalPropertyGetter<string>;
        setErrorMessage: OptionalPropertySetter<string, ValidationLogic>;
        getLogicalOperator: OptionalPropertyGetter<ValidationLogicalOperatorType>;
        setLogicalOperator: OptionalPropertySetter<ValidationLogicalOperatorType, ValidationLogic>;
        getValidator: OptionalPropertyGetter<ValidatorFunction>;
        setValidator: OptionalPropertySetter<ValidatorFunction, ValidationLogic>;

        getConditions: AggregationGetterMulti<ValidationCondition>;
        addCondition: AggregationSetterOrAdder<ValidationCondition, ValidationLogic>;
        insertCondition: AggregationInserter<ValidationCondition, ValidationLogic>;
        bindConditions: AggregationBinder<ValidationLogic>;
        removeCondition: AggregationRemoverSingle<ValidationCondition>;
        removeAllConditions: AggregationRemoverAll<ValidationCondition>;
        destroyConditions: AggregationDestroyer<ValidationLogic>;
    }
}