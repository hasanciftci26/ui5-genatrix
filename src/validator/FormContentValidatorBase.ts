import BaseObject from "sap/ui/base/Object";
import { FormContentValidatorBaseSettings } from "ui5/genatrix/types/validator/FormContentValidatorBase.types";

/**
 * @namespace ui5.genatrix.validator
 */
export default abstract class FormContentValidatorBase extends BaseObject {
    private readonly settings: FormContentValidatorBaseSettings;

    constructor(settings: FormContentValidatorBaseSettings) {
        super();
        this.settings = settings;
    }

    public abstract validate(): Promise<void>;
}