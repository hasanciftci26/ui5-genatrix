import BaseObject from "sap/ui/base/Object";
import Context from "sap/ui/model/odata/v2/Context";
import FormMode from "ui5/genatrix/form/enum/FormMode";
import { ContextManagerSettings } from "ui5/genatrix/types/odata/v2/ContextManager.types";

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

        if (contextRef instanceof Context) {
            this.context = contextRef;
            return contextRef;
        } else {
            const path = this.settings.oDataModel.createKey(`/${this.settings.entitySet}`, contextRef);
            return this.createBindingContext(path);
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