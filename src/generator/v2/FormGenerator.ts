import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import MetadataParser from "ui5/genatrix/odata/v2/MetadataParser";
import { FormGeneratorSettings } from "ui5/genatrix/types/generator/v2/FormGenerator.types";

/**
 * @namespace ui5.genatrix.generator.v2
 */
export default class FormGenerator extends BaseObject {
    private readonly settings: FormGeneratorSettings;
    private readonly metadataParser: MetadataParser;
    private form: SimpleForm;
    private readonly formContent: Control[] = [];

    constructor(settings: FormGeneratorSettings) {
        super();
        this.settings = settings;

        this.metadataParser = new MetadataParser({
            controlId: settings.controlId,
            model: settings.oDataModel,
            formMode: settings.formMode,
            requiredProperties: settings.requiredProperties,
            readonlyProperties: settings.readonlyProperties,
            excludedProperties: settings.excludedProperties,
            keysAlwaysRequired: settings.keysAlwaysRequired,
            keysAlwaysIncluded: settings.keysAlwaysIncluded,
            propertyOptions: settings.propertyOptions
        });
    }

    public async generateForm() {
        const content = await this.generateFormContent();

        this.form = new SimpleForm({
            content: content
        });

        return this.form;
    }

    public async generateFormContent() {
        await this.metadataParser.getEntityProperties(this.settings.entitySet);
        return this.formContent;
    }
}