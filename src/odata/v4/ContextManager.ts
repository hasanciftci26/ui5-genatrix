import Context from "sap/ui/model/odata/v4/Context";
import { ODataContextBinding$DataReceivedEvent } from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { FormMode } from "ui5/genatrix/form/enum/FormMode";
import ContextManagerBase from "ui5/genatrix/odata/ContextManagerBase";
import { ContextManagerBaseSettings } from "ui5/genatrix/types/odata/ContextManagerBase.types";
import ContextManagerError from "ui5/genatrix/util/ContextManagerError";

/**
 * @namespace ui5.genatrix.odata.v4
 */
export default class ContextManager extends ContextManagerBase<ODataModel> {
    constructor(settings: ContextManagerBaseSettings<ODataModel>) {
        super(settings);
    }

    public async create() {
        const context = await this.callContextProvider();

        if (context) {
            if (context.isA<Context>("sap.ui.model.odata.v4.Context")) {
                return context;
            } else {
                throw new ContextManagerError("sap.ui.model.odata.v4.Context instance must be provided by the contextProvider function");
            }
        }

        if (this.getFormMode() === FormMode.Create) {
            return this.createModelEntry();
        } else {
            return this.loadModelEntry();
        }
    }

    public reset() {
        this.getModel().resetChanges(this.getUpdateGroupId());
    }

    private createModelEntry() {
        const listBinding = this.getModel().bindList(this.getEntitySetPath(), undefined, [], [], {
            $$updateGroupId: this.getUpdateGroupId()
        });

        const context = listBinding.create(this.getInitialData(), false, true, false);

        this.setContext(context);
        return context;
    }

    private async loadModelEntry() {
        const contextRef = this.getContextRef();

        if (!contextRef) {
            throw new ContextManagerError("contextRef is required when formMode is not Create and no contextProvider is specified");
        }

        if (contextRef instanceof Context) {
            this.setContext(contextRef);
            return contextRef;
        } else {
            const path = this.getEntitySetPath(); // TODO;
            return this.createBindingContext(path);
        }
    }

    private createBindingContext(path: string): Promise<Context> {
        return new Promise((resolve, reject) => {
            const contextBinding = this.getModel().bindContext(path, undefined, {
                $$updateGroupId: this.getUpdateGroupId()
            });

            contextBinding.attachEventOnce("dataReceived", (event: ODataContextBinding$DataReceivedEvent) => {
                if (event.getParameter("error")) {
                    reject(new Error(`Binding context not found: "${path}" (invalid path or data not loaded)`));
                } else {
                    const context = contextBinding.getBoundContext();
                    this.setContext(context);
                    resolve(context);
                }
            });
        });
    }
}