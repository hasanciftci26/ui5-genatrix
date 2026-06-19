import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";
import { FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";

/**
 * @namespace ui5.genatrix.generator.v4
 */
export default class FormContentGenerator extends FormContentGeneratorBase<ODataModel> {
    constructor(settings: FormContentGeneratorBaseSettings<ODataModel>) {
        super(settings);
    }
}