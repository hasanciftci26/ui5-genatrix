import Button from "sap/m/Button";
import Title from "sap/m/Title";
import Toolbar from "sap/m/Toolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { form as formLayoutUI5 } from "sap/ui/layout/library";
import BindingMode from "sap/ui/model/BindingMode";
import Model from "sap/ui/model/Model";
import ODataModelV2 from "sap/ui/model/odata/v2/ODataModel";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";
import EmbeddedFormRenderer from "ui5/genatrix/form/EmbeddedFormRenderer";
import { FormMode } from "ui5/genatrix/form/enum/FormMode";
import { EmbeddedFormSettings } from "ui5/genatrix/types/form/EmbeddedForm.types";
import { FormContentGeneratorBase$RefreshContentEvent } from "ui5/genatrix/types/generator/FormContentGeneratorBase.types";
import ContextManagerError from "ui5/genatrix/util/ContextManagerError";
import ServiceContainer from "ui5/genatrix/form/service/ServiceContainer";

/**
 * @namespace ui5.genatrix.form
 */
export default class EmbeddedForm<T extends Record<string, any> = Record<string, any>> extends Control {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        properties: {
            entitySet: { type: "string" },
            oDataModelName: { type: "string" },
            updateGroupId: { type: "string", defaultValue: "ui5Genatrix" },
            formMode: { type: "ui5.genatrix.form.enum.FormMode", defaultValue: FormMode.Create },
            title: { type: "string" },
            editable: { type: "boolean", defaultValue: true },
            editTogglable: { type: "boolean", defaultValue: true },
            layout: { type: "sap.ui.layout.form.SimpleFormLayout", defaultValue: formLayoutUI5.SimpleFormLayout.ResponsiveGridLayout },
            columnsXL: { type: "int", defaultValue: 1 },
            columnsL: { type: "int", defaultValue: 1 },
            columnsM: { type: "int", defaultValue: 1 },
            labelSpanXL: { type: "int", defaultValue: 12 },
            labelSpanL: { type: "int", defaultValue: 12 },
            labelSpanM: { type: "int", defaultValue: 12 },
            labelSpanS: { type: "int", defaultValue: 12 },
            emptySpanXL: { type: "int", defaultValue: 12 },
            emptySpanL: { type: "int", defaultValue: 0 },
            emptySpanM: { type: "int", defaultValue: 0 },
            emptySpanS: { type: "int", defaultValue: 0 },
            datePattern: { type: "string" },
            timePattern: { type: "string" },
            dateTimeSeparator: { type: "string", defaultValue: " " },
            dateFirst: { type: "boolean", defaultValue: true },
            groupingEnabled: { type: "boolean", defaultValue: true },
            groupingSeparator: { type: "string" },
            groupingSize: { type: "int", defaultValue: 3 },
            decimalSeparator: { type: "string" },
            parseEmptyValueToZero: { type: "boolean", defaultValue: false },
            requiredProperties: { type: "string" },
            readonlyProperties: { type: "string" },
            excludedProperties: { type: "string" },
            displayOrder: { type: "string" },
            initialData: { type: "object", bindable: false },
            contextProvider: { type: "function", bindable: false },
            contextRef: { type: "any" },
            bindContextToForm: { type: "boolean", defaultValue: true },
            validateOnlyVisible: { type: "boolean", defaultValue: true },
            formInitialized: { type: "boolean", visibility: "hidden", defaultValue: false }
        },
        defaultAggregation: "propertyConfigurations",
        aggregations: {
            propertyConfigurations: { type: "ui5.genatrix.form.PropertyConfiguration", multiple: true, singularName: "propertyConfiguration" },
            propertyValidations: { type: "ui5.genatrix.form.PropertyValidation", multiple: true, singularName: "propertyValidation" },
            propertyConstraints: { type: "ui5.genatrix.form.PropertyConstraint", multiple: true, singularName: "propertyConstraint" },
            formGroups: { type: "ui5.genatrix.form.FormGroup", multiple: true, singularName: "formGroup" },
            innerForm: { type: "sap.ui.layout.form.SimpleForm", multiple: false, visibility: "hidden" }
        },
        events: {
            initialized: {},
            contextCreated: {
                parameters: {
                    context: { type: "sap.ui.model.Context" }
                }
            },
            modeChanged: {
                parameters: {
                    editable: { type: "boolean" }
                }
            }
        }
    };
    public static renderer = EmbeddedFormRenderer;
    private services: ServiceContainer<T>;
    private toolbar: Toolbar;
    private title?: Title;
    private editButton: Button;
    private displayButton: Button;

    constructor(settings?: EmbeddedFormSettings<T>);
    constructor(id?: string, settings?: EmbeddedFormSettings<T>);

    constructor(idOrSettings?: string | EmbeddedFormSettings<T>, settings?: EmbeddedFormSettings<T>) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.setAggregation("innerForm", this.createForm(typeof idOrSettings === "string" ? settings : idOrSettings));
        this.attachModelContextChange(this.onModelContextChange, this);
    }

    public getInnerForm() {
        return this.getAggregation("innerForm") as SimpleForm;
    }

    public getContext() {
        return this.services.getContextManager().getContext();
    }

    public setEntitySet(value?: string) {
        if (this.isInitialized()) {
            this.throwRuntimeError("entitySet property cannot be modified after the form initialization");
        }

        let entitySet = value;

        if (entitySet?.startsWith("/")) {
            entitySet = entitySet.slice(1);
        }

        this.setProperty("entitySet", entitySet);
        return this;
    }

    public setFormMode(value: FormMode | keyof typeof FormMode) {
        if (this.isInitialized()) {
            this.throwRuntimeError("formMode property cannot be modified after the form initialization");
        }

        this.setProperty("formMode", value);
        return this;
    }

    public setTitle(value?: string) {
        this.setProperty("title", value);
        this.title?.setText(value);
    }

    public setUpdateGroupId(value?: string) {
        if (this.isInitialized()) {
            this.throwRuntimeError("updateGroupId property cannot be modified after the form initialization");
        }

        this.setProperty("updateGroupId", value);
        return this;
    }

    public setEditable(value: boolean) {
        const formMode = this.getFormMode() || FormMode.Create;

        this.setProperty("editable", value);
        this.services.getGenerator().setEditable(value);
        this.fireModeChanged({ editable: value });

        if (formMode === FormMode.Create || formMode === FormMode.Update) {
            this.editButton.setVisible(value === false);
            this.displayButton.setVisible(value === true);

            if (this.isInitialized()) {
                const content = this.services.getGenerator().getContent();
                this.getInnerForm().removeAllContent();

                for (const item of content) {
                    this.getInnerForm().addContent(item);
                }
            }
        }

        return this;
    }

    public setEditTogglable(value: boolean) {
        this.setProperty("editTogglable", value);

        if (!this.isInitialized() || this.getFormMode() === FormMode.Delete || this.getFormMode() === FormMode.Display) {
            return;
        }

        if (value) {
            this.editButton.setVisible(this.getEditable() === false);
            this.displayButton.setVisible(this.getEditable() === true);
        } else {
            this.editButton.setVisible(false);
            this.displayButton.setVisible(false);
        }

        if (!this.title) {
            this.toolbar.setVisible(value);
        }

        return this;
    }

    public isInitialized() {
        return this.getProperty("formInitialized") as boolean;
    }

    public async commit() {

    }

    public async refresh() {

    }

    public reset() {
        this.services.getContextManager().reset();
    }

    private async onModelContextChange() {
        const model = this.getModel(this.getODataModelName());

        if (!this.isInitialized() && model && this.isODataModel(model)) {
            this.services = this.createServices(model);
            this.services.getGenerator().attachRefreshContent(this.onRefreshContent, this);

            try {
                const context = await this.services.getContextManager().create();
                const content = await this.services.getGenerator().generate();

                for (const control of content) {
                    this.getInnerForm().addContent(control);
                }

                model.setDefaultBindingMode(BindingMode.TwoWay);

                this.getInnerForm().setModel(model);
                this.getInnerForm().setBusy(false);

                if (this.getBindContextToForm()) {
                    this.getInnerForm().setBindingContext(context);
                }

                this.setProperty("formInitialized", true);

                this.fireInitialized();
                this.fireContextCreated({ context: context });

                this.detachModelContextChange(this.onModelContextChange, this);
            } catch (error) {
                let errorMessage = "Unexpected error has occured";

                if (this.hasMessage(error)) {
                    errorMessage = error.message;
                }

                if (error instanceof ContextManagerError === false) {
                    this.services.getContextManager().reset();
                }

                this.throwRuntimeError(errorMessage);
            }
        }
    }

    private createForm(settings?: EmbeddedFormSettings<T>) {
        const form = new SimpleForm(`${this.getId()}--Form`, {
            busyIndicatorDelay: 0,
            busy: true,
            editable: true,
            adjustLabelSpan: false,
            layout: settings?.layout || formLayoutUI5.SimpleFormLayout.ResponsiveGridLayout,
            columnsXL: settings?.columnsXL ?? 1,
            columnsL: settings?.columnsL ?? 1,
            columnsM: settings?.columnsM ?? 1,
            labelSpanXL: settings?.labelSpanXL ?? 12,
            labelSpanL: settings?.labelSpanL ?? 12,
            labelSpanM: settings?.labelSpanM ?? 12,
            labelSpanS: settings?.labelSpanS ?? 12,
            emptySpanXL: settings?.emptySpanXL ?? 0,
            emptySpanL: settings?.emptySpanL ?? 0,
            emptySpanM: settings?.emptySpanM ?? 0,
            emptySpanS: settings?.emptySpanS ?? 0,
            layoutData: settings?.layoutData
        });

        this.toolbar = this.createToolbar(settings);
        form.setToolbar(this.toolbar);

        return form;
    }

    private createToolbar(settings?: EmbeddedFormSettings<T>) {
        const toolbar = new Toolbar({ visible: false });
        const formMode = settings?.formMode || FormMode.Create;
        const editTogglable = settings?.editTogglable ?? true;
        const editable = settings?.editable ?? true;

        if (settings?.title) {
            this.title = this.createTitle(settings.title);
            toolbar.addContent(this.title);
            toolbar.setVisible(true);
        }

        this.editButton = this.createEditButton();
        this.displayButton = this.createDisplayButton();

        toolbar.addContent(new ToolbarSpacer());
        toolbar.addContent(this.editButton);
        toolbar.addContent(this.displayButton);

        if ((formMode === FormMode.Create || formMode === FormMode.Update) && editTogglable) {
            toolbar.setVisible(true);
            this.editButton.setVisible(editable === false);
            this.displayButton.setVisible(editable === true);
        }

        return toolbar;
    }

    private createTitle(title: string | PropertyBindingInfo) {
        return new Title({ text: title });
    }

    private createEditButton() {
        const button = new Button({
            visible: false,
            icon: "sap-icon://edit",
            press: () => {
                this.setEditable(true);
            }
        });

        return button;
    }

    private createDisplayButton() {
        const button = new Button({
            visible: false,
            icon: "sap-icon://display",
            press: () => {
                this.setEditable(false);
            }
        });

        return button;
    }

    private createServices(model: ODataModelV2 | ODataModelV4) {
        const services = new ServiceContainer({
            entitySet: this.getEntitySetOrThrow(),
            model: model,
            updateGroupId: this.getUpdateGroupId(),
            formMode: this.getFormMode(),
            editable: this.getEditable(),
            datePattern: this.getDatePattern(),
            timePattern: this.getTimePattern(),
            dateTimeSeparator: this.getDateTimeSeparator(),
            dateFirst: this.getDateFirst(),
            groupingEnabled: this.getGroupingEnabled(),
            groupingSeparator: this.getGroupingSeparator(),
            groupingSize: this.getGroupingSize(),
            decimalSeparator: this.getDecimalSeparator(),
            parseEmptyValueToZero: this.getParseEmptyValueToZero(),
            requiredProperties: this.getRequiredProperties(),
            readonlyProperties: this.getReadonlyProperties(),
            excludedProperties: this.getExcludedProperties(),
            displayOrder: this.getDisplayOrder(),
            validateOnlyVisible: this.getValidateOnlyVisible(),
            initialData: this.getInitialData(),
            contextProvider: this.getContextProvider(),
            contextRef: this.getContextRef(),
            propertyConfigurations: this.getPropertyConfigurations(),
            propertyValidations: this.getPropertyValidations(),
            propertyConstraints: this.getPropertyConstraints(),
            formGroups: this.getFormGroups()
        });

        return services;
    }

    private onRefreshContent(event: FormContentGeneratorBase$RefreshContentEvent) {
        const generator = event.getSource();
        const content = generator.getContent();

        this.getInnerForm().removeAllContent();

        for (const item of content) {
            this.getInnerForm().addContent(item);
        }
    }

    private getEntitySetOrThrow() {
        const entitySet = this.getEntitySet();

        if (!entitySet) {
            throw new Error("entitySet is a required property");
        }

        return entitySet;
    }

    private isODataModel(model: Model): model is ODataModelV2 | ODataModelV4 {
        return model.isA<ODataModelV2>("sap.ui.model.odata.v2.ODataModel") || model.isA<ODataModelV4>("sap.ui.model.odata.v4.ODataModel");
    }

    private hasMessage(obj: any): obj is { message: string; } {
        return typeof obj === "object" && "message" in obj && typeof obj.message === "string" && obj.message != null && obj.message !== "";
    }

    private throwRuntimeError(message: string): never {
        throw new Error(`${message} - ${this.getId()}`);
    }
}