import Label from "sap/m/Label";
import BaseObject from "sap/ui/base/Object";
import UI5Element from "sap/ui/core/Element";
import Title from "sap/ui/core/Title";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Layout from "ui5/genatrix/control/enum/form/Layout";
import CustomDatePicker from "ui5/genatrix/control/extension/CustomDatePicker";
import CustomDateTimePicker from "ui5/genatrix/control/extension/CustomDateTimePicker";
import CustomInput from "ui5/genatrix/control/extension/CustomInput";
import CustomTimePicker from "ui5/genatrix/control/extension/CustomTimePicker";
import ControlGenerator from "ui5/genatrix/generator/core/ControlGenerator";
import MetadataParser from "ui5/genatrix/odata/v2/MetadataParser";
import { FormElement } from "ui5/genatrix/types/generator/global/FormGenerator.types";
import { FormGeneratorSettings } from "ui5/genatrix/types/generator/v2/FormGenerator.types";

/**
 * @namespace ui5.genatrix.generator.v2
 */
export default class FormGenerator extends BaseObject {
    private readonly settings: FormGeneratorSettings;
    private readonly metadataParser: MetadataParser;
    private readonly controlGenerator: ControlGenerator;
    private form: SimpleForm;
    private formContent: UI5Element[];

    constructor(settings: FormGeneratorSettings) {
        super();
        this.settings = settings;

        this.metadataParser = new MetadataParser({
            type: "Form",
            classId: settings.controlId,
            model: settings.oDataModel,
            formMode: settings.formMode,
            requiredProperties: settings.requiredProperties,
            readonlyProperties: settings.readonlyProperties,
            excludedProperties: settings.excludedProperties,
            keysAlwaysIncluded: settings.keysAlwaysIncluded,
            propertyOptions: settings.propertyOptions
        });

        this.controlGenerator = new ControlGenerator({
            controlId: settings.controlId,
            datePattern: settings.datePattern,
            timePattern: settings.timePattern,
            dateTimeSeparator: settings.dateTimeSeparator,
            dateFirst: settings.dateFirst,
            groupingEnabled: settings.groupingEnabled,
            groupingSeparator: settings.groupingSeparator,
            groupingSize: settings.groupingSize,
            decimalSeparator: settings.decimalSeparator,
            parseEmptyValueToZero: settings.parseEmptyValueToZero,
            propertyOptions: settings.propertyOptions,
            validationLogics: settings.validationLogics,
            valueLists: settings.valueLists
        });
    }

    public async generateForm() {
        const content = await this.generateFormContent();

        this.form = new SimpleForm({
            editable: true,
            adjustLabelSpan: false,
            content: content
        });

        this.setFormLayout();
        return this.form;
    }

    public async generateFormContent() {
        const properties = await this.metadataParser.getEntityProperties(this.settings.entitySet);
        const elements: FormElement[] = [];

        for (const property of properties) {
            elements.push({
                propertyName: property.name,
                label: new Label({ text: property.label }),
                control: this.controlGenerator.generate(property),
                grouped: false
            });
        }

        this.formContent = this.getGroupedContent(elements);
        return this.formContent;
    }

    public async validateValues() {
        const invalidProperties: string[] = [];

        for (const control of this.formContent) {
            switch (true) {
                case control instanceof CustomInput:
                case control instanceof CustomDatePicker:
                case control instanceof CustomDateTimePicker:
                case control instanceof CustomTimePicker:
                    try {
                        await control.checkValuesValidity();
                        control.setValueState("None");
                        control.setValueStateText("");
                    } catch (error) {
                        invalidProperties.push(control.getPropertyName());
                        control.setValueState("Error");
                        control.setValueStateText((error as { message: string; }).message);
                    }

                    break;
            }
        }

        return invalidProperties;
    }

    private getGroupedContent(elements: FormElement[]) {
        const controls: UI5Element[] = [];

        if (this.settings.formGroups.length) {
            const groups = this.settings.formGroups.sort((a, b) => (a.getIndex() ?? 0) - (b.getIndex() ?? 0));

            for (const group of groups) {
                const groupProperties = group.getPropertyList()?.split(",") || [];
                controls.push(new Title({ text: group.getTitle() }));

                for (const property of groupProperties) {
                    const element = elements.find(e => e.propertyName === property);

                    if (element) {
                        element.grouped = true;
                        controls.push(element.label);
                        controls.push(element.control);
                    }
                }
            }

            // Add remaining properties to the last group
            for (const element of elements.filter(e => e.grouped === false)) {
                controls.push(element.label);
                controls.push(element.control);
            }
        } else {
            for (const element of elements) {
                controls.push(element.label);
                controls.push(element.control);
            }
        }

        return controls;
    }

    private setFormLayout() {
        const layoutData = this.settings.formLayout?.getLayoutData();

        this.form.setLayout(this.settings.formLayout?.getLayout() || Layout.ResponsiveGridLayout);
        this.form.setColumnsXL(this.settings.formLayout?.getColumnsXL() ?? 1);
        this.form.setColumnsL(this.settings.formLayout?.getColumnsL() ?? 1);
        this.form.setColumnsM(this.settings.formLayout?.getColumnsM() ?? 1);
        this.form.setLabelSpanXL(this.settings.formLayout?.getLabelSpanXL() ?? 12);
        this.form.setLabelSpanL(this.settings.formLayout?.getLabelSpanL() ?? 12);
        this.form.setLabelSpanM(this.settings.formLayout?.getLabelSpanM() ?? 12);
        this.form.setLabelSpanS(this.settings.formLayout?.getLabelSpanS() ?? 12);
        this.form.setEmptySpanXL(this.settings.formLayout?.getEmptySpanXL() ?? 0);
        this.form.setEmptySpanL(this.settings.formLayout?.getEmptySpanL() ?? 0);
        this.form.setEmptySpanM(this.settings.formLayout?.getEmptySpanM() ?? 0);
        this.form.setEmptySpanS(this.settings.formLayout?.getEmptySpanS() ?? 0);

        if (layoutData) {
            this.form.setLayoutData(layoutData);
        }
    }
}