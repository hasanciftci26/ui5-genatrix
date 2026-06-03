import Label from "sap/m/Label";
import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import Model from "sap/ui/model/Model";
import FormInput from "ui5/genatrix/extension/control/FormInput";
import FormTypeGenerator from "ui5/genatrix/generator/FormTypeGenerator";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import { FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default abstract class FormContentGeneratorBase<T extends Model = Model> extends BaseObject {
    private readonly settings: FormContentGeneratorBaseSettings<T>;
    private readonly metadataParser: MetadataParserBase<T>;
    private readonly typeGenerator: FormTypeGenerator;
    private readonly content: Control[] = [];

    constructor(settings: FormContentGeneratorBaseSettings<T>, metadataParser: MetadataParserBase<T>) {
        super();
        this.settings = settings;
        this.metadataParser = metadataParser;

        this.typeGenerator = new FormTypeGenerator({
            datePattern: settings.datePattern,
            timePattern: settings.timePattern,
            dateTimeSeparator: settings.dateTimeSeparator,
            dateFirst: settings.dateFirst,
            groupingEnabled: settings.groupingEnabled,
            groupingSeparator: settings.groupingSeparator,
            groupingSize: settings.groupingSize,
            decimalSeparator: settings.decimalSeparator,
            parseEmptyValueToZero: settings.parseEmptyValueToZero,
            propertyConfigurations: settings.propertyConfigurations,
            propertyValidations: settings.propertyValidations
        });
    }

    public abstract generate(): Promise<Control[]>;

    public getContent() {
        return this.content;
    }

    protected async parseMetadata() {
        return this.metadataParser.parse();
    }

    protected getEntitySet() {
        return this.settings.entitySet;
    }

    protected getModel() {
        return this.settings.model;
    }

    protected addContent(control: Control) {
        this.content.push(control);
    }

    protected getPropertyConfiguration(propertyName: string) {
        return this.settings.propertyConfigurations.find(config => config.getName() === propertyName);
    }

    protected getPropertyValidation(propertyName: string) {
        return this.settings.propertyValidations.find(validation => validation.getName() === propertyName);
    }

    protected createLabel(label: string) {
        return new Label({ text: label });
    }

    protected createInput(property: EntityTypeProperty) {
        return new FormInput({
            // propertyName: property.name,
            busyIndicatorDelay: 0,
            required: property.required,
            value: {
                path: property.name,
                type: this.typeGenerator.generate(property)
            }
        });
    }
}