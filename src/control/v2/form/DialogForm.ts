import Button from "sap/m/Button";
import { ButtonType, TitleAlignment } from "sap/m/library";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import { URI } from "sap/ui/core/library";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import FormMode from "ui5/genatrix/control/enum/form/FormMode";
import DialogFormRenderer from "ui5/genatrix/control/v2/form/DialogFormRenderer";
import DialogGenerator from "ui5/genatrix/generator/core/DialogGenerator";
import FormGenerator from "ui5/genatrix/generator/v2/FormGenerator";
import { DialogFormSettings } from "ui5/genatrix/types/control/v2/form/DialogForm.types";
import { DialogGenerator$CloseEvent, DialogGenerator$SubmitEvent } from "ui5/genatrix/types/generator/core/DialogGenerator.types";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";

/**
 * @namespace ui5.genatrix.control.v2.form
 */
export default class DialogForm<InitialDataT extends Record<string, any> = Record<string, any>> extends Control {
    public static metadata: MetadataOptions = {
        library: "ui5.genatrix",
        properties: {
            entitySet: { type: "string" },
            formMode: { type: "ui5.genatrix.control.enum.form.FormMode", defaultValue: FormMode.Create },
            initialData: { type: "object" },
            buttonText: { type: "string" },
            buttonIcon: { type: "sap.ui.core.URI", defaultValue: "sap-icon://add" },
            buttonType: { type: "sap.m.ButtonType", defaultValue: ButtonType.Default },
            dialogTitle: { type: "string" },
            dialogTitleAlignment: { type: "sap.m.TitleAlignment", defaultValue: TitleAlignment.Auto },
            submitButtonText: { type: "string" },
            submitButtonIcon: { type: "sap.ui.core.URI" },
            submitButtonType: { type: "sap.m.ButtonType", defaultValue: ButtonType.Emphasized },
            closeButtonText: { type: "string" },
            closeButtonIcon: { type: "sap.ui.core.URI" },
            closeButtonType: { type: "sap.m.ButtonType", defaultValue: ButtonType.Default },
            datePattern: { type: "string" },
            timePattern: { type: "string" },
            dateTimeSeparator: { type: "string", defaultValue: " " },
            dateFirst: { type: "boolean", defaultValue: true },
            groupingSeparator: { type: "string" },
            decimalSeparator: { type: "string" },
            closeDialogOnSuccess: { type: "boolean", defaultValue: true },
            showBusyOnSubmit: { type: "boolean", defaultValue: true },
            requiredProperties: { type: "string" },
            readonlyProperties: { type: "string" },
            excludedProperties: { type: "string" },
            keysAlwaysIncluded: { type: "boolean", defaultValue: true },
            oDataModelName: { type: "string" }
        },
        defaultAggregation: "propertyOptions",
        aggregations: {
            propertyOptions: { type: "ui5.genatrix.metadata.form.PropertyOption", multiple: true, singularName: "propertyOption" },
            formGroups: { type: "ui5.genatrix.metadata.form.FormGroup", multiple: true, singularName: "formGroup" },
            validationLogics: { type: "ui5.genatrix.metadata.form.v2.ValidationLogic", multiple: true, singularName: "validationLogic" },
            button: { type: "sap.m.Button", multiple: false, visibility: "hidden" }
        }
    };
    public static renderer = DialogFormRenderer;
    private dialogGenerator: DialogGenerator;
    private formGenerator: FormGenerator;
    private context: Context;

    constructor(settings?: DialogFormSettings<InitialDataT>);
    constructor(id?: string, settings?: DialogFormSettings<InitialDataT>);

    constructor(idOrSettings?: string | DialogFormSettings<InitialDataT>, settings?: DialogFormSettings<InitialDataT>) {
        if (typeof idOrSettings === "string") {
            super(idOrSettings, settings);
        } else {
            super(idOrSettings);
        }
    }

    public override init() {
        const button = new Button(`${this.getId()}--Button`, {
            text: this.getButtonText(),
            icon: this.getButtonIcon(),
            type: this.getButtonType()
        });

        button.attachPress(this.onButtonPress, this);
        this.setAggregation("button", button);
    }

    public setButtonText(value?: string) {
        this.setProperty("buttonText", value);
        this.getButton().setText(value);
        return this;
    }

    public setButtonIcon(value?: URI) {
        this.setProperty("buttonIcon", value);
        this.getButton().setIcon(value);
        return this;
    }

    public setButtonType(value?: ButtonType) {
        this.setProperty("buttonType", value);
        this.getButton().setType(value);
        return this;
    }

    public closeDialog() {

    }

    private async onButtonPress() {
        this.showBusy();

        const dialog = this.generateDialog();
        const form = await this.generateForm();
        const context = await this.resolveContext();

        dialog.addContent(form);
        dialog.setBindingContext(context);
        dialog.open();

        this.hideBusy();
    }

    private generateDialog() {
        if (this.dialogGenerator) {
            this.dialogGenerator.destroy();
        }

        this.dialogGenerator = new DialogGenerator({
            title: this.getDialogTitle() || this.getDefaultDialogTitle(),
            titleAlignment: this.getDialogTitleAlignment() || TitleAlignment.Auto,
            addSubmitButton: this.getFormMode() !== "Display",
            submitButtonText: this.getSubmitButtonText() || this.getDefaultSubmitButtonText(),
            submitButtonIcon: this.getSubmitButtonIcon(),
            submitButtonType: this.getSubmitButtonType() || ButtonType.Emphasized,
            closeButtonText: this.getCloseButtonText() || this.getDefaultCloseButtonText(),
            closeButtonIcon: this.getCloseButtonIcon(),
            closeButtonType: this.getCloseButtonType() || ButtonType.Default,
            oDataModel: this.getODataModel()
        });

        this.dialogGenerator.attachSubmit(this.onDialogSubmit, this);
        this.dialogGenerator.attachClose(this.onDialogClose, this);

        return this.dialogGenerator.generate();
    }

    private async generateForm() {
        if (this.formGenerator) {
            this.formGenerator.destroy();
        }

        this.formGenerator = new FormGenerator({
            controlId: this.getId(),
            entitySet: this.getEntitySetOrThrow(),
            oDataModel: this.getODataModel(),
            formMode: this.getFormMode() || FormMode.Create,
            datePattern: this.getDatePattern(),
            timePattern: this.getTimePattern(),
            dateTimeSeparator: this.getDateTimeSeparator(),
            dateFirst: this.getDateFirst(),
            groupingSeparator: this.getGroupingSeparator(),
            decimalSeparator: this.getDecimalSeparator(),
            requiredProperties: this.getRequiredProperties(),
            readonlyProperties: this.getReadonlyProperties(),
            excludedProperties: this.getExcludedProperties(),
            keysAlwaysIncluded: this.getKeysAlwaysIncluded() ?? true,
            propertyOptions: this.getPropertyOptions(),
            formGroups: this.getFormGroups()
        });

        return this.formGenerator.generateForm();
    }

    private getDefaultSubmitButtonText() {
        if (this.getSubmitButtonIcon()) {
            return;
        }

        switch (this.getFormMode()) {
            case "Create":
                return LibraryBundle.getText("genatrix.button.create");
            case "Update":
                return LibraryBundle.getText("genatrix.button.update");
            case "Delete":
                return LibraryBundle.getText("genatrix.button.delete");
        }
    }

    private getDefaultCloseButtonText() {
        if (this.getCloseButtonIcon()) {
            return;
        }

        return LibraryBundle.getText("genatrix.button.close");
    }

    private getDefaultDialogTitle() {
        switch (this.getFormMode()) {
            case "Create":
                return LibraryBundle.getText("genatrix.title.create", [this.getEntitySet()]);
            case "Update":
                return LibraryBundle.getText("genatrix.title.update", [this.getEntitySet()]);
            case "Delete":
                return LibraryBundle.getText("genatrix.title.delete", [this.getEntitySet()]);
            default:
                return LibraryBundle.getText("genatrix.title.display", [this.getEntitySet()]);
        }
    }

    private async resolveContext() {
        if (this.getFormMode() === "Create") {
            this.createNewContext();
        } else {
            await this.loadExistingContext();
        }

        return this.context;
    }

    private createNewContext() {
        this.context = this.getODataModel().createEntry(`/${this.getEntitySet()}`, {
            properties: this.getInitialData()
        }) as Context;
    }

    private async loadExistingContext() {

    }

    private onDialogSubmit(event: DialogGenerator$SubmitEvent) {
        event.getParameters();
    }

    private async onDialogClose(event: DialogGenerator$CloseEvent) {
        await this.getODataModel().resetChanges([this.context.getPath()], true, true);
        event.getParameter("dialog").close();
    }

    private showBusy(submit = false) {
        if (submit) {
            if (this.getShowBusyOnSubmit()) {
                BusyIndicator.show(0);
            }
        } else {
            BusyIndicator.show(0);
        }
    }

    private hideBusy(submit = false) {
        if (submit) {
            if (this.getShowBusyOnSubmit()) {
                BusyIndicator.hide();
            }
        } else {
            BusyIndicator.hide();
        }
    }

    private getEntitySetOrThrow() {
        const entitySet = this.getEntitySet();

        if (!entitySet) {
            throw new Error("entitySet is a required property and must match an EntitySet name in your OData service - " + this.getId());
        }

        return entitySet;
    }

    private getODataModel() {
        const model = this.getModel(this.getODataModelName());

        if (model instanceof ODataModel === false) {
            throw new Error("ODataModel (sap.ui.model.odata.v2) not found. Set the oDataModelName property if you are using a named model - " + this.getId());
        }

        return model;
    }

    private getButton() {
        return this.getAggregation("button") as Button;
    }
}