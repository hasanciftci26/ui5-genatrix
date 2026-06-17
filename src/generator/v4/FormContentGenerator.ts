import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";
import MetadataParser from "ui5/genatrix/odata/v4/MetadataParser";
import { FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";

/**
 * @namespace ui5.genatrix.generator.v4
 */
export default class FormContentGenerator extends FormContentGeneratorBase<ODataModel> {
    constructor(settings: FormContentGeneratorBaseSettings<ODataModel>) {
        super(settings, new MetadataParser({
            entitySet: settings.entitySet,
            model: settings.model,
            formMode: settings.formMode,
            requiredProperties: settings.requiredProperties,
            readonlyProperties: settings.readonlyProperties,
            excludedProperties: settings.excludedProperties,
            displayOrder: settings.displayOrder,
            propertyConfigurations: settings.propertyConfigurations,
            propertyConstraints: settings.propertyConstraints
        }));
    }
}