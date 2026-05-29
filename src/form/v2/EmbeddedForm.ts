import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import View from "sap/ui/core/mvc/View";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { form as formLayoutUI5 } from "sap/ui/layout/library";
import BindingMode from "sap/ui/model/BindingMode";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import EmbeddedFormRenderer from "ui5/genatrix/form/v2/EmbeddedFormRenderer";
import FormContentGenerator from "ui5/genatrix/generator/v2/FormContentGenerator";
import ContextManager from "ui5/genatrix/odata/v2/ContextManager";
import { EmbeddedFormSettings } from "ui5/genatrix/types/form/v2/EmbeddedForm.types";
import CustomMessageBox from "ui5/genatrix/util/CustomMessageBox";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";
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
            initialData: { type: "object", bindable: false },
            contextProvider: { type: "function" },
            contextRef: { type: "any" },
            rowSelectionErrorMessage: { type: "string", defaultValue: LibraryBundle.getText("genatrix.error.selectTableRow") },
            formInitialized: { type: "boolean", visibility: "hidden", defaultValue: false }
        },
        events: {
            initalized: {
                parameters: {
                    context: { type: "sap.ui.model.odata.v2.Context" }
                }
            }
        }
    };
    public static renderer = EmbeddedFormRenderer;
    private innerForm: SimpleForm;
    private generator: FormContentGenerator;
    private validator: FormContentValidator;
    private contextManager: ContextManager;

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

        if (!this.isInitialized() && model instanceof ODataModel) {
            this.generator = this.createGenerator();
            this.validator = this.createValidator(this.generator);
            this.contextManager = this.createContextManager(model);

            try {
                const content = await this.generator.generate();
                const context = await this.contextManager.create();

                for (const control of content) {
                    this.innerForm.addContent(control);
                }

                this.innerForm.setModel(model);
                this.innerForm.setBindingContext(context);
                this.innerForm.setBusy(false);

                model.setDefaultBindingMode(BindingMode.TwoWay);
                this.setProperty("formInitialized", true);
                this.fireInitialized({ context: context });
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

    private createContextManager(model: ODataModel) {
        const contextManager = new ContextManager({
            oDataModel: model,
            oDataModelName: this.getODataModelName(),
            entitySet: this.getEntitySetOrThrow(),
            formMode: this.getFormMode(),
            view: this.getView(),
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

    private getView() {
        let parent = this.getParent();

        while (parent) {
            if (parent.isA<View>("sap.ui.core.mvc.View")) {
                return parent;
            }

            parent = parent.getParent();
        }
    }

    private hasMessage(obj: any): obj is { message: string; } {
        return typeof obj === "object" && "message" in obj && typeof obj.message === "string" && obj.message != null && obj.message !== "";
    }

    private throwRuntimeError(message: string): never {
        throw new Error(`${message} - ${this.getId()}`);
    }
}