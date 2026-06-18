import CheckBox from "sap/m/CheckBox";
import Label from "sap/m/Label";
import Text from "sap/m/Text";
import EventProvider from "sap/ui/base/EventProvider";
import UI5Element from "sap/ui/core/Element";
import Messaging from "sap/ui/core/Messaging";
import Title from "sap/ui/core/Title";
import Model from "sap/ui/model/Model";
import FormDatePicker from "ui5/genatrix/extension/control/FormDatePicker";
import FormDateTimePicker from "ui5/genatrix/extension/control/FormDateTimePicker";
import FormInput from "ui5/genatrix/extension/control/FormInput";
import FormTimePicker from "ui5/genatrix/extension/control/FormTimePicker";
import { PropertyConstraintType } from "ui5/genatrix/form/enum/PropertyConstraintType";
import FormTypeGenerator from "ui5/genatrix/generator/FormTypeGenerator";
import TypeGeneratorBase from "ui5/genatrix/generator/TypeGeneratorBase";
import ChangeManager from "ui5/genatrix/odata/ChangeManager";
import MetadataParserBase from "ui5/genatrix/odata/MetadataParserBase";
import {
    FormContent,
    FormContentGeneratorBase$RefreshContentEventHandler,
    FormContentGeneratorBaseSettings
} from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";
import { ChangeManager$ApplyConstraintEvent } from "ui5/genatrix/types/odata/ChangeManager.types";
import { EntityTypeProperty } from "ui5/genatrix/types/odata/MetadataParserBase.types";

/**
 * @namespace ui5.genatrix.generator
 */
export default abstract class FormContentGeneratorBase<T extends Model = Model> extends EventProvider {
    private readonly settings: FormContentGeneratorBaseSettings<T>;
    private readonly metadataParser: MetadataParserBase<T>;
    private readonly typeGenerator: TypeGeneratorBase;
    private readonly changeManager: ChangeManager;
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

        this.changeManager = new ChangeManager({
            model: settings.model,
            contextManager: settings.contextManager,
            propertyConstraints: settings.propertyConstraints
        });

        this.changeManager.attachApplyConstraint(this.onApplyConstraint, this);
    }

    public async generate() {
        const properties = await this.parseMetadata();

        for (const property of properties) {
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

    public getContent() {
        const controls: UI5Element[] = [];
        const addedProperties: string[] = [];

        for (const group of this.settings.formGroups) {
            const groupProperties = group.getPropertyList()?.split(",") || [];
            controls.push(new Title({ text: group.getTitle() }));

            for (const property of groupProperties) {
                const content = this.content.find(cont => cont.property.name === property);

                if (content && content.property.visible && addedProperties.includes(content.property.name) === false) {
                    controls.push(content.labelControl);

                    if (content.property.readonly || !this.settings.editable) {
                        controls.push(content.readonlyControl);
                    } else {
                        if (content.editableControl) {
                            controls.push(content.editableControl);
                        }
                    }

                    addedProperties.push(property);
                }
            }
        }

        const remainingContent = this.content.filter(cont => cont.property.visible && addedProperties.includes(cont.property.name) === false);

        for (const content of remainingContent) {
            controls.push(content.labelControl);

            if (content.property.readonly || !this.settings.editable) {
                controls.push(content.readonlyControl);
            } else {
                if (content.editableControl) {
                    controls.push(content.editableControl);
                }
            }
        }

        return controls;
    }

    public setEditable(editable: boolean) {
        this.settings.editable = editable;
    }

    public attachRefreshContent(handler: FormContentGeneratorBase$RefreshContentEventHandler, listener?: object) {
        this.attachEvent("refreshContent", handler, listener);
    }

    public fireRefreshContent() {
        this.fireEvent("refreshContent");
    }

    private async parseMetadata() {
        return this.metadataParser.parse();
    }

    private addContent(content: FormContent) {
        this.content.push(content);
    }

    private getPropertyValidation(propertyName: string) {
        return this.settings.propertyValidations.find(validation => validation.getName() === propertyName);
    }

    private createLabel(label: string) {
        const control = new Label({ text: label });
        Messaging.registerObject(control, true);
        return control;
    }

    private createText(property: EntityTypeProperty) {
        const layoutData = this.settings.propertyConfigurations.find(config => config.getName() === property.name)?.getLayoutData();
        const control = new Text({
            text: {
                path: property.name,
                type: this.typeGenerator.generate(property),
                formatter: (value: any) => {
                    if (value == null || value == "") {
                        return "–";
                    } else {
                        return value;
                    }
                }
            }
        });

        if (layoutData) {
            control.setLayoutData(layoutData);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    private createCheckBox(property: EntityTypeProperty) {
        const layoutData = this.settings.propertyConfigurations.find(config => config.getName() === property.name)?.getLayoutData();
        const control = new CheckBox({
            selected: {
                path: property.name,
                type: this.typeGenerator.generate(property)
            }
        });

        if (layoutData) {
            control.setLayoutData(layoutData);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    private createDatePicker(property: EntityTypeProperty) {
        const maximumDate = this.typeGenerator.getMaximumDateTimeValue(property);
        const minimumDate = this.typeGenerator.getMinimumDateTimeValue(property);
        const layoutData = this.settings.propertyConfigurations.find(config => config.getName() === property.name)?.getLayoutData();

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

        if (layoutData) {
            control.setLayoutData(layoutData);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    private createDateTimePicker(property: EntityTypeProperty) {
        const maximumDate = this.typeGenerator.getMaximumDateTimeValue(property);
        const minimumDate = this.typeGenerator.getMinimumDateTimeValue(property);
        const layoutData = this.settings.propertyConfigurations.find(config => config.getName() === property.name)?.getLayoutData();

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

        if (layoutData) {
            control.setLayoutData(layoutData);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    private createTimePicker(property: EntityTypeProperty) {
        const layoutData = this.settings.propertyConfigurations.find(config => config.getName() === property.name)?.getLayoutData();
        const control = new FormTimePicker({
            busyIndicatorDelay: 0,
            required: property.required,
            value: {
                path: property.name,
                type: this.typeGenerator.generate(property, this.getPropertyValidation(property.name))
            }
        });

        if (layoutData) {
            control.setLayoutData(layoutData);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    private createInput(property: EntityTypeProperty) {
        const layoutData = this.settings.propertyConfigurations.find(config => config.getName() === property.name)?.getLayoutData();
        const control = new FormInput({
            busyIndicatorDelay: 0,
            required: property.required,
            value: {
                path: property.name,
                type: this.typeGenerator.generate(property, this.getPropertyValidation(property.name))
            }
        });

        if (layoutData) {
            control.setLayoutData(layoutData);
        }

        Messaging.registerObject(control, true);
        return control;
    }

    private onApplyConstraint(event: ChangeManager$ApplyConstraintEvent) {
        const parameters = event.getParameters();
        const content = this.content.find(cont => cont.property.name === parameters.property);

        if (!content) {
            return;
        }

        if (parameters.type === PropertyConstraintType.Required) {
            if (!content.property.strictRequired && content.property.required !== parameters.value && content.editableControl) {
                content.property.required = parameters.value;

                switch (true) {
                    case content.editableControl instanceof FormDatePicker:
                    case content.editableControl instanceof FormDateTimePicker:
                    case content.editableControl instanceof FormTimePicker:
                    case content.editableControl instanceof FormInput:
                        content.editableControl.setRequired(parameters.value);
                        content.editableControl.setBindingTypeRequired(parameters.value);
                        break;
                }
            }
        } else {
            if (content.property.visible !== parameters.value) {
                content.property.visible = parameters.value;

                if (!parameters.value && parameters.clearValueOnHide) {
                    this.settings.contextManager.clearValue(parameters.property);
                }

                this.fireRefreshContent();
            }
        }
    }
}