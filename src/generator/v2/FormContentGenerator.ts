import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";
import MetadataParser from "ui5/genatrix/odata/v2/MetadataParser";
import { FormContent, FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";

/**
 * @namespace ui5.genatrix.generator.v2
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
            propertyConfigurations: settings.propertyConfigurations
        }));
    }

    // TODO
    public async generate() {
        const properties = await this.parseMetadata();

        for (const property of properties) {
            const content: FormContent = {
                property: property,
                labelControl: this.createLabel(property.label),
                readonlyControl: this.createText(property, property.readonly)
            };

            if (!property.readonly) {
                switch (property.type) {
                    case "Edm.Boolean":
                        // TODO CheckBox
                        break;
                    case "Edm.Date":
                        // TODO DatePicker
                        break;
                    case "Edm.DateTime":
                        // TODO DatePicker or DateTimePicker
                        break;
                    case "Edm.DateTimeOffset":
                        // TODO DateTimePicker
                        break;
                    case "Edm.Time":
                        // TODO TimePicker
                        break;
                    default:
                        // TODO Input
                        break;
                }
            }

            this.addContent(content);
        }

        return this.getControls();
    }
}