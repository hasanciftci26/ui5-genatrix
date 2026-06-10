import CheckBox from "sap/m/CheckBox";
import Label from "sap/m/Label";
import Text from "sap/m/Text";
import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import Messaging from "sap/ui/core/Messaging";
import Model from "sap/ui/model/Model";
import FormDatePicker from "ui5/genatrix/extension/control/FormDatePicker";
import FormDateTimePicker from "ui5/genatrix/extension/control/FormDateTimePicker";
import FormInput from "ui5/genatrix/extension/control/FormInput";
import FormTimePicker from "ui5/genatrix/extension/control/FormTimePicker";
import FormTypeGenerator from "ui5/genatrix/generator/FormTypeGenerator";
import TypeGeneratorBase from "ui5/genatrix/generator/TypeGeneratorBase";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import { FormContent, FormContentGeneratorBaseSettings } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default abstract class FormContentGeneratorBase<T extends Model = Model> extends BaseObject {
    private readonly settings: FormContentGeneratorBaseSettings<T>;
    private readonly metadataParser: MetadataParserBase<T>;
    private readonly typeGenerator: TypeGeneratorBase;
    private readonly content: FormContent[] = [];

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
            propertyConfigurations: settings.propertyConfigurations
        });
    }

    public abstract generate(): Promise<Control[]>;

    public getContent() {
        return this.content;
    }

    public getControls() {
        const controls: Control[] = [];

        for (const content of this.content) {
            controls.push(content.labelControl);
            controls.push(content.readonlyControl);

            if (content.editableControl) {
                controls.push(content.editableControl);
            }
        }

        return controls;
    }

    public switchMode(editable: boolean) {
        const modifiableContent = this.content.filter(cont => cont.property.readonly === false);

        for (const content of modifiableContent) {
            content.readonlyControl.setVisible(editable === false);

            if (content.editableControl) {
                content.editableControl.setVisible(editable === true);
            }
        }
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

    protected addContent(content: FormContent) {
        this.content.push(content);
    }

    protected getPropertyConfiguration(propertyName: string) {
        return this.settings.propertyConfigurations.find(config => config.getName() === propertyName);
    }

    protected getPropertyValidation(propertyName: string) {
        return this.settings.propertyValidations.find(validation => validation.getName() === propertyName);
    }

    protected createLabel(label: string) {
        const control = new Label({ text: label });
        Messaging.registerObject(control, true);
        return control;
    }

    protected createText(property: EntityTypeProperty, visible: boolean) {
        const control = new Text({
            visible: visible,
            text: {
                path: property.name,
                type: this.typeGenerator.generate(property),
                formatter: (value: any) => {
                    if (value == null || value == "") {
                        return "—";
                    } else {
                        return value;
                    }
                }
            }
        });

        Messaging.registerObject(control, true);
        return control;
    }

    protected createCheckBox(property: EntityTypeProperty) {
        const control = new CheckBox({
            selected: {
                path: property.name,
                type: this.typeGenerator.generate(property)
            }
        });

        Messaging.registerObject(control, true);
        return control;
    }

    protected createDatePicker(property: EntityTypeProperty) {
        const maximumDate = this.typeGenerator.getMaximumDateTimeValue(property);
        const minimumDate = this.typeGenerator.getMinimumDateTimeValue(property);

        const control = new FormDatePicker({
            busyIndicatorDelay: 0,
            required: property.required,
            value: {
                path: property.name,
                type: this.typeGenerator.generate(property, this.getPropertyValidation(property.name))
            }
        });

        if (maximumDate) {
            control.setMaxDate(maximumDate);
        }

        if (minimumDate) {
            control.setMinDate(minimumDate);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    protected createDateTimePicker(property: EntityTypeProperty) {
        const maximumDate = this.typeGenerator.getMaximumDateTimeValue(property);
        const minimumDate = this.typeGenerator.getMinimumDateTimeValue(property);
        
        const control = new FormDateTimePicker({
            busyIndicatorDelay: 0,
            required: property.required,
            value: {
                path: property.name,
                type: this.typeGenerator.generate(property, this.getPropertyValidation(property.name))
            }
        });

        if (maximumDate) {
            control.setMaxDate(maximumDate);
        }

        if (minimumDate) {
            control.setMinDate(minimumDate);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    protected createTimePicker(property: EntityTypeProperty) {
        const control = new FormTimePicker({
            busyIndicatorDelay: 0,
            required: property.required,
            value: {
                path: property.name,
                type: this.typeGenerator.generate(property, this.getPropertyValidation(property.name))
            }
        });

        Messaging.registerObject(control, true);
        return control;
    }

    protected createInput(property: EntityTypeProperty) {
        const control = new FormInput({
            busyIndicatorDelay: 0,
            required: property.required,
            value: {
                path: property.name,
                type: this.typeGenerator.generate(property, this.getPropertyValidation(property.name))
            }
        });

        Messaging.registerObject(control, true);
        return control;
    }
}