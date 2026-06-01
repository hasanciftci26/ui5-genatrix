import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { FormContentValidatorBaseSettings } from "ui5/genatrix/types/validator/FormContentValidatorBase.types";
import FormContentValidatorBase from "ui5/genatrix/validator/FormContentValidatorBase";

/**
 * @namespace ui5.genatrix.validator.v4
 */
export default class FormContentValidator extends FormContentValidatorBase {
    private readonly model: ODataModel;

    constructor(model: ODataModel, settings: FormContentValidatorBaseSettings) {
        super(settings);
        this.model = model;
    }

    public async validate() {

    }
}