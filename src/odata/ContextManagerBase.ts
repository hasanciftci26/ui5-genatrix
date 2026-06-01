import BaseObject from "sap/ui/base/Object";
import Context from "sap/ui/model/Context";
import { ContextManagerBaseSettings } from "ui5/genatrix/types/odata/ContextManagerBase.types";

/**
 * @namespace ui5.genatrix.odata
 */
export default abstract class ContextManagerBase extends BaseObject {
    private readonly settings: ContextManagerBaseSettings;
    private context: Context;

    constructor(settings: ContextManagerBaseSettings) {
        super();
        this.settings = settings;
    }

    public abstract create(): Promise<Context>;
    public abstract reset(): void;

    public getContext() {
        return this.context;
    }

    protected setContext(context: Context) {
        this.context = context;
    }

    protected getEntitySet() {
        return this.settings.entitySet;
    }

    protected getEntitySetPath() {
        return "/" + this.settings.entitySet;
    }

    protected getFormMode() {
        return this.settings.formMode;
    }

    protected getInitialData() {
        return this.settings.initialData;
    }

    protected getContextProvider() {
        return this.settings.contextProvider;
    }

    protected getContextRef() {
        return this.settings.contextRef;
    }

    protected async callContextProvider() {
        if (this.settings.contextProvider) {
            this.context = await Promise.resolve(this.settings.contextProvider());
            return this.context;
        }
    }
}