import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";
import { FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";

/**
 * @namespace ui5.genatrix.generator.v4
 */
export default class FormContentGenerator extends FormContentGeneratorBase {
    private readonly model: ODataModel;

    constructor(model: ODataModel, settings: FormContentGeneratorBaseSettings) {
        super(settings);
        this.model = model;
    }

    public async generate() {
        return this.getContent();
    }
}