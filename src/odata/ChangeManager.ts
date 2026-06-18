import EventProvider from "sap/ui/base/EventProvider";
import ChangeReason from "sap/ui/model/ChangeReason";
import { Model$PropertyChangeEvent } from "sap/ui/model/Model";
import {
    ChangeManager$ApplyConstraintEventHandler,
    ChangeManager$ApplyConstraintEventParameters,
    ChangeManagerSettings
} from "ui5/genatrix/types/odata/ChangeManager.types";

/**
 * @namespace ui5.genatrix.odata
 */
export default class ChangeManager extends EventProvider {
    private readonly settings: ChangeManagerSettings;

    constructor(settings: ChangeManagerSettings) {
        super();
        this.settings = settings;
        settings.model.attachPropertyChange(this.onPropertyChange, this);
    }

    public attachApplyConstraint(handler: ChangeManager$ApplyConstraintEventHandler, listener?: object) {
        this.attachEvent("applyConstraint", handler, listener);
    }

    public fireApplyConstraint(parameters: ChangeManager$ApplyConstraintEventParameters) {
        this.fireEvent("applyConstraint", parameters);
    }

    private onPropertyChange(event: Model$PropertyChangeEvent) {
        const reason = event.getParameter("reason");
        const context = event.getParameter("context");
        const property = event.getParameter("path");

        if (context?.getPath() === this.settings.contextManager.getContext().getPath() && reason === ChangeReason.Binding && property) {
            const constraints = this.settings.propertyConstraints.filter((constraint) => {
                return constraint.getName() && constraint.getRules().some(rule => rule.getDependsOn() === property);
            });

            for (const constraint of constraints) {
                this.fireApplyConstraint({
                    property: constraint.getName() as string,
                    type: constraint.getType(),
                    value: constraint.evaluate()
                });
            }
        }
    }
}