import Context from "sap/ui/model/odata/v4/Context";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import ContextManagerBase from "ui5/genatrix/odata/ContextManagerBase";
import { ContextManagerBaseSettings } from "ui5/genatrix/types/odata/ContextManagerBase.types";

/**
 * @namespace ui5.genatrix.odata.v4
 */
export default class ContextManager extends ContextManagerBase {
    private readonly model: ODataModel;

    constructor(model: ODataModel, settings: ContextManagerBaseSettings) {
        super(settings);
        this.model = model;
    }

    public async create() {
        const context = await this.callContextProvider();

        if (context) {
            if (context.isA<Context>("sap.ui.model.odata.v4.Context")) {
                return context;
            } else {
                throw new Error("sap.ui.model.odata.v4.Context instance must be provided by the contextProvider function");
            }
        }

        if (this.getFormMode() === FormMode.Create) {
            return this.createModelEntry();
        } else {
            return this.loadModelEntry();
        }
    }

    public reset() {
        this.model.resetChanges()
    }

    private createModelEntry() {
        const context = this.model.createEntry(this.getEntitySetPath(), {
            properties: this.getInitialData()
        });

        if (!context) {
            throw new Error("Context (sap.ui.model.odata.v2) could not be created for the entity set: " + this.getEntitySet());
        }

        this.setContext(context);
        return context;
    }

    private async loadModelEntry() {
        const contextRef = this.getContextRef();

        if (!contextRef) {
            throw new Error("contextRef is required when formMode is not Create and no contextProvider is specified");
        }

        if (contextRef instanceof Context) {
            this.setContext(contextRef);
            return contextRef;
        } else {
            const path = this.model.createKey(this.getEntitySetPath(), contextRef);
            return this.createBindingContext(path);
        }
    }

    private createBindingContext(path: string): Promise<Context> {
        return new Promise((resolve, reject) => {
            this.model.createBindingContext(path, undefined, undefined, (context: Context | null) => {
                if (context) {
                    this.setContext(context);
                    resolve(context);
                } else {
                    reject(new Error(`Binding context not found: "${path}" (invalid path or data not loaded)`));
                }
            });
        });
    }
}