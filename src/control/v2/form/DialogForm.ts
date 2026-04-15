import Button from "sap/m/Button";
import { ButtonType, ListMode, TitleAlignment } from "sap/m/library";
import ResponsiveTable from "sap/m/Table";
import GridTable from "sap/ui/table/Table";
import ManagedObject from "sap/ui/base/ManagedObject";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Control from "sap/ui/core/Control";
import UI5Element, { MetadataOptions } from "sap/ui/core/Element";
import { URI } from "sap/ui/core/library";
import View from "sap/ui/core/mvc/View";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import FormMode from "ui5/genatrix/control/enum/form/FormMode";
import DialogFormRenderer from "ui5/genatrix/control/v2/form/DialogFormRenderer";
import DialogGenerator from "ui5/genatrix/generator/core/DialogGenerator";
import FormGenerator from "ui5/genatrix/generator/v2/FormGenerator";
import { DialogFormSettings } from "ui5/genatrix/types/control/v2/form/DialogForm.types";
import { DialogGenerator$CloseEvent } from "ui5/genatrix/types/generator/core/DialogGenerator.types";
import CustomMessageBox from "ui5/genatrix/util/CustomMessageBox";
import LibraryBundle from "ui5/genatrix/util/LibraryBundle";
import { SelectionMode } from "sap/ui/table/library";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import AnalyticalTable from "sap/ui/table/AnalyticalTable";

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
            dialogWidth: { type: "string" },
            dialogResizable: { type: "boolean", defaultValue: true },
            dialogDraggable: { type: "boolean", defaultValue: true },
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
            groupingEnabled: { type: "boolean", defaultValue: true },
            groupingSeparator: { type: "string" },
            groupingSize: { type: "int", defaultValue: 3 },
            decimalSeparator: { type: "string" },
            parseEmptyValueToZero: { type: "boolean", defaultValue: false },
            closeDialogOnSuccess: { type: "boolean", defaultValue: true },
            showBusyOnSubmit: { type: "boolean", defaultValue: true },
            requiredProperties: { type: "string" },
            readonlyProperties: { type: "string" },
            excludedProperties: { type: "string" },
            keysAlwaysIncluded: { type: "boolean", defaultValue: true },
            formValidationErrorMessage: { type: "string", defaultValue: LibraryBundle.getText("genatrix.error.formValidation") },
            selectRowErrorMessage: { type: "string", defaultValue: LibraryBundle.getText("genatrix.error.selectTableRow") },
            contextRef: { type: "any" },
            oDataModelName: { type: "string" },
            contextProvider: { type: "function" }
        },
        defaultAggregation: "propertyOptions",
        aggregations: {
            propertyOptions: { type: "ui5.genatrix.metadata.form.PropertyOption", multiple: true, singularName: "propertyOption" },
            formGroups: { type: "ui5.genatrix.metadata.form.FormGroup", multiple: true, singularName: "formGroup" },
            validationLogics: { type: "ui5.genatrix.metadata.form.v2.ValidationLogic", multiple: true, singularName: "validationLogic" },
            formLayout: { type: "ui5.genatrix.metadata.form.FormLayout", multiple: false },
            button: { type: "sap.m.Button", multiple: false, visibility: "hidden" }
        },
        events: {
            formValidationError: {
                allowPreventDefault: false,
                parameters: {
                    invalidProperties: { type: "string[]" }
                }
            }
        }
    };
    public static renderer = DialogFormRenderer;
    private dialogGenerator: DialogGenerator;
    private formGenerator: FormGenerator;
    private context: Context;
    private view?: View;

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

        if (context) {
            dialog.addContent(form);
            dialog.setBindingContext(context);
            dialog.open();
        }

        this.hideBusy();
    }

    private generateDialog() {
        if (this.dialogGenerator) {
            this.dialogGenerator.destroy();
        }

        this.dialogGenerator = new DialogGenerator({
            title: this.getDialogTitle() || this.getDefaultDialogTitle(),
            titleAlignment: this.getDialogTitleAlignment() || TitleAlignment.Auto,
            contentWidth: this.getDialogWidth(),
            resizable: this.getDialogResizable() ?? true,
            draggable: this.getDialogDraggable() ?? true,
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
            dateTimeSeparator: this.getDateTimeSeparator() ?? " ",
            dateFirst: this.getDateFirst() ?? true,
            groupingEnabled: this.getGroupingEnabled() ?? true,
            groupingSeparator: this.getGroupingSeparator(),
            groupingSize: this.getGroupingSize() ?? 3,
            decimalSeparator: this.getDecimalSeparator(),
            parseEmptyValueToZero: this.getParseEmptyValueToZero() ?? false,
            requiredProperties: this.getRequiredProperties(),
            readonlyProperties: this.getReadonlyProperties(),
            excludedProperties: this.getExcludedProperties(),
            keysAlwaysIncluded: this.getKeysAlwaysIncluded() ?? true,
            propertyOptions: this.getPropertyOptions(),
            formGroups: this.getFormGroups(),
            validationLogics: this.getValidationLogics(),
            formLayout: this.getFormLayout()
        });

        return this.formGenerator.generateForm();
    }

    private getDefaultSubmitButtonText() {
        if (this.getSubmitButtonIcon()) {
            return;
        }

        switch (this.getFormMode()) {
            case FormMode.Create:
                return LibraryBundle.getText("genatrix.button.create");
            case FormMode.Update:
                return LibraryBundle.getText("genatrix.button.update");
            case FormMode.Delete:
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
            case FormMode.Create:
                return LibraryBundle.getText("genatrix.title.create", [this.getEntitySet()]);
            case FormMode.Update:
                return LibraryBundle.getText("genatrix.title.update", [this.getEntitySet()]);
            case FormMode.Delete:
                return LibraryBundle.getText("genatrix.title.delete", [this.getEntitySet()]);
            default:
                return LibraryBundle.getText("genatrix.title.display", [this.getEntitySet()]);
        }
    }

    private async resolveContext() {
        if (this.getFormMode() === FormMode.Create) {
            return this.createNewContext();
        } else {
            const contextProvider = this.getContextProvider();

            if (contextProvider) {
                const context = await Promise.resolve(contextProvider());
                this.setContextRef(context);
            }

            return this.loadExistingContext();
        }
    }

    private createNewContext() {
        this.context = this.getODataModel().createEntry(`/${this.getEntitySet()}`, {
            properties: this.getInitialData()
        }) as Context;

        return this.context;
    }

    private async loadExistingContext() {
        const contextRef = this.getContextRef();

        if (!contextRef) {
            throw new Error("contextRef is a required property when the formMode is not Create - " + this.getId());
        }

        if (typeof contextRef === "string") {
            return this.loadContextFromTable(contextRef);
        } else if (contextRef instanceof Context) {
            this.context = contextRef;
            return this.context;
        } else {
            const path = this.getODataModel().createKey(`/${this.getEntitySetOrThrow()}`, contextRef);
            return this.createBindingContext(path);
        }
    }

    private async loadContextFromTable(tableId: string) {
        const table = UI5Element.getElementById(tableId) || this.getView()?.byId(tableId);
        let path: string | undefined;

        switch (true) {
            case table instanceof ResponsiveTable:
                path = this.getContextPathFromResponsiveTable(table);
                break;
            case table instanceof GridTable:
                path = this.getContextPathFromGridTable(table);
                break;
            case table instanceof SmartTable:
                path = this.getContextPathFromSmartTable(table);
                break;
            default:
                throw new Error(`Element "${tableId}" is not a supported table (ResponsiveTable, GridTable, SmartTable) - ` + this.getId());
        }

        if (!path) {
            return;
        }

        return this.createBindingContext(path);
    }

    private getContextPathFromResponsiveTable(table: ResponsiveTable) {
        if ([ListMode.SingleSelect, ListMode.SingleSelectLeft, ListMode.SingleSelectMaster].includes(table.getMode()) === false) {
            throw new Error(
                `Unsupported table mode "${table.getMode()}". Expected one of: SingleSelect, SingleSelectLeft, SingleSelectMaster - ` + this.getId()
            );
        }

        const selectedItem = table.getSelectedItem();

        if (!selectedItem) {
            const errorMessage = this.getSelectRowErrorMessage() || LibraryBundle.getText("genatrix.error.selectTableRow");
            CustomMessageBox.error(errorMessage);
            return;
        }

        const context = selectedItem.getBindingContext(this.getODataModelName());

        if (context instanceof Context === false) {
            throw new Error(
                "Selected item has no valid OData V2 binding context. Ensure the table items are bound to an entity set - " + this.getId()
            );
        }

        return context.getPath();
    }

    private getContextPathFromGridTable(table: GridTable) {
        if (table.getSelectionMode() !== SelectionMode.Single) {
            throw new Error(
                `Unsupported table mode "${table.getSelectionMode()}". Expected: Single - ` + this.getId()
            );
        }

        const selectedIndices = table.getSelectedIndices();
        const selectedIndex = selectedIndices[0];

        if (selectedIndex == null) {
            const errorMessage = this.getSelectRowErrorMessage() || LibraryBundle.getText("genatrix.error.selectTableRow");
            CustomMessageBox.error(errorMessage);
            return;
        }

        const context = table.getContextByIndex(selectedIndex);

        if (context instanceof Context === false) {
            throw new Error(
                "Selected row has no valid OData V2 binding context. Ensure the table rows are bound to an entity set - " + this.getId()
            );
        }

        return context.getPath();
    }

    private getContextPathFromSmartTable(table: SmartTable) {
        const innerTable = table.getTable();

        switch (true) {
            case innerTable instanceof ResponsiveTable:
                return this.getContextPathFromResponsiveTable(innerTable);
            case innerTable instanceof GridTable:
            case innerTable instanceof AnalyticalTable:
                return this.getContextPathFromGridTable(innerTable);
        }
    }

    private createBindingContext(path: string): Promise<Context> {
        return new Promise((resolve, reject) => {
            this.getODataModel().createBindingContext(path, undefined, undefined, (context: Context | null) => {
                if (context) {
                    this.context = context;
                    resolve(context);
                } else {
                    reject(new Error(`Binding context not found: "${path}" (invalid path or data not loaded) - ` + this.getId()));
                }
            });
        });
    }

    private onDialogSubmit() {
        if (this.getFormMode() === FormMode.Create || this.getFormMode() === FormMode.Update) {
            void this.submit();
        } else {
            void this.delete();
        }
    }

    private async submit() {
        this.showBusy(true);
        const invalidProperties = await this.formGenerator.validateValues();

        if (invalidProperties.length) {
            const errorMessage = this.getFormValidationErrorMessage();
            this.fireFormValidationError({ invalidProperties: invalidProperties });

            if (errorMessage) {
                CustomMessageBox.error(errorMessage);
            }

            this.hideBusy(true);
            return;
        }
    }

    private async delete() {

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

    private getView() {
        if (!this.view) {
            let parent = this.getParent();

            while (parent) {
                if (parent.isA("sap.ui.core.mvc.View")) {
                    this.view = parent as View;
                    break;
                }

                parent = (parent as ManagedObject).getParent();
            }
        }

        return this.view;
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

        if (model.getDefaultBindingMode() !== "TwoWay") {
            model.setDefaultBindingMode("TwoWay");
        }

        return model;
    }

    private getButton() {
        return this.getAggregation("button") as Button;
    }
}