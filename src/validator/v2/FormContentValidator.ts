import BaseObject from "sap/ui/base/Object";
import FormContentGenerator from "ui5/genatrix/generator/v2/FormContentGenerator";
import { FormContentValidatorSettings } from "ui5/genatrix/types/validator/v2/FormContentValidator.types";

export default class FormContentValidator extends BaseObject {
    private readonly settings: FormContentValidatorSettings;

    constructor(settings: FormContentValidatorSettings) {
        super();
        this.settings = settings;
    }

    public async validate() {

    }
}