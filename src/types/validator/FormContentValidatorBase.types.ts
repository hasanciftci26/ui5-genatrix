import Model from "sap/ui/model/Model";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";

export type FormContentValidatorBaseSettings<T extends Model = Model> = {
    generator: FormContentGeneratorBase;
    model: T;
    validateOnlyVisible: boolean;
};