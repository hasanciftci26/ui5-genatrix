import Model from "sap/ui/model/Model";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";

export type FormContentValidatorBaseSettings<T extends Model = Model> = {
    model: T;
    validateOnlyVisible: boolean;
    generator: FormContentGeneratorBase<T>;
};