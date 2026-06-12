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
            displayOrder: settings.displayOrder,
            propertyConfigurations: settings.propertyConfigurations
        }));
    }

    public async generate() {
        const properties = await this.parseMetadata();

        for (const property of properties) {
            if (property.excluded) {
                continue;
            }

            const content: FormContent = {
                property: property,
                labelControl: this.createLabel(property.label),
                readonlyControl: this.createText(property)
            };

            if (!property.readonly) {
                switch (property.type) {
                    case "Edm.Boolean":
                        content.editableControl = this.createCheckBox(property);
                        break;
                    case "Edm.Date":
                        content.editableControl = this.createDatePicker(property);
                        break;
                    case "Edm.DateTime":
                        if (property.displayFormat === "Date") {
                            content.editableControl = this.createDatePicker(property);
                        } else {
                            content.editableControl = this.createDateTimePicker(property);
                        }

                        break;
                    case "Edm.DateTimeOffset":
                        content.editableControl = this.createDateTimePicker(property);
                        break;
                    case "Edm.Time":
                        content.editableControl = this.createTimePicker(property);
                        break;
                    default:
                        content.editableControl = this.createInput(property);
                        break;
                }
            }

            this.addContent(content);
        }

        return this.getContent();
    }
}