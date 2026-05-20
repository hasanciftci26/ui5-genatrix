import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import BindingMode from "sap/ui/model/BindingMode";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import EmbeddedFormRenderer from "ui5/genatrix/form/v2/EmbeddedFormRenderer";
import FormContentGenerator from "ui5/genatrix/generator/v2/FormContentGenerator";
import { EmbeddedFormSettings } from "ui5/genatrix/types/form/v2/EmbeddedForm.types";
import FormContentValidator from "ui5/genatrix/validator/v2/FormContentValidator";

/**
 * @namespace ui5.genatrix.form.v2
 */
export default class EmbeddedForm<T extends Record<string, any> = Record<string, any>> extends Control {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        properties: {
            entitySet: { type: "string" },
            oDataModelName: { type: "string" },
            formMode: { type: "ui5.genatrix.form.enum.FormMode" },
            layout: { type: "sap.ui.layout.form.SimpleFormLayout" },
            columnsXL: { type: "int" },
            columnsL: { type: "int" },
            columnsM: { type: "int" },
            labelSpanXL: { type: "int" },
            labelSpanL: { type: "int" },
            labelSpanM: { type: "int" },
            labelSpanS: { type: "int" },
            emptySpanXL: { type: "int" },
            emptySpanL: { type: "int" },
            emptySpanM: { type: "int" },
            emptySpanS: { type: "int" },
            initialData: { type: "object" },
            initialized: { type: "boolean", visibility: "hidden", defaultValue: false }
        },
        aggregations: {
            form: { type: "sap.ui.layout.form.SimpleForm", multiple: false, visibility: "hidden" }
        }
    };
    public static renderer = EmbeddedFormRenderer;
    private generator: FormContentGenerator;
    private validator: FormContentValidator;
    private context: Context;

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

    public getContext() {
        return this.context;
    }

    public setEntitySet(value?: string) {
        let entitySet = value;

        if (entitySet && entitySet.startsWith("/")) {
            entitySet = entitySet.slice(1);
        }

        this.setProperty("entitySet", entitySet);
    }

    public isInitialized() {
        return this.getProperty("initialized") as boolean;
    }

    public async commit() {

    }

    private async onModelContextChange() {
        const model = this.getModel();

        if (!this.isInitialized() && model instanceof ODataModel) {
            this.generator = this.createGenerator();
            this.validator = this.createValidator(this.generator);

            try {
                const content = await this.generator.generate();
                const form = this.getForm();

                this.context = await this.createContext(model);

                for (const control of content) {
                    form.addContent(control);
                }

                form.setBusy(false);
                model.setDefaultBindingMode(BindingMode.TwoWay);
                this.setProperty("initialized", true);
            } catch (error) {
                let errorMessage = "Unexpected error has occured";

                if (this.hasMessage(error)) {
                    errorMessage = error.message;
                }

                this.generator.destroy();
                this.validator.destroy();
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
            layout: settings?.layout || "ResponsiveGridLayout",
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
            emptySpanS: settings?.emptySpanS ?? 0
        });

        this.setAggregation("form", form);
    }

    private createGenerator() {
        const generator = new FormContentGenerator({
            entitySet: this.getEntitySetOrThrow()
        });

        return generator;
    }

    private createValidator(generator: FormContentGenerator) {
        const validator = new FormContentValidator({
            generator: generator
        });

        return validator;
    }

    // TODO for different modes (Create, Update, Read, Delete)
    private async createContext(model: ODataModel) {
        const entitySet = this.getEntitySetOrThrow();
        const context = model.createEntry(`/${entitySet}`, {
            properties: this.getInitialData()
        });

        if (!context) {
            this.throwRuntimeError("Context (sap.ui.model.odata.v2) could not be created for the entity set: " + entitySet);
        }

        return context;
    }

    private getForm() {
        return this.getAggregation("form") as SimpleForm;
    }

    private getEntitySetOrThrow() {
        const entitySet = this.getEntitySet();

        if (!entitySet) {
            this.throwRuntimeError("entitySet is a required property");
        }

        return entitySet;
    }

    private hasMessage(obj: any): obj is { message: string; } {
        return typeof obj === "object" && "message" in obj && typeof obj.message === "string" && obj.message != null && obj.message !== "";
    }

    private throwRuntimeError(message: string): never {
        throw new Error(`${message} - ${this.getId()}`);
    }
}