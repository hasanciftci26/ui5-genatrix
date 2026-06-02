import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { form as formLayoutUI5 } from "sap/ui/layout/library";
import BindingMode from "sap/ui/model/BindingMode";
import Model from "sap/ui/model/Model";
import ODataModelV2 from "sap/ui/model/odata/v2/ODataModel";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";
import EmbeddedFormRenderer from "ui5/genatrix/form/EmbeddedFormRenderer";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import FormContentGeneratorBase from "ui5/genatrix/generator/FormContentGeneratorBase";
import FormContentGeneratorV2 from "ui5/genatrix/generator/v2/FormContentGenerator";
import FormContentGeneratorV4 from "ui5/genatrix/generator/v4/FormContentGenerator";
import ContextManagerBase from "ui5/genatrix/odata/ContextManagerBase";
import ContextManagerV2 from "ui5/genatrix/odata/v2/ContextManager";
import ContextManagerV4 from "ui5/genatrix/odata/v4/ContextManager";
import { EmbeddedFormSettings } from "ui5/genatrix/types/form/EmbeddedForm.types";
import CustomMessageBox from "ui5/genatrix/util/CustomMessageBox";
import FormContentValidatorBase from "ui5/genatrix/validator/FormContentValidatorBase";
import FormContentValidatorV2 from "ui5/genatrix/validator/v2/FormContentValidator";
import FormContentValidatorV4 from "ui5/genatrix/validator/v4/FormContentValidator";

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
            initialData: { type: "object", bindable: false },
            contextProvider: { type: "function" },
            contextRef: { type: "any" },
            bindContextToForm: { type: "boolean", defaultValue: true },
            formInitialized: { type: "boolean", visibility: "hidden", defaultValue: false }
        },
        defaultAggregation: "propertyConfigurations",
        aggregations: {
            propertyConfigurations: { type: "ui5.genatrix.form.PropertyConfiguration", multiple: true, singularName: "propertyConfiguration" }
        },
        events: {
            initialized: {},
            contextCreated: {
                parameters: {
                    context: { type: "sap.ui.model.Context" }
                }
            }
        }
    };
    public static renderer = EmbeddedFormRenderer;
    private innerForm: SimpleForm;
    private generator: FormContentGeneratorBase;
    private validator: FormContentValidatorBase;
    private contextManager: ContextManagerBase;

    constructor(settings?: EmbeddedFormSettings<T>);
    constructor(id?: string, settings?: EmbeddedFormSettings<T>);

    constructor(idOrSettings?: string | EmbeddedFormSettings<T>, settings?: EmbeddedFormSettings<T>) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.createForm(typeof idOrSettings === "string" ? settings : idOrSettings);
        this.attachModelContextChange(this.onModelContextChange, this);
    }

    public getInnerForm() {
        return this.innerForm;
    }

    public getContext() {
        return this.contextManager.getContext();
    }

    public setEntitySet(value?: string) {
        let entitySet = value;

        if (entitySet?.startsWith("/")) {
            entitySet = entitySet.slice(1);
        }

        this.setProperty("entitySet", entitySet);
    }

    public setUpdateGroupId(value?: string) {
        if (this.isInitialized()) {
            this.throwRuntimeError("updateGroupId property cannot be changed after the form initialization");
        }

        this.setProperty("updateGroupId", value);
    }

    public isInitialized() {
        return this.getProperty("formInitialized") as boolean;
    }

    public async commit() {

    }

    public async refresh() {

    }

    public reset() {
        this.contextManager.reset();
    }

    private async onModelContextChange() {
        const model = this.getModel();

        if (!this.isInitialized() && model && this.isODataModel(model)) {
            this.generator = this.createGenerator(model);
            this.validator = this.createValidator(this.generator, model);
            this.contextManager = this.createContextManager(model);

            try {
                const content = await this.generator.generate();
                const context = await this.contextManager.create();

                for (const control of content) {
                    this.innerForm.addContent(control);
                }

                this.innerForm.setModel(model);

                if (this.getBindContextToForm()) {
                    this.innerForm.setBindingContext(context);
                }

                this.innerForm.setBusy(false);

                model.setDefaultBindingMode(BindingMode.TwoWay);
                this.setProperty("formInitialized", true);
                this.fireInitialized();
                this.fireContextCreated({ context: context });
                this.detachModelContextChange(this.onModelContextChange, this);
            } catch (error) {
                let errorMessage = "Unexpected error has occured";

                if (this.hasMessage(error)) {
                    errorMessage = error.message;
                }

                CustomMessageBox.error(errorMessage);
                this.throwRuntimeError(errorMessage);
            }
        }
    }

    private createForm(settings?: EmbeddedFormSettings<T>) {
        this.innerForm = new SimpleForm(`${this.getId()}--Form`, {
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
    }

    private createGenerator(model: ODataModelV2 | ODataModelV4) {
        if (model.isA<ODataModelV2>("sap.ui.model.odata.v2.ODataModel")) {
            return this.createGeneratorV2(model);
        } else {
            return this.createGeneratorV4(model);
        }
    }

    private createGeneratorV2(model: ODataModelV2) {
        const generator = new FormContentGeneratorV2({
            entitySet: this.getEntitySetOrThrow(),
            model: model,
            formMode: this.getFormMode(),
            requiredProperties: this.getAllRequiredProperties(),
            readonlyProperties: this.getAllReadonlyProperties(),
            excludedProperties: this.getAllExcludedProperties(),
            propertyConfigurations: this.getPropertyConfigurations()
        });

        return generator;
    }

    private createGeneratorV4(model: ODataModelV4) {
        const generator = new FormContentGeneratorV4({
            entitySet: this.getEntitySetOrThrow(),
            model: model,
            formMode: this.getFormMode(),
            requiredProperties: this.getAllRequiredProperties(),
            readonlyProperties: this.getAllReadonlyProperties(),
            excludedProperties: this.getAllExcludedProperties(),
            propertyConfigurations: this.getPropertyConfigurations()
        });

        return generator;
    }

    private createValidator(generator: FormContentGeneratorBase, model: ODataModelV2 | ODataModelV4) {
        if (model.isA<ODataModelV2>("sap.ui.model.odata.v2.ODataModel")) {
            return this.createValidatorV2(generator, model);
        } else {
            return this.createValidatorV4(generator, model);
        }
    }

    private createValidatorV2(generator: FormContentGeneratorBase, model: ODataModelV2) {
        const validator = new FormContentValidatorV2({
            generator: generator,
            model: model
        });

        return validator;
    }

    private createValidatorV4(generator: FormContentGeneratorBase, model: ODataModelV4) {
        const validator = new FormContentValidatorV4({
            generator: generator,
            model: model
        });

        return validator;
    }

    private createContextManager(model: ODataModelV2 | ODataModelV4) {
        if (model.isA<ODataModelV2>("sap.ui.model.odata.v2.ODataModel")) {
            return this.createContextManagerV2(model);
        } else {
            return this.createContextManagerV4(model);
        }
    }

    private createContextManagerV2(model: ODataModelV2) {
        const contextManager = new ContextManagerV2({
            entitySet: this.getEntitySetOrThrow(),
            model: model,
            updateGroupId: this.getUpdateGroupId(),
            formMode: this.getFormMode(),
            initialData: this.getInitialData(),
            contextProvider: this.getContextProvider(),
            contextRef: this.getContextRef()
        });

        return contextManager;
    }

    private createContextManagerV4(model: ODataModelV4) {
        const contextManager = new ContextManagerV4({
            entitySet: this.getEntitySetOrThrow(),
            model: model,
            updateGroupId: this.getUpdateGroupId(),
            formMode: this.getFormMode(),
            initialData: this.getInitialData(),
            contextProvider: this.getContextProvider(),
            contextRef: this.getContextRef()
        });

        return contextManager;
    }

    private getEntitySetOrThrow() {
        const entitySet = this.getEntitySet();

        if (!entitySet) {
            throw new Error("entitySet is a required property");
        }

        return entitySet;
    }

    private getAllRequiredProperties() {
        const formLevelProperties = this.getRequiredProperties()?.split(",") || [];
        const configLevelProperties = this.getPropertyConfigurations().filter(config => config.getName() && config.getRequired())
            .map(config => config.getName() as string);

        return Array.from(new Set([...formLevelProperties, ...configLevelProperties]));
    }

    private getAllReadonlyProperties() {
        const formLevelProperties = this.getReadonlyProperties()?.split(",") || [];
        const configLevelProperties = this.getPropertyConfigurations().filter(config => config.getName() && config.getReadonly())
            .map(config => config.getName() as string);

        return Array.from(new Set([...formLevelProperties, ...configLevelProperties]));
    }

    private getAllExcludedProperties() {
        const formLevelProperties = this.getExcludedProperties()?.split(",") || [];
        const configLevelProperties = this.getPropertyConfigurations().filter(config => config.getName() && config.getExcluded())
            .map(config => config.getName() as string);

        return Array.from(new Set([...formLevelProperties, ...configLevelProperties]));
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