import BaseObject from "sap/ui/base/Object";
import UI5Element from "sap/ui/core/Element";
import ResponsiveTable from "sap/m/Table";
import GridTable from "sap/ui/table/Table";
import Context from "sap/ui/model/odata/v2/Context";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import { ContextManagerSettings } from "ui5/genatrix/types/odata/v2/ContextManager.types";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import { ListMode } from "sap/m/library";
import { SelectionMode } from "sap/ui/table/library";
import AnalyticalTable from "sap/ui/table/AnalyticalTable";

/**
 * @namespace ui5.genatrix.odata.v2
 */
export default class ContextManager<T extends Record<string, any> = Record<string, any>> extends BaseObject {
    private readonly settings: ContextManagerSettings<T>;
    private context: Context;

    constructor(settings: ContextManagerSettings<T>) {
        super();
        this.settings = settings;
    }

    public getContext() {
        return this.context;
    }

    public async create() {
        if (this.settings.contextProvider) {
            this.context = await Promise.resolve(this.settings.contextProvider());
            return this.context;
        }

        if (this.settings.formMode === FormMode.Create) {
            return this.createModelEntry();
        } else {
            return this.loadModelEntry();
        }
    }

    public reset() {
        void this.settings.oDataModel.resetChanges([this.context.getPath()], true, true);
    }

    private createModelEntry() {
        const context = this.settings.oDataModel.createEntry(`/${this.settings.entitySet}`, {
            properties: this.settings.initialData
        });

        if (!context) {
            throw new Error("Context (sap.ui.model.odata.v2) could not be created for the entity set: " + this.settings.entitySet);
        }

        this.context = context;
        return context;
    }

    private async loadModelEntry() {
        const contextRef = this.settings.contextRef;

        if (!contextRef) {
            throw new Error("contextRef is required when formMode is not Create and no contextProvider is specified");
        }

        if (typeof contextRef === "string") {
            return this.loadContextFromTable(contextRef);
        } else if (contextRef instanceof Context) {
            this.context = contextRef;
            return contextRef;
        } else {
            const path = this.settings.oDataModel.createKey(`/${this.settings.entitySet}`, contextRef);
            return this.createBindingContext(path);
        }
    }

    private async loadContextFromTable(tableId: string) {
        const table = UI5Element.getElementById(tableId) || this.settings.view?.byId(tableId);
        let path: string;

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
                throw new Error(`Element "${tableId}" is not a supported table (sap.m.Table, sap.ui.table.Table, sap.ui.comp.smarttable.SmartTable)`);
        }

        return this.createBindingContext(path);
    }

    private getContextPathFromResponsiveTable(table: ResponsiveTable) {
        if ([ListMode.SingleSelect, ListMode.SingleSelectLeft, ListMode.SingleSelectMaster].includes(table.getMode()) === false) {
            throw new Error(`Unsupported table mode "${table.getMode()}". Expected one of: SingleSelect, SingleSelectLeft, SingleSelectMaster`);
        }

        const selectedItem = table.getSelectedItem();

        if (!selectedItem) {
            throw new Error(this.settings.rowSelectionErrorMessage);
        }

        const context = selectedItem.getBindingContext(this.settings.oDataModelName);

        if (context instanceof Context === false) {
            throw new Error("Selected item has no valid OData V2 binding context. Ensure the table items are bound to an entity set");
        }

        return context.getPath();
    }

    private getContextPathFromGridTable(table: GridTable) {
        if (table.getSelectionMode() !== SelectionMode.Single) {
            throw new Error(`Unsupported table mode "${table.getSelectionMode()}". Expected: Single`);
        }

        const selectedIndices = table.getSelectedIndices();
        const selectedIndex = selectedIndices[0];

        if (selectedIndex == null) {
            throw new Error(this.settings.rowSelectionErrorMessage);
        }

        const context = table.getContextByIndex(selectedIndex);

        if (context instanceof Context === false) {
            throw new Error("Selected row has no valid OData V2 binding context. Ensure the table rows are bound to an entity set");
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
            default:
                throw new Error("Unsupported table type for the SmartTable. Expected: ResponsiveTable, Table, AnalyticalTable");
        }
    }

    private createBindingContext(path: string): Promise<Context> {
        return new Promise((resolve, reject) => {
            this.settings.oDataModel.createBindingContext(path, undefined, undefined, (context: Context | null) => {
                if (context) {
                    this.context = context;
                    resolve(context);
                } else {
                    reject(new Error(`Binding context not found: "${path}" (invalid path or data not loaded)`));
                }
            });
        });
    }
}