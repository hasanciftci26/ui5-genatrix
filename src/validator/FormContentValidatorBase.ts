import BaseObject from "sap/ui/base/Object";
import Model from "sap/ui/model/Model";
import { FormContentValidatorBaseSettings } from "ui5/genatrix/types/validator/FormContentValidatorBase.types";

/**
 * @namespace ui5.genatrix.validator
 */
export default abstract class FormContentValidatorBase<T extends Model = Model> extends BaseObject {
    private readonly settings: FormContentValidatorBaseSettings<T>;

    constructor(settings: FormContentValidatorBaseSettings<T>) {
        super();
        this.settings = settings;
    }

    public abstract validate(): Promise<void>;

    protected getModel() {
        return this.settings.model;
    }
}