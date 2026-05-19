import Input from "sap/m/Input";
import Label from "sap/m/Label";
import { ManagedObject$ModelContextChangeEvent } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import BindingMode from "sap/ui/model/BindingMode";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import EmbeddedFormRenderer from "ui5/genatrix/form/v2/EmbeddedFormRenderer";
import { EmbeddedFormSettings } from "ui5/genatrix/types/form/v2/EmbeddedForm.types";

/**
 * @namespace ui5.genatrix.form.v2
 */
export default class EmbeddedForm extends Control {
    public static readonly metadata: MetadataOptions = {
        library: "ui5.genatrix",
        properties: {
            entitySet: { type: "string" },
            oDataModelName: { type: "string" },
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
            initialized: { type: "boolean", visibility: "hidden", defaultValue: false }
        },
        aggregations: {
            form: { type: "sap.ui.layout.form.SimpleForm", multiple: false, visibility: "hidden" }
        }
    };
    public static renderer = EmbeddedFormRenderer;

    constructor(settings?: EmbeddedFormSettings);
    constructor(id?: string, settings?: EmbeddedFormSettings);

    constructor(idOrSettings?: string | EmbeddedFormSettings, settings?: EmbeddedFormSettings) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }

        this.initForm(typeof idOrSettings === "string" ? settings : idOrSettings);
        this.attachModelContextChange(this.onModelContextChange, this);
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

    public commit() {

    }

    private onModelContextChange(event: ManagedObject$ModelContextChangeEvent) {
        const model = this.getModel();

        if (!this.isInitialized() && model instanceof ODataModel) {
            model.setDefaultBindingMode(BindingMode.TwoWay);
        }
    }

    private initForm(settings?: EmbeddedFormSettings) {
        const form = new SimpleForm(`${this.getId()}--Form`, {
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

    private throwRuntimeError(message: string): never {
        throw new Error(`${message} - ${this.getId()}`);
    }
}