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
import LogicalOperator from "ui5/genatrix/metadata/enum/validationlogic/LogicalOperator";
import Operator from "ui5/genatrix/metadata/enum/validationlogic/Operator";
import ValidationCondition from "ui5/genatrix/metadata/form/ValidationCondition";

export type ValidatorFunction = (value: any) => Promise<boolean> | boolean;
export type OperatorType = typeof Operator[keyof typeof Operator];
export type LogicalOperatorType = typeof LogicalOperator[keyof typeof LogicalOperator];

export type ValidationLogicSettings = $ManagedObjectSettings & {
    propertyName?: string;
    operator?: OperatorType;
    value1?: any;
    value2?: any;
    errorMessage?: string;
    logicalOperator?: LogicalOperatorType;
    validator?: ValidatorFunction;
    conditions?: ValidationCondition[];
};

declare module "ui5/genatrix/metadata/form/ValidationLogic" {
    export default interface ValidationLogic {
        getPropertyName: OptionalPropertyGetter<string>;
        setPropertyName: OptionalPropertySetter<string, ValidationLogic>;
        getOperator: OptionalPropertyGetter<OperatorType>;
        setOperator: OptionalPropertySetter<OperatorType, ValidationLogic>;
        getValue1: OptionalPropertyGetter<any>;
        setValue1: OptionalPropertySetter<any, ValidationLogic>;
        getValue2: OptionalPropertyGetter<any>;
        setValue2: OptionalPropertySetter<any, ValidationLogic>;
        getErrorMessage: OptionalPropertyGetter<string>;
        setErrorMessage: OptionalPropertySetter<string, ValidationLogic>;
        getLogicalOperator: OptionalPropertyGetter<LogicalOperatorType>;
        setLogicalOperator: OptionalPropertySetter<LogicalOperatorType, ValidationLogic>;
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